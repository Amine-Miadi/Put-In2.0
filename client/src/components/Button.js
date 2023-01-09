import '../styles/styles.css'

const Button = (props) =>{
    return(
      <button className = "button" onClick = {props.handleclick} > {props.label}</button>
    )
}

export default Button