// Import things
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

// Create the app
const app = express();
// Create server (socket.io refactor)
const server = http.createServer(app);
// Create socket.io
const io = socketIO(server);

// Define the port
const port = process.env.PORT || 3000;

// Serve up the public directory
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

// testing socket.io (server-side)
io.on('connection', (socket) => {
  console.log('New websocket connection');

  // Listen for a user join
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    // Default emit
    socket.emit('message', generateMessage('Admin', `Welcome to ${user.room}, ${user.username}!`)); // sends to a SINGLE new client
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room.`)); // sends to EVERY connected client EXCEPT the sender
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
  });

  // Listen for 'sendMessage' and emit to all
  socket.on('sendMessage', (message, callback) => {
    console.log('sendMessage', message);
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(message)) {
      return callback('Profanity not allowed here.'); // optional error message in callback() for client
    }
    if (user) {
      io.to(user.room).emit('message', generateMessage(user.username, message)); // sends to EVERY connected client inside specific room
      callback(); // acknowledgment function
    }
  });

  // Listen for 'sendLocation' and emit to all
  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coords));
      callback(); // call the client's callback function, letting them know you caught the signal
    }
  });

  // Listen for a disconnect
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the chat.`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

// Run the server
server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});

// emit rules:
// io.emit - emits to every connected client
// socket.emit - emits to a single connected client
// socket.broadcast.emit - emits to every connected client except the sender
// io.to(room).emit - emits to every connected client inside a room
// socket.broadcast.to(room).emit - emits to every connected client inside a room except the sender
