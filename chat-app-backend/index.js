import express from "express";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import authRouter from "./Routes/auth.routes.js";
import messageRouter from "./Routes/messsage.routes.js";
import userRouter from "./Routes/user.routes.js";

const port = process.env.PORT || 4000;
const app = express();

// Applcation middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth/', authRouter);
app.use('/api/message/', messageRouter);
app.use('/api/users/', userRouter);

// Start Backend Server
app.listen(port, () => {
    console.log(`Server start on PORT ${port}`)
});

// Connect MongoDB
mongoose.connect(`${process.env.DB_CONNECTION_STRING}ChatAppDB`)
    .then(() => {
        console.log('Database connection sucessfull');
    })
    .catch(() => {
        console.log('Database connection unsucessfull');
    });