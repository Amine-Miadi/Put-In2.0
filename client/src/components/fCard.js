import '../styles/styles.css'

const FCard = (props) =>{
    
    const properties = props.properties

    function cardClick(){
        if(properties.value === "K"){
            if(properties.suit === "♥" || properties.suit === "♦"){
                props.action()
            }
        }
    }

    function getColor(){
        if(properties.suit === "♠" || properties.suit === "♣"){return "black"}
        return "red"
    }


    return(
        <button 
                style={{ color: getColor()}}
                className={"card Field faceup"}
                onClick = {cardClick}
                data-value = {`${properties.suit}   ${properties.value}`}
        >
            {properties.suit}
        </button>
    )
}

export default FCard