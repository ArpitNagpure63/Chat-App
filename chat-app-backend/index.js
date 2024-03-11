import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/messsage.routes.js";
import userRouter from "./routes/user.routes.js";
import conversationRouter from "./routes/conversation.router.js";
import { connectToDatabase } from "./utility/dbConnection.js";
import { app, server } from "./utility/socket.js";

const port = process.env.PORT || 4000;

// Applcation middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth/', authRouter);
app.use('/api/message/', messageRouter);
app.use('/api/users/', userRouter);
app.use('/api/conversation/', conversationRouter);

// Start Backend Server
server.listen(port, () => {
    console.log(`Server start on PORT ${port}`);
    connectToDatabase();
});
