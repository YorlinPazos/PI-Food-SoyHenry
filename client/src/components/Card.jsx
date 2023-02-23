import React from 'react';
import defaultImg from '../styles/images/defaultImg.jpg'

export default function Card({name, image, diets}){

    return(
        <div>
            <h3>{name}</h3>
            <h5>{diets}</h5>
            <img src={image ? image : defaultImg } alt="" width="200px" height="250px" />
        </div>
    );
}