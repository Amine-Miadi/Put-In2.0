import {useState} from 'react';
import '../styles/styles.css'

const Card = (props) =>{
    
    const properties = props.properties

    const [Class, setclass] = useState(() => props.type === "field" ? "card faceup" : "card facedown");
    const [cardInfo, setInfo] = useState(() => props.type === "field" ? `${properties.suit}` : "" );

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