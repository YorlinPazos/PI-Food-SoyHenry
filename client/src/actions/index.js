import axios from 'axios';
import { GET_RECIPES, GET_DIETS, FILTER_DIETS,
    FILTER_CREATED, ORDER_BY_NAME,ORDER_BY_HEALTHSCORE,
    GET_BY_NAME, GET_DETAILS } from '../actionTypes'


                                          

export function getRecipes(){
    return async function(dispatch){
        let json = await axios('http://localhost:3001/recipes',{});  //  "Interacción" entre Back y Front
        return dispatch({
            type: GET_RECIPES,
            payload: json.data
        });
    }
}



export function getDiets(){
    return async function(dispatch){
        var info = await axios.get("http://localhost:3001/diets",{})
        return dispatch({type: GET_DIETS, payload: info.data})
    }
}

 
export function filterDiet(payload){                  
    return {
        type: FILTER_DIETS,
        payload
    }

}

export function filterCreated(payload){
    return{
        type: FILTER_CREATED,
        payload
    }
}


export function orderByName(payload){
    return{
        type: ORDER_BY_NAME,
        payload
    }
}


export function orderByHealthScore(payload){                   
    return {
        type: ORDER_BY_HEALTHSCORE,
        payload
    }
}


export function getNameRecipes(name){                           
    return async function (dispatch){
        try {
            var json = await axios.get(`http://localhost:3001/name?name=${name}`); 
        return dispatch({
            type: GET_BY_NAME,
            payload: json.data
        })
        } catch (error) {
            console.log(error)
        }
        
    }

}

export function getDetail(id){
    return async function (dispatch){
        try {
        var json = await axios.get("http://localhost:3001/recipes/" + id)  

        return dispatch ({
            type: GET_DETAILS,
            payload: json.data
            })
        } catch (error) {
         console.log(error)   
    }


    }
}

