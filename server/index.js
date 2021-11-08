const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const uuid = require('uuid');
const io = new Server(server, {
    cors: {
        origin: "*",
       // methods: ["GET", "POST"]
    }
});
var rooms = [];
app.get("/", (req, res) => {
    res.send("Game on!!!");
});

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Our app is running on port ${PORT}`);
// });
server.listen(3000, () => {
    console.log(`Our app is running on port 3000`);
});

const joinRoom = (socket, userName, room) => {
    if(room.sockets.length < 2) {
        if(room.nameCreated !== userName)
        room.nameJoin = userName;
        room.sockets.push(room && socket);
        console.log(`register ${room.id} with ${socket.id}`);
        socket.join(room.id, () => {
            socket.roomId = room.id;
        });
    }
    io.in(room.id).emit('joinRoomClient', room.id, userName);
}
io.on('connection', (socket) => {
    socket.on('sendDataServer', data => {
        let room = rooms.find(x => x.name === data.roomCode);
        data.nameWillPlay = room.nameJoin === data.userName? room.nameCreated: room.nameJoin;
        io.in(room.id).emit('sendDataClient', data);
    })
    console.log('a user connected ' + socket.id);
    socket.on('createRoom', ({
            roomCode,
            userName
        }) => {
            let roomNamed = rooms.find(x => x.name === roomCode);
            if (roomNamed) {
                socket.emit('Created', '');
            } else {
                const room = {
                    id: uuid.v4(),
                    nameCreated: userName,
                    nameJoin:'',
                    name: roomCode,
                    sockets: [],
                };
                rooms.push(room);
                console.log('Room created');
                socket.emit('Created', room.id);
                joinRoom(socket, userName, room);
            }
        }),
        socket.on('joinRoom', ({
            roomCode,
            userName
        }) => {
            let room = {};
            for (let room1 in rooms) {
                if (rooms[room1].name === roomCode) {
                    room = rooms[room1];
                }
            }
            if(room.id) {
                joinRoom(socket, userName, room);
            if (room.sockets.length == 2) {
                for (const client of room.sockets) {
                    console.log(room.name);
                    client.emit('initGame', room.name);
                }
            }
         
            }
        }),

    socket.on('disconnect', () => {
        console.log('user disconnected' + socket.id);
    })
});