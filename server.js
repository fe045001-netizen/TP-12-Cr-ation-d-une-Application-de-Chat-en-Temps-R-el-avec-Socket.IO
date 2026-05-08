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

// ======================
// Configuration Express
// ======================

const app = express();
const server = http.createServer(app);

const io = new Server(server);

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Système';

// ======================
// Socket.IO
// ======================

io.on('connection', (socket) => {

  console.log(`Client connecté : ${socket.id}`);

  // ======================
  // Rejoindre un salon
  // ======================

  socket.on('joinRoom', ({ username, room }) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Message bienvenue
    socket.emit(
      'message',
      formatMessage(
        botName,
        `Bienvenue dans le salon ${user.room} !`
      )
    );

    // Historique des messages
    const roomMessages = getRoomMessages(user.room);

    if (roomMessages.length > 0) {
      socket.emit('messageHistory', roomMessages);
    }

    // Informer les autres
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(
          botName,
          `${user.username} a rejoint le salon`
        )
      );

    // Liste utilisateurs
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });

  // ======================
  // Messages
  // ======================

  socket.on('chatMessage', (msg) => {

    const user = getCurrentUser(socket.id);

    if (!user) return;

    // ======================
    // Message privé
    // ======================

    if (msg.startsWith('@')) {

      const parts = msg.substring(1).split(' ');

      const targetUsername = parts[0];

      const privateMessage =
        parts.slice(1).join(' ');

      const targetUser =
        getRoomUsers(user.room).find(
          u =>
            u.username.toLowerCase() ===
            targetUsername.toLowerCase()
        );

      if (targetUser) {

        io.to(targetUser.id).emit(
          'message',
          formatMessage(
            user.username,
            `[Privé] ${privateMessage}`,
            true
          )
        );

        socket.emit(
          'message',
          formatMessage(
            user.username,
            `[Privé à ${targetUser.username}] ${privateMessage}`,
            true
          )
        );

      } else {

        socket.emit(
          'message',
          formatMessage(
            botName,
            `Utilisateur ${targetUsername} introuvable`
          )
        );

      }

    } else {

      // Message normal
      const message =
        formatMessage(user.username, msg);

      // Sauvegarder historique
      addRoomMessage(user.room, message);

      // Envoyer au salon
      io.to(user.room).emit(
        'message',
        message
      );

    }

  });

  // ======================
  // Typing
  // ======================

  socket.on('typing', () => {

    const user =
      getCurrentUser(socket.id);

    if (user) {

      socket.broadcast
        .to(user.room)
        .emit(
          'userTyping',
          user.username
        );

    }

  });

  socket.on('stopTyping', () => {

    const user =
      getCurrentUser(socket.id);

    if (user) {

      socket.broadcast
        .to(user.room)
        .emit('userStopTyping');

    }

  });

  // ======================
  // Quitter salon
  // ======================

  socket.on('leaveRoom', () => {

    const user =
      userLeave(socket.id);

    if (user) {

      io.to(user.room).emit(
        'message',
        formatMessage(
          botName,
          `${user.username} a quitté le salon`
        )
      );

      io.to(user.room).emit(
        'roomUsers',
        {
          room: user.room,
          users: getRoomUsers(user.room)
        }
      );

    }

  });

  // ======================
  // Déconnexion
  // ======================

  socket.on('disconnect', () => {

    const user =
      userLeave(socket.id);

    if (user) {

      io.to(user.room).emit(
        'message',
        formatMessage(
          botName,
          `${user.username} a quitté le salon`
        )
      );

      io.to(user.room).emit(
        'roomUsers',
        {
          room: user.room,
          users: getRoomUsers(user.room)
        }
      );

    }

  });

});

// ======================
// Lancer serveur
// ======================

const PORT =
  process.env.PORT || 3000;

server.listen(PORT, () => {

  console.log(
    `Serveur en écoute sur le port ${PORT}`
  );

});