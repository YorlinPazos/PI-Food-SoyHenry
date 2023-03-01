import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetail } from "../actions/index";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


export default function Detail(){
    const {id} = useParams()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getDetail(id));
    }, [dispatch, id])

    const myRecipe = useSelector((state) => state.detail)//traigo mi estado.


    // Aquí me deshago de las etiquetas entre el texto del resúmen(summary)
    const summary = myRecipe.summary ? myRecipe.summary.replace(/(<([^>]+)>)/gi, "") : "";

    return (
    <div>
        <div>
                <h3>
                    <h1>Nombre: </h1>{myRecipe.name}
                </h3>
                <img src={myRecipe.image} alt="" width="300px" height="350px" />
                <p>
                    <h2>Resúmen: </h2>{summary}
                </p>
                <h3>HealthScore: {myRecipe.healthScore}</h3>
                <h3><h2>Tipos de dieta: </h2>{myRecipe.diets}</h3> 
                <h2>Paso a paso:</h2>
                {Array.isArray(myRecipe.steps) ? ( //Es un arr de obj? saca cada propiedad(step,number) : manejala como una cadena de strings;
             <div>
                 {myRecipe.steps.map((step) => (
                <div key={step.number}>
                   <h4>Step: {step.number}</h4>
                <p>{step.step}</p>
                </div>))}
            </div>) : (<p>{myRecipe.steps}</p>)}
        </div> 
            <Link to='/home'>
                <button>Go Back</button>
            </Link>
    </div>
    )
}



