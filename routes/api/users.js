import express from "express";
import usersController from "../../controller/usersController.js";
import validateAuth from "../../config/config-passport.js";

const router = express.Router();

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.get("/logout", validateAuth, usersController.logout);

router.get("/current", validateAuth, usersController.getCurrentUserData);

router.patch("/", validateAuth, usersController.updateUserSubscription);

export default router;
