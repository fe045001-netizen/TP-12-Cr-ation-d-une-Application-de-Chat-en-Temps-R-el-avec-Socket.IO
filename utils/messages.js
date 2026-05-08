const moment = require('moment');

// Format du message
function formatMessage(username, text, isPrivate = false) {
  return {
    username,
    text,
    time: moment().format('HH:mm'),
    isPrivate
  };
}

module.exports = formatMessage;
const messages = {};

function formatMessage(username, text, room, isPrivate = false) {
  const message = {
    username,
    text,
    room,
    time: moment().format('HH:mm'),
    isPrivate
  };
  
  // Stocker le message
  if (!messages[room]) {
    messages[room] = [];
  }
  
  // Limiter à 50 messages par salon
  if (messages[room].length >= 50) {
    messages[room].shift();
  }
  
  messages[room].push(message);
  
  return message;
}

function getRoomMessages(room) {
  return messages[room] || [];
}

module.exports = {
  formatMessage,
  getRoomMessages
};