# Chat en Temps Réel avec Socket.IO


## Fonctionnalités

* Connexion d’utilisateurs avec pseudo
* Création et choix de salons (rooms)
* Chat en temps réel
* Messages privés avec @username
* Liste des utilisateurs connectés par salon
* Indicateur de saisie (typing indicator)
* Historique des messages par salon
* Gestion des déconnexions

---

## Technologies utilisées

* Node.js
* Express.js
* Socket.IO
* HTML / CSS / JavaScript (Frontend)
* Moment.js

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd chat-socketio
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur

```bash
node server.js
```

Le serveur sera accessible sur :

```
http://localhost:3000
```

---

## Structure du projet

```
chat-socketio/
│
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── utils/
│   ├── messages.js
│   ├── users.js
│   └── roomMessages.js
│
├── server.js
├── package.json
└── README.md
```

---

## Utilisation

1. Ouvrir le navigateur sur `http://localhost:3000`
2. Entrer un nom d’utilisateur
3. Choisir ou créer un salon
4. Commencer à discuter


## Resultats
<img width="1358" height="640" alt="Capture d’écran 2026-05-08 151844" src="https://github.com/user-attachments/assets/db3d1748-cc21-410d-968c-615fe08391d4" />

<img width="1366" height="591" alt="Capture d’écran 2026-05-08 151953" src="https://github.com/user-attachments/assets/18f61369-a4b7-4e68-aa26-3602a6f648cb" />


## Améliorations possibles

* Ajout d’une base de données (MongoDB)
* Authentification utilisateur
* Interface plus moderne (React)
* Messages persistants
* Notifications push

---

## Auteur

Projet réalisé dans le cadre d’un apprentissage full-stack avec Node.js et Socket.IO.
