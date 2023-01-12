import React, {useState} from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import Card from './components/Card';
import Warning from './components/fullroomWarning'
import socket from './socket'
import './styles/styles.css'




function App() {
  const [cardKey, setKey] = useState(0)
  const [warn, setWarning] = useState(false)
  const [Players, setPlayer] = useState(['Player1', 'Player2'])
  const [roomCode, setroomCode] = useState('')
  const [currentPage, setPage] = useState('roomJoin')
  const [gameState, setGamestate] = useState({
    Player1:["?","?","?","?"],
    Player2:["?","?","?","?"],
    Field: ["?"],
    Deck:["?","?","?","?"]
  })
  const [hand, setHand] = useState([])


socket.off('init').on('init', details => {
  if(details === -1){
    setroomCode('')
    setWarning(true)
    setTimeout(() => {
      setWarning(false)
    }, 5000);
  }
  else{
    setPlayer(details.players)
    hez(details.gameState)
    setPage('gamePage')
  }
})

socket.off('update').on('update', newState => {
  hez(newState)
  setKey(cardKey+1)
})
  

  


//event handlers

  /* play hand button handler */
  function handleclick(){
    setGamestate(gameState)
    playHand()
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
  }

  /*add card to hand if player clicks on it*/
  function addTohand(card){
    setHand(current => [...current, card])
  }




//gameplay-functions
function hez(newState){
    newState[Players[0]].push(newState.Deck.pop())
    setGamestate(newState)
}

function playHand(){
  setKey(cardKey +1+gameState[Players[0]].length)
  const newState = gameState
  newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
  hand.map(card => newState.Field.push(card))
  setGamestate(newState)
  setHand([])
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
        <Warning on={warn} />
      </div>
    );
  }
  else if(currentPage === 'gamePage'){
    return (
      <div className='main'>
        <div className='cards'>{gameState[Players[1]].map(() =>         <button 
                                                                              className='card facedown'>
                                                                        </button>)}

        </div><br /><br />

        <Card properties = {gameState.Field[gameState.Field.length - 1]} type = {"field"} key={cardKey}/><br /><br />

        <div className='cards'>{gameState[Players[0]].map((card, i) => {
                                                                        console.log(cardKey+i)
                                                                return <Card
                                                                            type = {"player"}
                                                                            action = {addTohand}
                                                                            properties={card}
                                                                            Id={cardKey+i}
                                                                            key={cardKey+i}
                                                                        />
                                                                        })}
        </div><br /><br />
        <br /><br /><br />
        <Button handleclick={handleclick} label={'play hand'}/> <br />
      </div>
    );
  }
  
}

export default App;
