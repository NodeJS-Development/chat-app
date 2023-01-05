const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server); // it expects a raw http server, that's why it was necessary to refactor code

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.emit('message', generateMessage('Welcome!'));
  socket.broadcast.emit('message', generateMessage('A new user has joined!')) // this will send something to every client except this particular socket

  socket.on('sendMessage', (message, cb) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return cb('Profanity is not allowed!')
    }

    io.emit('message', generateMessage(message));
    cb();

  });

  socket.on('sendLocation', (coords, cb) => {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    cb();
  });


  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });


});

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});