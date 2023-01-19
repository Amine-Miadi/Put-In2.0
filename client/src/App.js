import React, {useState, useRef} from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import Card from './components/Card';
import Warning from './components/fullroomWarning'
import socket from './socket'
import './styles/styles.css'
const rules = require('./rules')



function App() {
  //-->play is to control clickability of cards, when it's not the players turn, cards should not respond to clicks
  //-->cardKey used to set the key of cards so they are recreated on render. was added to mitigate the problem of 
        //card components holding their class properties on parent render
  const playCode = useRef(-100);
  const keepTurn = useRef(false);
  const [play,setPlay] = useState(null)
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
    if(details.players[0] === "Player1"){
      setPlay(true)
    }
  }
})

socket.off('update').on('update', newState => {
  hez(newState)
  setKey(cardKey+1)
  setPlay(true)
})

socket.off('win').on('win', (player,newgameState) =>{
  setKey(cardKey +1)
  if(Players[0] === "Player1"){
    hez(newgameState)
    setPlay(true)
  }
  setGamestate(newgameState)
  alert(`${player} won the game`)
})
  

  


//event handlers

  /* play hand button handler */
  function handleclick(){
    if(play === true){
      console.log(keepTurn.current)
      setGamestate(gameState)
      playHand()
      if(keepTurn.current === false){
        setPlay(false)
        socket.emit('play-hand', roomCode, gameState)
      }
      //reset play status (can no longer keep playing)
      playCode.current = -111
      keepTurn.current = false
    }
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
  let verdict = rules.verify(hand,gameState,Players[0])
  console.log(verdict)
  if(verdict === -1){
    setKey(cardKey +1+gameState[Players[0]].length)
    setHand([])
  }
  else if(verdict === 2 || verdict === 1){
    if(verdict === 2){
      playCode.current = 2
      keepTurn.current = true
    }
    setKey(cardKey +1+gameState[Players[0]].length)
    const newState = gameState
    newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
    hand.map(card => newState.Field.push(card))
    setGamestate(newState)
    setHand([])
  }
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

        <Card properties = {gameState.Field[gameState.Field.length - 1]} type = {"field"} key={cardKey} iD={cardKey}/><br /><br />

        <div className='cards'>{gameState[Players[0]].map((card, i) => {
                                                                return <Card
                                                                            play = {play}
                                                                            type = {"Player"}
                                                                            action = {addTohand}
                                                                            properties={card}
                                                                            key={cardKey+i+1}
                                                                            iD={cardKey+i+1}
                                                                            last={i+1===gameState[Players[0]].length ? true : false}
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
