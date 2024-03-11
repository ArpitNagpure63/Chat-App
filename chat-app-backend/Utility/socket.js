import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

// Create express app
const app = express();

// Create Node Server
const server = createServer(app);

// Create Socket Server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const onlineUsers = {};

// Listen to Web Socket using io.on method
io.on('connection', (socket) => {
    // Add user to online users list
    console.log('connected: ', socket.id);
    const { userID } = socket.handshake.query;
    console.log('userID: ', userID);

    if (userID) onlineUsers[userID] = socket.id;

    // emit event to tell all loggedin users about active users 
    io.emit('getOnlineUsers', onlineUsers);

    socket.on('disconnect', () => {
        // Remove user to online users list
        console.log('User Disconnected', socket.id);
        delete onlineUsers[userID];
        io.emit('getOnlineUsers', onlineUsers);
    });
});

const getActiveUsers = (recieverID) => {
    return onlineUsers[recieverID];
}

// io.on('newMessage', (socket) => {
//     // Check user online status
//     if (onlineUsers[socket.id]) {
//         console.log('User Online');
//     }
// })

export { io, app, server, getActiveUsers };