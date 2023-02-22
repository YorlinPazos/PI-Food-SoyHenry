

const initialState = {
    recipes : [] // acá viene todo lo que envia la action "GET_RECIPES"
}




function rootReducer (state = initialState, action){
    switch(action.type){
        case "GET_RECIPES": 
            return{
                ...state, 
                recipes: action.payload  
        }
    }

}

export default rootReducer;