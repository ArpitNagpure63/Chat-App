import express from "express";
import newMessageController from "../Controllers/newMessage.controller.js";
import getMessageController from "../Controllers/getMessage.controller.js";
import VerifyAuth from "../Middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.post('/send/:recieverID', VerifyAuth, newMessageController);
messageRouter.get('/:recieverID', VerifyAuth, getMessageController);

export default messageRouter;