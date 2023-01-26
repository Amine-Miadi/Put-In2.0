import {useState} from 'react';
import '../styles/styles.css'

const OpCard = (props) =>{
    
    const properties = props.properties
    const [Class, setclass] = useState("card Opponent facedown");
    const [cardInfo, setInfo] = useState(``);

    function cardClick(){
        if(props.playType === 10){
            setclass("card Player faceup")
            setInfo(`${properties.suit}`)
            setTimeout(() => {
                setclass("card facedown Player")
                setInfo(``)
            }, 3000)
            props.action()
        }
        if(props.playType === 11.5){
            props.action(properties)
        }
    }

    function getColor(){
        if(properties.suit === "♠" || properties.suit === "♣"){return "black"}
        return "red"
    }


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

export default OpCard