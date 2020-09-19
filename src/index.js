// Import things
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Filter = require('bad-words');

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
  // Default emit
  socket.emit('message', 'Welcome!'); // sends to a SINGLE new client
  socket.broadcast.emit('message', 'A new user has joined'); // sends to EVERY connected client EXCEPT the sender

  // Listen for 'sendMessage' and emit to all
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity not allowed here.'); // optional error message in callback() for client
    }
    io.emit('message', message); // sends to EVERY connected client
    callback(); // acknowledgment function
  });

  // Listen for 'sendLocation' and emit to all
  socket.on('sendLocation', (coords, callback) => {
    io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    callback(); // call the client's callback function, letting them know you caught the signal
  });

  // Listen for a disconnect
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left');
  });
});

// Run the server
server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
