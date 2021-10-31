const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const uuid = require('uuid');
const _ = require('lodash');
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});
var rooms = [];
app.get("/", (req, res) => {
    res.send("Game on!!!");
  });
server.listen(3000, () => {
    console.log('listen 3000 port');
})
const joinRoom = (socket,userName, room) =>{
    room.sockets.push(room && socket);
    console.log(`register ${room.id} with ${socket.id}` );
    socket.join('huong',()=> {
        socket.roomId = room.id;
    });
    // tdn chỗ này v ẫn đc mà dưới lại đ đc nhỉ
    io.in('huong').emit('connectToRoom',room.id,userName);
}
io.on('connection', (socket) => {
    socket.on('sendDataServer', data => {
    let room= rooms.find(x=>x.name === data.roomCode);
       console.log(rooms);
       console.log(data && room && room.id);
       const arr = Array.from(io.sockets.adapter.rooms);
       console.log(arr);
       // 2 thằng vẫn  trong phòng, id đúng mà lại đ nhận đc là thế nào nhỉ
       io.in('huong').emit('sendDataClient', data);
       //io.emit('sendDataClient', data);
    })
    console.log('a user connected '+socket.id);
    socket.on('createRoom', ({roomCode,userName}) => {
        const room = {
            id: uuid.v4(),
            name: roomCode,
            sockets: [],
        };
        rooms.push(room);
       // rooms[roomCode] = roomCode && userName && room;
        //rooms.push(roomCode && userName && room);
        console.log('Room created');
        socket.emit('successCreated',userName);
        joinRoom(socket,userName, room);

    }),
    socket.on('joinRoom', ({roomCode,userName}) => {
        let room =  {};
        console.log(room);
        for(let room1 in rooms) {
            if(rooms[room1].name === roomCode) {
                room = rooms[room1];
            }
        }
        joinRoom(socket,userName,room);
        if (room.sockets.length == 2) {
            for (const client of room.sockets) {
                console.log(room.name);
                client.emit('initGame',room.name);
            }
          }
      });
      
    socket.on('disconnect', () => {
        console.log('user disconnected'+socket.id);
    })
});
