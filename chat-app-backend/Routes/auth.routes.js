import express from "express";
import signupController from "../Controllers/signup.controller.js";
import loginController from "../Controllers/login.controller.js";
import logoutController from "../Controllers/logout.controller.js";

const authRouter = express.Router();

authRouter.post('/signup', signupController);
authRouter.post('/login', loginController);
authRouter.get('/logout', logoutController);

export default authRouter;