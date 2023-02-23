import axios from 'axios';
import { GET_RECIPES, GET_DIETS, FILTER_DIETS,
    FILTER_CREATED, ORDER_BY_NAME,ORDER_BY_HEALTHSCORE,
    GET_BY_NAME, GET_DETAILS } from '../actionTypes'


//                                          "Interacción" entre Back y Front

export function getRecipes(){
    return async function(dispatch){
        let json = await axios('http://localhost:3001/recipes');
        return dispatch({
            type: GET_RECIPES,
            payload: json.data
        });
    }
}


export function filterDiet(payload){                   //load...
    return {
        type: FILTER_DIETS,
        payload
    }
}

export function getDiets(){
    return async function(dispatch){
        var info = await axios.get("http://localhost:3001/diets",{            //ok

        })
        return dispatch({type: GET_DIETS, payload: info.data})
    }
}
