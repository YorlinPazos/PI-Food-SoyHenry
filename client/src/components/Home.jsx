import React from 'react';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getRecipes, filterDiet, getDiets,filterCreated, orderByName, orderByHealthScore } from '../actions';
import {Link} from 'react-router-dom'
import Card from './Card';
import Paginado from './Pagination';
import SearchBar from "./SearchBar";


export default function Home (){

  
    const dispatch = useDispatch()
    // con el useSelector me traigo todo lo del estado de recipes.
    const allRecipes = useSelector((state) => state.recipes)

    // este est. local arranca vacio, me sirve para renderiazar la modificacion en pág(1) del sort
    const [orden, setOrden] = useState('') 


    const [currentPage, setCurrentPage] = useState(1)
    const [recipesPerPage, setRecipesPerPage] = useState(9)
    const indexOfLastRecipe = currentPage * recipesPerPage//9
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage//9
    const currentRecipes = allRecipes.slice(indexOfFirstRecipe,indexOfLastRecipe)

    const diets = useSelector((state) => state.diets);
    useEffect(() => {
      dispatch(getDiets());
    },[] );

    const paginado = (pageNumber) => {
        setCurrentPage(pageNumber)
    }



    //Aqui traigo mis recetas cuando el component "home" se monta
    useEffect (()=>{
        dispatch(getRecipes())
    },[]) 

    //Recargar Recetas
    function handleClick(event){
        event.preventDefault();
        dispatch(getRecipes())
    }

    //filtro por diets
    function handleDietFilter(e) {
        dispatch(filterDiet(e.target.value));
        setCurrentPage(1)
      }


    //filtro creados/existentes
      function handleFilterCreated(e){
        dispatch(filterCreated(e.target.value))
        setCurrentPage(1)
    }     


    //Sort A-Z & Z-A
    function handleSort (e){
        e.preventDefault()
        dispatch(orderByName(e.target.value))
        setCurrentPage(1)
        setOrden(`Ordenado ${e.target.value}`) //soporte para el seteo en pág.1
    }
     
    // Sort healthScore
    function handleSortByHealthScore(e){
        dispatch(orderByHealthScore(e.target.value)) //*hacer retoque en cuanto al setOrden, Ordenado etc */
      }


    return(
        <div>
            <Link to='/recipe'>Crear Receta</Link>
            <h1>HENRY FOOD APP</h1>
            <button onClick={event =>{handleClick(event)}}>
                Recargar Recetas
            </button>
            <div>

                 <select onChange={(e) => handleSortByHealthScore(e)}>
                    <option disabled selected>Por Healthscore:</option>
                    <option value="high">Alto</option>
                    <option value="low">Bajo</option>
                </select>

                <select onChange={(e) => handleSort(e)}>
                    <option disabled  selected>Orden alfabético:</option>
                    <option value='asc'>A - Z</option>
                    <option value='desc'>Z - A</option>
                </select>

                <select onChange={(e) => handleDietFilter(e)}>
                     <option disabled selected>Por  tipo de dieta:</option>
                    {diets.map((gen) => {
                        return <option key={gen.id} value={gen.name}>{gen.name}</option>;
                     })}
                </select>

                <select onChange={(e) => handleFilterCreated(e)}>
                    <option value='All'>Todas</option>
                    <option value='Created'>Creadas</option>
                    <option value='Api'>Existentes</option>
                </select>
                <Paginado
                recipesPerPage={recipesPerPage}
                allRecipes={allRecipes.length}
                paginado={paginado}
                />
                <SearchBar/>
            </div>
                { currentRecipes?.map((rec) =>{
                    return(
                        <div>
                            <Link to={'/home/' + rec.id}>
                                <Card name={rec.name} image={rec.image} diets={rec.diets} key={rec.id} />
                            </Link>
                        </div>
                    )
                 })}

            
        </div>
    )   
}