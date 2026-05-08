const moment = require('moment');

function formatMessage(username, text, room = null, isPrivate = false) {
  return {
    username,
    text,
    room,
    time: moment().format('HH:mm'),
    isPrivate
  };
}

module.exports = formatMessage;