const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./models/messages');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chat Bot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    socket.emit('message', formatMessage(botName, 'Welcome to chat app'));
    socket.broadcast.emit('message', formatMessage(botName, 'A new user has joined the chat'));
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
    socket.on('chatMessage', msg => {
        console.log(msg);
        io.emit('message', msg); 
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server Runnng at port ${PORT}`));