import React from 'react';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getRecipes, filterDiet, getDiets } from '../actions';
import {Link} from 'react-router-dom'
import Card from './Card';
import Paginado from './Pagination';

export default function Home (){

  
    const dispatch = useDispatch()
    // con el useSelector me traigo todo lo del estado de recipes.
    const allRecipes = useSelector((state) => state.recipes)

    const [currentPage, setCurrentPage] = useState(1)
    const [recipesPerPage, setRecipesPerPage] = useState(9)
    const indexOfLastRecipe = currentPage * recipesPerPage//9
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage//9
    const currentRecipes = allRecipes.slice(indexOfFirstRecipe,indexOfLastRecipe)

    const diets = useSelector((state) => state.diets);
    useEffect(() => {
      dispatch(getDiets());
    }, []);

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
        // e.preventDefault();
        dispatch(filterDiet(e.target.value));
        setCurrentPage(1)
      }
    

    return(
        <div>
            <Link to='/recipe'>Crear Receta</Link>
            <h1>HENRY FOOD APP</h1>
            <button onClick={event =>{handleClick(event)}}>
                Recargar Recetas
            </button>
            <div>

                <select>
                    <option disabled selected>Por Healthscore:</option>
                    <option value="high">Alto</option>
                    <option value="low">Bajo</option>
                </select>

                <select>
                    <option disabled selected>Orden alfabético:</option>
                    <option value='asc'>A - Z</option>
                    <option value='desc'>Z - A</option>
                </select>

                <select onChange={(e) => handleDietFilter(e)}>
                     <option disabled selected >Por  tipo de dieta:</option>
                    {diets.map((gen) => {
                        return <option key={gen.id} value={gen.name}>{gen.name}</option>;
                     })}
                </select>

                <select>
                    <option value="All">Todas</option>
                    <option value="created">Creadas</option>
                    <option value="api">Existentes</option>
                </select>
                <Paginado
                recipesPerPage={recipesPerPage}
                allRecipes={allRecipes.length}
                paginado={paginado}
                />

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
        </div>
    )   
}