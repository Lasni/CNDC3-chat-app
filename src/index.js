// Import things
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

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
  socket.on('join', ({ username, room }) => {
    socket.join(room);
    // Default emit
    socket.emit('message', generateMessage('Welcome!')); // sends to a SINGLE new client
    socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the room.`)); // sends to EVERY connected client EXCEPT the sender
  });

  // Listen for 'sendMessage' and emit to all
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity not allowed here.'); // optional error message in callback() for client
    }
    io.to('redrum').emit('message', generateMessage(message)); // sends to EVERY connected client
    callback(); // acknowledgment function
  });

  // Listen for 'sendLocation' and emit to all
  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', generateLocationMessage(coords));
    callback(); // call the client's callback function, letting them know you caught the signal
  });

  // Listen for a disconnect
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
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
