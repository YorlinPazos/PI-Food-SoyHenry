import { GET_RECIPES, GET_DIETS, FILTER_DIETS,
    FILTER_CREATED, ORDER_BY_NAME,ORDER_BY_HEALTHSCORE,
    GET_BY_NAME, GET_DETAILS } from '../actionTypes'



const initialState = {
    recipes : [], // acá viene todo lo que envia la action GET_RECIPES
    diets : [],   //FILTER_DIETS
    backup : [], // siempre tendra todas las recetas 
}




function rootReducer (state = initialState, action){
    switch(action.type){
        case GET_RECIPES: 
            return{
                ...state, 
                recipes: action.payload,
                backup : action.payload
        }

        case GET_DIETS:
            return{
                ...state,
                diets: action.payload
            }


        // case FILTER_DIETS:
        //     const allDiets = state.backup
        //     const filtered = allDiets.filter(e => (e.diets == action.payload))
        //     return {
        //         ...state,
        //         recipes : filtered
        //      }


        

        case FILTER_DIETS:
            const allDiets = state.backup
            const filtered = allDiets.filter(e => e.diets.includes(action.payload))
            return {
                ...state,
                recipes : filtered
             }
  
  
        // case 'FILTER_BY_DIET':
        //     const allRecipe = state.backup;
        //     const statusFilter =  allRecipe.filter(el => el.diets.includes(action.payload))
        //     const allFilter = statusFilter.length > 1? statusFilter : allRecipe
        //     return{
        //         ...state,
        //         aux: allRecipe,
        //         recipes: action.payload === 'default'? state.backup : allFilter,
        //     }  

        default:
             return state;
    }

}

export default rootReducer;