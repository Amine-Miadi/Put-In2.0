import '../styles/styles.css'
import {BsFillDoorOpenFill} from 'react-icons/bs'
const Form = (props) => {
    return(
        <div>
            <form className='form' onSubmit={props.handleSubmit}>
                <div className='text'>Room Code:</div>
                <input 
                style={{borderRadius: '5px'}}
                onChange={props.inputChange} 
                value={props.roomCode}
                placeholder = 'input the room code '
                />
                <br /><br />
                <button className="button" type="submit"> Join <BsFillDoorOpenFill/> </button>
            </form>
        </div>
    )
}

export default Form