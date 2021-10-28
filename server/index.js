const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});
app.get("/", (req, res) => {
    res.send("Game on!!!");
  });
server.listen(3000, () => {
    console.log('listen 3000 port');
})
io.on('connection', (socket) => {
    io.emit('hello');
    socket.on('sendDataServer', data => {
        console.log(data.playerIndex);
        io.emit('sendDataClient', data);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

