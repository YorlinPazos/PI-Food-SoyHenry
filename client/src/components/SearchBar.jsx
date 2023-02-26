import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getNameRecipes } from "../actions";


export default function SearchBar(){
    const dispatch = useDispatch()
    const [name, setName] = useState('')

function handleInputChange(e){
        e.preventDefault()
        setName(e.target.value)
} 


function handleSubmit(e){
    e.preventDefault()
    dispatch(getNameRecipes(name))
    setName("")
}

    return (
        <div class="search-container"> 
            <input type='text' placeholder = "Search..." onChange= {(e) => handleInputChange(e)} value={name}/>
            <button type='submit' onClick={(e) => handleSubmit(e)}>Search</button>
        </div>
    )

}
