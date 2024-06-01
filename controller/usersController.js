import usersService from "../service/usersService.js";
import utils from "../utils/utils.js";

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

    res.status(201).json({
      status: "success",
      code: 201,
      message: "User created with success",
      data: {
        user: {
          email: result.email,
          subscription: result.subscription,
        },
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

async function login(req, res, next) {
  try {
    const result = await usersService.checkUserInDB({ ...req.body });

    if (result === "email is wrong" || result === "password is wrong") {
      res.status(400).json({
        status: "failed",
        code: 400,
        message: result,
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
    if (error.name === "ValidationError") {
      utils.handleValidationError(res, error.message);
      return;
    }

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
    const { id, email, subscription } = req.user;
    const userData = { id, email, subscription };

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

    const updatedUser = await usersService.updateUser(userId, subscription);

    res.status(200).json({
      status: "succes",
      code: 200,
      message: "User's subscription updated",
      data: {
        email: updatedUser.email,
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

const usersController = {
  signup,
  login,
  logout,
  getCurrentUserData,
  updateUserSubscription,
};

export default usersController;
