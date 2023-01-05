const gameState = require('./game_setup')
const { Server } = require("socket.io");
const { Player1 } = require('./game_setup');
const io = new Server(3001, {cors: {origin: "*"}});

const rooms = []

io.on("connection", (socket) => {

  //joining the room
  socket.on('join-room', roomCode => {
    console.log(socket.id, "joined room", roomCode)
    const found = rooms.filter(room => room.code === roomCode)
    var players = []
    if(found.length===0){
      const room = {
        code: roomCode,
        players: [socket.id]
      }
      rooms.push(room)
      players=['Player1','Player2']
    }else{
      if(found[0].players.length === 1){
        found[0].players.push(socket.id)
        players=['Player2','Player1']
      } 
    }
    socket.join(roomCode)
    console.log(players)
    details = {
      gameState: gameState,
      players: players
    }
    socket.emit('init',details)
  })


  //sending info to room
  console.log("connected from: ",socket.id)
  socket.on('play-hand', (room, gameState) => {
    console.log("echo sent from: ", socket.id)
    socket.to(room).emit('update', gameState)
  })

});


