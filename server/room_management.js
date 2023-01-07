const getGameState = require('./game_setup')
const rooms = []

function roomJoin(socket,roomCode){
    const found = rooms.filter(room => room.code === roomCode)
    if(found.length===0){
      const room = {
        gameState:getGameState(),
        code: roomCode,
        players: [socket.id]
      }
      rooms.push(room)
      socket.join(roomCode)
      details = {
        gameState: room.gameState,
        players: ['Player1','Player2']
      }
      socket.emit('init',details)
    }
    else if(found[0].players.length === 1){
        let room = found[0]
        room.players.push(socket.id)
        socket.join(roomCode)
        details = {
          gameState: room.gameState,
          players: ['Player2','Player1']
        }
        socket.emit('init',details)
    }
    else if(found[0].players.length > 1){
      socket.emit('init',-1)
    }
}  

function exitRoom(id){
  const found = rooms.filter(room => room.players.includes(id))
  console.log(found)
  if(found.length>0){
    found[0].players[0] === id ? found[0].players.splice(0,1) : found[0].players.splice(1,1)
    console.log(found)
    if(found[0].players.length === 0){
      for(i=0;i<rooms.length;i++){
        if(found[0] === rooms[i]) rooms.splice(i,1)
      }
    }
  }
}

module.exports = {
  roomJoin, 
  exitRoom
}