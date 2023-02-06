import React, {useState, useRef} from 'react';
import Button from './components/Button';
import Form from './components/roomFrom';
import Card from './components/Card';
import OpCard from './components/opCard';
import FCard from './components/fCard';
import Warning from './components/fullroomWarning'
import socket from './socket'
import Dropback from './components/popups/Dropback';
import {FiSettings,FiHelpCircle} from 'react-icons/fi'
import {BsInfoCircle} from 'react-icons/bs'
import './styles/styles.css'

const rules = require('./rules')



function App() {
  //-->play is to control clickability of cards, when it's not the players turn, cards should not respond to clicks
  //-->cardKey used to set the key of cards so they are recreated on render. was added to mitigate the problem of 
        //card components holding their class properties on parent render
  //to stop player from flipping more cards when a 7 is played
  const [buffer, setBuffer] = useState(false)
  const [dropbackChild,setChild] = useState(null)
  const newState = useRef();
  const Kswap = useRef();
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
      setBuffer(true)
      socket.off('begin').on('begin', () => {
        setPlay(true)
        setBuffer(false)
      })
    }
    else if(details.players[0] === "Player2"){
      socket.emit('startGame',roomCode)
    }
  }
})

socket.off('update').on('update', newState => {
  playCode.current = 0
  action.current = addTohand
  hez(newState)
  setKey(cardKey +1+gameState[Players[0]].length)
  setPlay(true)
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
    if(play === true){
      setGamestate(gameState)
      playHand()
      if(keepTurn.current === false){
        setPlay(false)
        socket.emit('play-hand', roomCode, gameState)
        setKey(cardKey+8+gameState[Players[0]].length)
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
      playCode.current = 11.5
      swapArray.current.push(card)
      setHand([])
    }
    else if(playCode.current === 11.5){
      newState.current = gameState 
      swapArray.current.push(card)
      newState.current[Players[0]] = newState.current[Players[0]].filter(card => !swapArray.current.includes(card));
      newState.current[Players[1]] = newState.current[Players[1]].filter(card => !swapArray.current.includes(card));
      newState.current[Players[0]].push(swapArray.current[1])
      newState.current[Players[1]].push(swapArray.current[0])
      setGamestate(newState.current)
      newState.current = null
      swapArray.current = []
      action.current = addTohand
      setHand([])
    }
  }

  function swapKing(){
    Kswap.current = true
  }


//gameplay-functions
function hez(newState){
    playCode.current = 0
    newState[Players[0]].push(newState.Deck.pop())
    setGamestate(newState)
}



function playHand(){
  setKey(cardKey +1+gameState[Players[0]].length)
  let verdict = rules.verify(hand,gameState,Kswap.current)
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
    if(verdict === 15){
      playCode.current = 15
      keepTurn.current = true
      const newState = gameState
      newState[Players[0]] = newState[Players[0]].filter(card => !hand.includes(card));
      newState[Players[0]].push(newState.Field.pop())
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
    setKey(cardKey +1+gameState[Players[0]].length)
    }
    setKey(cardKey +1+gameState[Players[0]].length)
}





//render based on gamePage state, whether welcome page or game page
if(currentPage === 'roomJoin'){
  return (
    
    <div className='welcome'>
      <div className='float-child'>
        <div className='content'>
          <img alt = "" src={ require('./img/putin-image.png')} className="image" />
        </div>
      </div>
      <div className='float-child'>
        <div className='content'>
        <Form 
            roomCode={roomCode}
            handleSubmit={handleSubmit}
            inputChange={inputChange}
          />
          <br />
          <br />
          <br />
          <div className='optionsContainer'>
            <button className='options' onClick={() => {setChild("settings")}}><FiSettings size='40px'/></button>
            <button className='options' onClick={() => {setChild("help")}}><FiHelpCircle size='40px'/></button>
            <button className='options' onClick={() => {setChild("info")}}><BsInfoCircle size='40px'/></button>
          </div>
            <Warning on={warn} />
            {dropbackChild !== null? <Dropback child = {dropbackChild}  close={setChild}/> : ""}
        </div>
        </div>
    </div>
  );
}
  else if(currentPage === 'gamePage'){
    return (
      <div className='main'>
      <br /><br />
      <div className='cards'>{gameState[Players[1]].map((card,i) =><OpCard
                                                                        properties={card}
                                                                        action = {action.current}
                                                                        playType={playCode.current}
                                                                    />)}

        </div><br /><br />

        <FCard properties = {gameState.Field[gameState.Field.length - 1]} action = {swapKing}/><br /><br />
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
        </div><br />
        <Button handleclick={handleclick} label={'play hand'}/> <br />
        {buffer === true? <Dropback child = {"awaiting player 2"} buffer = {true}/> : ""}
        {console.log(buffer)}
      </div>
    );
  }
  
}

export default App;
