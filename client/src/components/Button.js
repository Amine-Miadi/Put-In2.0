const Button = (props) =>{
    return(
      <button onClick = {props.handleclick} > {props.label}</button>
    )
}

export default Button