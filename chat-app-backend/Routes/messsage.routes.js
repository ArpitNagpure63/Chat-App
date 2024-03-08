import express from "express";
import newMessageController from "../controllers/newMessage.controller.js";
import getMessageController from "../controllers/getMessage.controller.js";
import verifyAuth from "../middlewares/auth.middleware.js";

const messageRouter = express.Router();

messageRouter.post('/send/:recieverID', verifyAuth, newMessageController);
messageRouter.get('/:recieverID', verifyAuth, getMessageController);

export default messageRouter;