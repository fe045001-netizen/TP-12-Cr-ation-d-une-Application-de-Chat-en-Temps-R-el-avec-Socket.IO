const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const formatMessage = require('./utils/messages');

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const {
  addRoomMessage,
  getRoomMessages
} = require('./utils/roomMessages');

const app = express();
const server = http.createServer(app);

// ✅ CORRECTION IMPORTANTE SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Système';

io.on('connection', (socket) => {

  console.log('Client connecté:', socket.id);

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // bienvenue
    socket.emit(
      'message',
      formatMessage(botName, `Bienvenue dans ${user.room}`)
    );

    // historique
    socket.emit('messageHistory', getRoomMessages(user.room));

    // notification
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(botName, `${user.username} a rejoint`)
    );

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', (msg) => {

    const user = getCurrentUser(socket.id);
    if (!user) return;

    const message = formatMessage(user.username, msg);

    addRoomMessage(user.room, message);

    io.to(user.room).emit('message', message);
  });

  socket.on('disconnect', () => {

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} a quitté`)
      );
    }
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});