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


    const myRecipe = useSelector((state) => state.detail)
return (
    <div>
            <div>
                <h1>{myRecipe.name}</h1>
                <img src={myRecipe.image} alt="" width="500px" height="700px" />
                <p>Resúmen:{myRecipe.summary}</p>
                <h3>{myRecipe.healthScore}</h3>
                {/* <h3>{myRecipe.diets}</h3> */}
                {/* <p>{myRecipe.steps}</p> */}
            </div>
        <Link to='/home'>
            <button>Go Back</button>
        </Link>
    </div>
)
}






