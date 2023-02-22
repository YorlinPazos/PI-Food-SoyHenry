import axios from 'axios';


//                                          "Interacción" entre Back y Front

export function getRecipes(){
    return async function(dispatch){
        let json = await axios('http://localhost:3001/recipes');
        return dispatch({
            type: 'GET_RECIPES',
            payload: json.data
        });
    }
}

