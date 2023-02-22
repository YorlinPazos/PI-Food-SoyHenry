import React from 'react';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getRecipes } from '../actions';
import {Link} from 'react-router-dom'



export default function Home (){

  
    const dispatch = useDispatch()
    // con el useSelector me traigo todo lo del estado de recipes.
    const allRecipes = useSelector((state) => state.recipes)



    //Aqui traigo mis recetas cuando el component "home" se monta
    useEffect (()=>{
        dispatch(getRecipes())
    },[]) 

    //Recargar Recetas
    function handleClick(event){
        event.preventDefault();
        dispatch(getRecipes())
    }

    return(
        <div>
            <Link to='/recipes'>Crear Receta</Link>
            <h1>HENRY FOOD APP</h1>
            <button onClick={event =>{handleClick(event)}}>
                Recargar Recetas
            </button>
            <div>
                <select>
                    <option disabled selected>Orden alfabético:</option>
                    <option value='asc'>A - Z</option>
                    <option value='desc'>Z - A</option>
                </select>
                <select>
                    <option disabled selected>Ordenar por dieta:</option>
                    <option value='diet'></option>
                </select>
                <select>
                    <option value="All">Todas</option>
                    <option value="created">Creadas</option>
                    <option value="api">Existentes</option>
                </select>
            </div>
        </div>
    )

    
}