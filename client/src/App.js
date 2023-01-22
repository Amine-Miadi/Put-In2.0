import React, {useState, useRef} from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import Card from './components/Card';
import OpCard from './components/opCard';
import Warning from './components/fullroomWarning'
import socket from './socket'
import './styles/styles.css'
const rules = require('./rules')



function App() {
  //-->play is to control clickability of cards, when it's not the players turn, cards should not respond to clicks
  //-->cardKey used to set the key of cards so they are recreated on render. was added to mitigate the problem of 
        //card components holding their class properties on parent render
  //to stop player from flipping more cards when a 7 is played
  const newState = useRef();
  const playCode = useRef(-100);
  const swapArray = useRef([]);
  const keepTurn = useRef(false);
  const action = useRef(addTohand);
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
  setKey(cardKey +1+gameState[Players[0]].length)
  setPlay(true)
  console.log("received at ",Players[0],play)
})

socket.off('win').on('win', (player,newgameState) =>{
  setKey(cardKey +1+gameState[Players[0]].length) 
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
    console.log("onclick info: ", play,playCode,keepTurn,gameState)
    setKey(cardKey +1+gameState[Players[0]].length)
    if(play === true){
      setGamestate(gameState)
      playHand()
      if(keepTurn.current === false){
        console.log("play provilege terminated at: ",playCode)
        setKey(cardKey +1+gameState[Players[0]].length)
        setPlay(false)
        socket.emit('play-hand', roomCode, gameState)
      }
      //reset play status (can no longer keep playing)
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

  function stopFlippage(){
    playCode.current = 0
    action.current = addTohand
    setHand([])
  }

  function swapFunction(card){
    if(playCode.current === 11){
      console.log(gameState)
      playCode.current = 11.5
      swapArray.current.push(card)
      setHand([])
    }
    else if(playCode.current === 11.5){
      newState.current = gameState 
      swapArray.current.push(card)
      console.log("current swaparray: ",swapArray.current)
      newState.current[Players[0]] = newState.current[Players[0]].filter(card => !swapArray.current.includes(card));
      newState.current[Players[1]] = newState.current[Players[1]].filter(card => !swapArray.current.includes(card));
      newState.current[Players[0]].push(swapArray.current[1])
      newState.current[Players[1]].push(swapArray.current[0])
      setGamestate(newState.current)
      newState.current = null
      swapArray.current = []
      playCode.current = 0
      action.current = addTohand
      setHand([])
    }
  }



//gameplay-functions
function hez(newState){
    newState[Players[0]].push(newState.Deck.pop())
    setGamestate(newState)
}



function playHand(){
  setKey(cardKey +1+gameState[Players[0]].length)
  let verdict = rules.verify(hand,gameState,Players[0])
    if(verdict === -1){
      setHand([])
    }
    if(verdict === 2){
      playCode.current = 2
      keepTurn.current = true
      const newState = gameState
      newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
      hand.map(card => newState.Field.push(card))
      setGamestate(newState)
      setHand([])
    }
    if(verdict === 7){
      playCode.current = 7
      action.current = stopFlippage
      const newState = gameState
      newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
      hand.map(card => newState.Field.push(card))
      setGamestate(newState)
      setHand([])
    }
    if(verdict === 10){
      action.current = stopFlippage
      playCode.current = 10
      const newState = gameState
      newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
      hand.map(card => newState.Field.push(card))
      setGamestate(newState)
      setHand([])
    }
    if(verdict === 11){
      action.current = swapFunction
      playCode.current = 11
      keepTurn.current = true
      const newState = gameState
      newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
      hand.map(card => newState.Field.push(card))
      setGamestate(newState)
      setHand([])
    }
    if(verdict === 1){
    playCode.current = 1
    const newState = gameState
    newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
    hand.map(card => newState.Field.push(card))
    setGamestate(newState)
    setHand([])
    }
    setKey(cardKey +1+gameState[Players[0]].length)
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
      {gameState.Deck.length}
      <div className='cards'>{gameState[Players[1]].map((card,i) =><OpCard
                                                                        properties={card}
                                                                        action = {action.current}
                                                                        playType={playCode.current}
                                                                    />)}

        </div><br /><br />

        <Card properties = {gameState.Field[gameState.Field.length - 1]} type = {"field"} key={cardKey} iD={cardKey}/><br /><br />

        <div className='cards'>{gameState[Players[0]].map((card, i) => {
                                                                return <Card
                                                                            play = {play}
                                                                            type = {"Player"}
                                                                            action = {action.current}
                                                                            properties={card}
                                                                            key={cardKey+i+1}
                                                                            iD={cardKey+i+1}
                                                                            playType={playCode.current}
                                                                            last={i+1===gameState[Players[0]].length ? true : false}
                                                                        />
                                                                        })}
        </div><br /><br />
        <br /><br /><br />
        <Button handleclick={handleclick} label={'play hand'}/> <br />
        {playCode.current}
      </div>
    );
  }
  
}

export default App;
