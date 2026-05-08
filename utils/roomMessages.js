const roomMessages = {};

// Ajouter message
function addRoomMessage(room, message) {

  if (!roomMessages[room]) {
    roomMessages[room] = [];
  }

  roomMessages[room].push(message);

  // Limite à 100 messages
  if (roomMessages[room].length > 100) {
    roomMessages[room].shift();
  }

}

// Récupérer historique
function getRoomMessages(room) {

  return roomMessages[room] || [];

}

module.exports = {
  addRoomMessage,
  getRoomMessages
};