const SUITS = ["♥","♦","♠","♣"]
const VALUES = ["A","1","1","1","1","1","1","7","7","7","7","7","7","K"]
const GAME_STATE = {
        Player1: [],
        Player2: [],
        Deck: [],
        Field: []
    }

function getGameState(){
  let freshDeck = NewDeck()
  GAME_STATE.Player1 = freshDeck.slice(0,4)
  GAME_STATE.Player2 = freshDeck.slice(4,8)
  GAME_STATE.Field = [freshDeck[8]]
  GAME_STATE.Deck = freshDeck.slice(9,56)
  return GAME_STATE
}



function NewDeck(){
    var cards = [];
    for(let i=0;i<SUITS.length;i++){
      for(var j=0;j<VALUES.length;j++){
        cards.push({suit: SUITS[i],value: VALUES[j]})
      }
    }
    return shuffle(cards);
}

function shuffle(cards){
    var shuffled = [];
    while (cards.length>0){
      let index = Math.floor(Math.random() * cards.length)
      shuffled.push(cards[index])
      cards.splice(index,1)
    }
    return shuffled
}

module.exports = {getGameState,shuffle}