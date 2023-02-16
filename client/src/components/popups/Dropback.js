import React from 'react'

const Dropback = (props) => {
    console.log(props.child)
  return (
    <div className = 'dropback'>
        <h1 className='inside-item'>{props.child}</h1><br />
        {console.log(props.buffer)}
        {props.buffer !== true? <button className='closeButton' onClick={() => {props.close(null)}}>X</button> : ""}
    </div>
  )
}

export default Dropback