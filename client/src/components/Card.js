import {useState} from 'react';
import addTohand from '../playFunctions/playing' 
const cardFaceupStyle = {
    borderRadius: "0.5rem",
    height: "150px",
    width: "105px",
    marginLeft: "0.25rem",
    transition: "0.3s"
};
const cardFacedownStyle = {
    borderRadius: "0.5rem",
    height: "150px",
    width: "105px",
    marginLeft: "0.25rem",
    backgroundColor: "Blue",
    transition: "0.3s"
};

const Card = (props) =>{
    const [isFlipped, setFlipped] = useState("down");
    const properties = props.properties

    function cardClick(){
        setFlipped("up")
        addTohand(properties)
    }

    return(
        <button 
                style={isFlipped === "down" ? cardFaceupStyle : cardFacedownStyle} 
                onClick = {cardClick} 
        > 
            {`${properties.suit},${properties.value}`}
        </button>
    )
}

export default Card