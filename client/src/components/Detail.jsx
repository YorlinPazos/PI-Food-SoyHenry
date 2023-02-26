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


    const myRecipe = useSelector((state) => state.detail)// me traigo mi estado del reducer.

return (
    <div>
            <div>
                <h1>{myRecipe.name}</h1>
                <img src={myRecipe.image} alt="" width="500px" height="700px" />
            </div>
        <Link to='/home'>
            <button>Go Back</button>
        </Link>
    </div>
)
}


