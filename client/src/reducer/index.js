import { GET_RECIPES, GET_DIETS, FILTER_DIETS,
    FILTER_CREATED, ORDER_BY_NAME,ORDER_BY_HEALTHSCORE,
    GET_BY_NAME, GET_DETAILS } from '../actionTypes'



const initialState = {
    recipes : [], // acá viene todo lo que envia la action GET_RECIPES
    diets : []    //FILTER_DIETS
}




function rootReducer (state = initialState, action){
    switch(action.type){
        case GET_RECIPES: 
            return{
                ...state, 
                recipes: action.payload  
        }

        case GET_DIETS:
            return{
                ...state,
                diets: action.payload
            }


        case FILTER_DIETS:
            const allDiets = state.recipes
            const filtered = allDiets.filter(e => (e.diets == action.payload))
            return {
                ...state,
                recipes : filtered
             }

        default:
             return state;
    }

}

export default rootReducer;