import express from "express";
import userController from "../Controllers/user.controller.js";
import VerifyAuth from "../Middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get('/', VerifyAuth, userController);

export default userRouter;