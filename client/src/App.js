import React, { useState } from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import socket from './socket'




function App() {


  const [roomCode, setroomCode] = useState('')
  const [currentPage, setPage] = useState('roomJoin')
  const [gameState, setGamestate] = useState(
    {
      Player1: ["1","2","3","4"],
      Player2: ["6","7","8","9"],
      Deck: ["A","K","Q","J"],
      Field: 10
    }
  )

  


  socket.on('update', newState => {
    console.log("received at: ", socket.id)
    setGamestate(newState)
  })



//event handlers


//to refactor later: set new state to object variable and pass it instead of elaborate object
  function handleclick(){
    setGamestate({
      Player1: ["1","2","3","4"],
      Player2: ["6","7","8","9"],
      Deck: ["A","K","Q","J"],
      Field: gameState.Field+1
    })
    socket.emit('play-hand',  roomCode, {
      Player1: ["1","2","3","4"],
      Player2: ["6","7","8","9"],
      Deck: ["A","K","Q","J"],
      Field: gameState.Field+1
    })
  }

  function inputChange(event){
    event.preventDefault();
    setroomCode(event.target.value)
  }

  function handleSubmit(event){
    event.preventDefault();
    socket.emit('join-room',roomCode)
    setPage('gamePage')
  }
  if(currentPage === 'roomJoin'){
    return (
      <div>
        <Form 
          roomCode={roomCode}
          handleSubmit={handleSubmit}
          inputChange={inputChange}
        />
      </div>
    );
  }
  else if(currentPage === 'gamePage'){
    return (
      <div>
        Welcome to the game <br /><br /><br />
        {gameState.Player1}<br /><br />
        {gameState.Field}<br /><br />
        {gameState.Player2}<br /><br />
        <br /><br /><br />
        <Button handleclick={handleclick}/> <br />
      </div>
    );
  }
  
}

export default App;
