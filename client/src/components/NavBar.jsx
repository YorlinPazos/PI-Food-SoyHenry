import React from 'react';
import { Link  } from 'react-router-dom'


function NavBar(){
    return(
        <Link to='/home'>Home</Link>,
        <Link to='/create'>Crear Receta</Link>
    )
}

export default NavBar;


