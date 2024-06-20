import usersService from "../service/usersService.js";
import utils from "../utils/utils.js";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import sendConfirmRegistrationEmail from "../config/config-nodemailder.js";

async function signup(req, res, next) {
  try {
    const result = await usersService.addUsertoDB({ ...req.body });

    if (result === "user already exists") {
      res.status(409).json({
        status: "failed",
        code: 409,
        message: "This email is already used",
      });
      return;
    }

    sendConfirmRegistrationEmail(result.email, result.verificationToken);

    res.status(201).json({
      status: "success",
      code: 201,
      message:
        "User created successfully. Now, check your email and confirm the registration.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      utils.handleValidationError(res, error.message);
      return;
    }

    next(error);
  }
}

async function verifyRegistration(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const result = await usersService.findUser({ verificationToken });

    if (!result) {
      res.status(404).json({ code: 404, message: "User not found" });
      return;
    }

    if (result.verify === true) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "Verification has already been passed",
      });
      return;
    }

    await usersService.updateUser(result.id, { verify: true });

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
}

async function repeatVerifyRegistration(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "Missing required field: => email",
      });
      return;
    }

    const result = await usersService.findUser({ email });

    if (!result) {
      res.status(404).json({ code: 404, message: "User not found" });
      return;
    }

    if (result.verify === true) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "Verification has already been passed",
      });
      return;
    }

    sendConfirmRegistrationEmail(result.email, result.verificationToken);

    res.json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "Missing fields. You must enter: email and password !",
      });
      return;
    }

    const result = await usersService.checkUserLoginData({ email, password });

    if (result === "email is wrong" || result === "password is wrong") {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: result,
      });
      return;
    }

    if (result.verify === false) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message:
          "You must confirm your registration first, then you can log in.",
      });
      return;
    }

    const token = await usersService.addUserToken(result);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Logged in successfully",
      data: {
        token,
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await usersService.removeUserToken(req.user.id);

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUserData(req, res, next) {
  try {
    const { id, email, subscription, avatarURL } = req.user;
    const userData = { id, email, subscription, avatarURL };

    res.status(200).json({ status: "success", code: 200, data: userData });
  } catch (error) {
    next(error);
  }
}

async function updateUserSubscription(req, res, next) {
  try {
    const userId = req.user.id;
    const { subscription } = req.body;

    if (!subscription) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "subscription: => this field is required",
      });
      return;
    }

    const updatedUser = await usersService.updateUser(userId, { subscription });

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "User's subscription updated",
      data: {
        email: req.user.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      utils.handleValidationError(res, error.message);
      return;
    }

    next(error);
  }
}

async function updateUserAvatar(req, res, next) {
  try {
    if (!req.file) {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: "You must add an avatar",
      });
      return;
    }

    const userId = req.user.id;
    const temporaryFilePath = req.file.path;

    const fileExtension = path.extname(req.file.originalname);
    const fileUniqueName = `${userId}${fileExtension}`;
    const filePath = path.join(process.cwd(), "public/avatars", fileUniqueName);

    const avatarImage = await Jimp.read(temporaryFilePath);
    await avatarImage.resize(250, 250).write(temporaryFilePath);

    await fs.rename(temporaryFilePath, filePath);

    const avatarUpdates = { avatarURL: `/avatars/${fileUniqueName}` };
    const updatedUser = await usersService.updateUser(userId, avatarUpdates);

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "User's avatar updated",
      data: {
        email: req.user.email,
        avatarURL: updatedUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

const usersController = {
  signup,
  verifyRegistration,
  repeatVerifyRegistration,
  login,
  logout,
  getCurrentUserData,
  updateUserSubscription,
  updateUserAvatar,
};

export default usersController;
