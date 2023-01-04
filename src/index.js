const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server); // it expects a raw http server, that's why it was necessary to refactor code

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', () => {
  console.log('New WebSocket connection');
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});