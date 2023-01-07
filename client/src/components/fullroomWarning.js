
const Warning = ({on}) => {
    if(on === true){
        return(
            <div>
                <h2>the room you are trying to access is full, please try a different code</h2>
            </div>
        )
    }
    else{
        return(
            <div>
            </div>
        )
    }
}

export default Warning