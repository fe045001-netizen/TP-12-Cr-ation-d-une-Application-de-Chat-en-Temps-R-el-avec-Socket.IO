const messages = {};

function addRoomMessage(room, message) {
  if (!messages[room]) {
    messages[room] = [];
  }

  if (messages[room].length >= 50) {
    messages[room].shift();
  }

  messages[room].push(message);
}

function getRoomMessages(room) {
  return messages[room] || [];
}

module.exports = {
  addRoomMessage,
  getRoomMessages
};