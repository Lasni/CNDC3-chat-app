// Import things
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

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
const welcomeMessage = 'Welcome!'
io.on('connection', (socket) => {
	console.log('New websocket connection');
	// Default emit to a new client
	socket.emit('welcomeMessage', welcomeMessage)

	// Listen for 'sendMessage' and emit to all
	socket.on('sendMessage', (message) => {
		io.emit('message', message)
	})
});

// Run the server
server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
