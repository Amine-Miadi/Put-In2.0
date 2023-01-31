import '../styles/styles.css'
import {BsFillDoorOpenFill} from 'react-icons/bs'
const Form = (props) => {
    return(
        <div>
            <form className='form' onSubmit={props.handleSubmit}>
                Room Code:
                <br /><br /><br />
                <input 
                onChange={props.inputChange} 
                value={props.roomCode}
                placeholder = 'input the room code '
                />
                <br />
                <button className="button" type="submit"> Join <BsFillDoorOpenFill/> </button>
            </form>
        </div>
    )
}

export default Form