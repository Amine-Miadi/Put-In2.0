function verify(hand,gameState,player){
    //coding: 
    // -1 error, 
    // 1 multiple/one valid cards, 
    // 2 one valid additional card, 
    // 7 for see card, 
    // 11 switch cards, 
    // 10 see opponent card

    if(hand.length === 1){
        if(hand[0].value === gameState.Field[gameState.Field.length -1].value){
            return 2
        }
        else if(hand[0].value === "7"){
            return 7
        }
        else {
            return 1
        }
    }
    if(hand.length>1){
        for(let i=0;i<hand.length;i++){
            if(hand[i].value !== hand[0].value){return -1}
        }
        return 1
    }
}

module.exports = {
    verify
  }