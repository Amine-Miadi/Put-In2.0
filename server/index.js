const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server, {
    cors: {origin: "*"}
});

app.get('/',(req,res) => {
  res.send('<h1>hi</h1>')
})

io.on('connection', (socket) => {

  //joining the room
  socket.on('join-room', roomCode => {
    console.log(socket.id, "joined room", roomCode)
    socket.join(roomCode)
  })


  //sending info to room
  console.log("connected from: ",socket.id)
  socket.on('play-hand', (room, gameState) => {
    console.log("echo sent from: ", socket.id)
    socket.to(room).emit('update', gameState)
  })

  
})



server.listen(3001, () =>{
  console.log("server running on port 3001")
})

