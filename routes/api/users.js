import express from "express";
import usersController from "../../controller/usersController.js";
import validateAuth from "../../config/config-passport.js";
import validateUploadAvatar from "../../config/config-multer.js";

const router = express.Router();

router.post("/signup", usersController.signup);

router.get("/verify/:verificationToken", usersController.verifyRegistration);

router.post("/verify", usersController.repeatVerifyRegistration);

router.post("/login", usersController.login);

router.get("/logout", validateAuth, usersController.logout);

router.get("/current", validateAuth, usersController.getCurrentUserData);

router.patch("/", validateAuth, usersController.updateUserSubscription);

router.patch(
  "/avatars",
  [validateAuth, validateUploadAvatar],
  usersController.updateUserAvatar
);

export default router;
