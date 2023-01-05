import React, { useState } from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import Card from './components/Card';
import socket from './socket'




function App() {

  const [Players, setPlayer] = useState(['Player2', 'Player1'])
  const [roomCode, setroomCode] = useState('')
  const [currentPage, setPage] = useState('roomJoin')
  const [gameState, setGamestate] = useState({
    Player1:["?","?","?","?"],
    Player2:["?","?","?","?"],
    Field: "?",
    Deck:["?","?","?","?"]
  })
  const [hand, setHand] = useState('')


  
  socket.on('init', async details => {
    console.log(details)
    setPlayer(details.players)
    setGamestate(details.gameState)
    console.log(details.gameState)
  })

  socket.on('update', async newState => {
    await setGamestate(newState)
    console.log(newState)
  })



//event handlers

  /* play hand button handler */
  function handleclick(){
    setGamestate(gameState)
    socket.emit('play-hand',  roomCode, gameState)
  }

  /* event handler for roomcode field */
  function inputChange(event){
    event.preventDefault();
    setroomCode(event.target.value)
  }

  /* event handler for successful room join */
  function handleSubmit(event){
    event.preventDefault();
    socket.emit('join-room',roomCode)
    setPage('gamePage')
  }

  /*add card to hand if player clicks on it*/
  function addTohand(card){
    setHand(current => [...current, card])
    console.log(hand)
  }



  //render based on gamePage state, whether welcome page or game page
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
        {console.log(gameState,"this is gamestate")}
        Welcome to the game <br /><br /><br />
        {gameState[Players[1]].map(card => <Card properties = {card} action={addTohand} />)}<br /><br />
        <Card properties = {gameState.Field}/><br /><br />
        {gameState[Players[0]].map(card => <Card properties = {card}/>)}<br /><br /><br /><br />
        <br /><br /><br />
        <Button handleclick={handleclick} label={'play hand'}/> <br />
      </div>
    );
  }
  
}

export default App;
