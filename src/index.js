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

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined!') // this will send something to every client except this particular socket

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('sendLocation', (coords) => {
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });


});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});