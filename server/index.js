const express = require('express');
const setup = require('./game_setup')
const helpers = require('./room_management')
const { Server } = require("socket.io");
const io = new Server(3001, {cors: {origin: "*"}});

io.use(express.static('build'))

io.on("connection", (socket) => {
  console.log("connected from: ",socket.id)
  //joining the room
  socket.on('join-room', roomCode => {
    console.log(socket.id, "joined room", roomCode)
    helpers.roomJoin(socket,roomCode)
  })

  //sending info to room all while checking if game is won
  socket.on('play-hand', (room, gameState) => {
    const result = helpers.isWin(gameState)
    if(result !==null){
      console.log(result, " won the game")
      io.to(room).emit('win', result,setup.getGameState())
    }
    else{
      gameState = helpers.checkEmptyDeck(gameState)
      console.log(gameState)
      console.log("echo sent from: ", socket.id)
      socket.to(room).emit('update', gameState)
    }
    
  })
  

  //disconnect
  socket.on("disconnect", (reason) => {
    helpers.exitRoom(socket.id)
  });

});


