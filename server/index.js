const { Server } = require("socket.io");
const helpers = require('./room_management')
const io = new Server(3001, {cors: {origin: "*"}});


io.on("connection", (socket) => {
  //joining the room
  socket.on('join-room', roomCode => {
    console.log(socket.id, "joined room", roomCode)
    helpers.roomJoin(socket,roomCode)
  })

  //sending info to room
  console.log("connected from: ",socket.id)
  socket.on('play-hand', (room, gameState) => {
    console.log("echo sent from: ", socket.id)
    socket.to(room).emit('update', gameState)
  })

  //disconnect
  socket.on("disconnect", (reason) => {
    helpers.exitRoom(socket.id)
  });

});


