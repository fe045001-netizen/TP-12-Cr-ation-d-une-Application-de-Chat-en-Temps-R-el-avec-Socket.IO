const socket = io();

// Éléments du DOM
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const joinForm = document.getElementById('join-form');
const joinContainer = document.getElementById('join-container');
const chatContainer = document.querySelector('.chat-container');
const leaveBtn = document.getElementById('leave-btn');

const roomSelect = document.getElementById('room');
const customRoomContainer = document.getElementById('custom-room-container');
const customRoomInput = document.getElementById('customRoom');
const msgInput = document.getElementById('msg');

// Variables utilisateur
let username = '';
let room = '';

// ======================
// Gestion des salons
// ======================

roomSelect.addEventListener('change', () => {
  if (roomSelect.value === 'custom') {
    customRoomContainer.style.display = 'block';
    customRoomInput.focus();
  } else {
    customRoomContainer.style.display = 'none';
  }
});

// ======================
// Connexion au salon
// ======================

joinForm.addEventListener('submit', (e) => {
  e.preventDefault();

  username = e.target.elements.username.value.trim();

  if (!username) return;

  // Déterminer le salon
  if (roomSelect.value === 'custom') {
    room = customRoomInput.value.trim();

    if (!room) {
      alert('Veuillez entrer un nom de salon');
      return;
    }
  } else {
    room = roomSelect.value;
  }

  // Afficher le chat
  joinContainer.style.display = 'none';
  chatContainer.style.display = 'block';

  // Rejoindre le salon
  socket.emit('joinRoom', { username, room });
});

// ======================
// Quitter le salon
// ======================

leaveBtn.addEventListener('click', () => {
  socket.emit('leaveRoom');

  chatContainer.style.display = 'none';
  joinContainer.style.display = 'block';

  chatMessages.innerHTML = '';
});

// ======================
// Envoi de message
// ======================

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value.trim();

  if (!msg) return;

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// ======================
// Affichage des messages
// ======================

function outputMessage(message) {
  const div = document.createElement('div');

  div.classList.add('message');

  if (message.isPrivate) {
    div.classList.add('private-message');
  } else if (message.username === 'Système') {
    div.classList.add('system-message');
  }

  div.innerHTML = `
    <p class="meta">
      ${message.username} 
      <span>${message.time}</span>
    </p>

    <p class="text">${message.text}</p>
  `;

  chatMessages.appendChild(div);

  // Scroll automatique
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ======================
// Mise à jour salon/users
// ======================

function updateRoomName(room) {
  roomName.innerText = room;
}

function updateUserList(users) {
  userList.innerHTML = users
    .map(user => `<li>${user.username}</li>`)
    .join('');
}

// ======================
// Typing indicator
// ======================

msgInput.addEventListener('input', () => {
  socket.emit('typing');
});

let typingTimer;

msgInput.addEventListener('keyup', () => {
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    socket.emit('stopTyping');
  }, 1000);
});

function createTypingIndicator() {
  const div = document.createElement('div');

  div.id = 'typing-indicator';
  div.style.fontStyle = 'italic';
  div.style.color = '#666';
  div.style.padding = '5px';

  chatMessages.parentNode.insertBefore(div, chatForm.parentNode);

  return div;
}

// ======================
// Événements Socket.IO
// ======================

// Réception message
socket.on('message', (message) => {
  outputMessage(message);
});

// Historique messages
socket.on('messageHistory', (messages) => {
  chatMessages.innerHTML = '';

  messages.forEach(message => {
    outputMessage(message);
  });
});

// Mise à jour salon/utilisateurs
socket.on('roomUsers', ({ room, users }) => {
  updateRoomName(room);
  updateUserList(users);
});

// Utilisateur en train d’écrire
socket.on('userTyping', (username) => {
  const typingIndicator =
    document.getElementById('typing-indicator') ||
    createTypingIndicator();

  typingIndicator.textContent =
    `${username} est en train d'écrire...`;
});

// Arrêt de frappe
socket.on('userStopTyping', () => {
  const typingIndicator =
    document.getElementById('typing-indicator');

  if (typingIndicator) {
    typingIndicator.textContent = '';
  }
});

// Erreur connexion
socket.on('connect_error', (error) => {
  console.error('Erreur de connexion:', error);

  alert('Erreur de connexion au serveur.');
});