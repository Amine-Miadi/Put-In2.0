const Form = (props) => {
    return(
        <form onSubmit={props.handleSubmit}>
            Room Code:
            <input 
            onChange={props.inputChange} 
            value={props.roomCode}
            placeholder = 'input the room code '
            />
            <input type="submit" value="Join"/>
        </form>
    )
}

export default Form