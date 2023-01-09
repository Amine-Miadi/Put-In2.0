import {useState} from 'react';
import '../styles/styles.css'

const Card = (props) =>{
    console.log("render")
    const properties = props.properties
    const [Class, setclass] = useState( props.type === "player" || props.type === "opponent" ? "card facedown" : "card faceup");
    const [cardInfo, setInfo] = useState(props.type === "player" || props.type === "opponent" ? "" : `${properties.suit}`);

    function cardClick(){
        if(props.type === "player"){
            setclass("card faceup")
            setInfo(`${properties.suit}`)
            props.action(properties)
        }
    }

    return(
        <button 
                className={Class}
                onClick = {cardClick}
                data-value = {`${properties.suit}   ${properties.value}`}
        > 
            {cardInfo}
        </button>
    )
}

export default Card