import React from 'react'

const Dropback = (props) => {
    console.log(props.child)
  return (
    <div class = 'dropback'>
        <h1 className='inside-item'>{props.child}</h1><br />
        {console.log(props.buffer)}
        {props.buffer !== true? <button onClick={() => {props.close(null)}}>close</button> : ""}
    </div>
  )
}

export default Dropback