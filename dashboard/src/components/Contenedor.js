import React from 'react';


function Contenedor(props) {
  return (
    <div className= {props.classProp}>
      <h3>{props.titulo}</h3>
      <p>{props.enlace}</p>
    </div>

  );
}

export default Contenedor;