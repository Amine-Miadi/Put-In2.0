import {useState,useEffect, useRef} from 'react';
import '../styles/styles.css'

const Card = (props) =>{
    
    const properties = props.properties
    const id = useRef(props.iD);
    const seen = useRef(false);
    const [Class, setclass] = useState(() => props.type === "field" ? "card faceup" : "card Player facedown");
    const [cardInfo, setInfo] = useState(() => props.type === "field" ? `${properties.suit}` : "" );

    function cardClick(){
        if(props.type === "Player" && props.play === true){
            setclass("card faceup")
            setInfo(`${properties.suit}`)
            props.action(properties)
         }
    }

    function getColor(){
        if(properties.suit === "♠" || properties.suit === "♣"){return "black"}
        return "red"
    }
    
    useEffect(()=>{
        //flip two cards at the start of the game
        if((id.current === 1 || id.current === 2) && props.type !== "field"){
            id.current = -1
            setclass("card Player faceup")
            setInfo(`${properties.suit}`)
            setTimeout(() => {
                setclass("card facedown Player")
                setInfo(``)
            }, 5000)
        }
        //flip the picked up card
        if(props.last && props.play === true && seen.current === false){
            seen.current = true
            setclass("card Player faceup")
            setInfo(`${properties.suit}`)
            setTimeout(() => {
                setclass("card facedown Player")
                setInfo(``)
            }, 3000)
        }
     }, [properties,props])


    return(
        <button 
                style={{ color: getColor()}}
                className={Class}
                onClick = {cardClick}
                data-value = {`${properties.suit}   ${properties.value}`}
        >
            {cardInfo}
        </button>
    )
}

export default Card