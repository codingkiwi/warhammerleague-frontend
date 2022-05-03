import React from 'react';
import texture from '../../../Images/always-grey.png'

import './Card.css';

const Card = props => {
  return (
    <div className={`card ${props.className}`} style={props.style || {backgroundImage:`url(${texture})`}}>
      {props.children}
    </div>
  );
};

export default Card;
