import { GET_RECIPES, GET_DIETS, FILTER_DIETS,
    FILTER_CREATED, ORDER_BY_NAME,ORDER_BY_HEALTHSCORE,
    GET_BY_NAME, GET_DETAILS, CREATE_RECIPE } from '../actionTypes'



const initialState = {
    recipes : [], //todas las recetas 
    diets : [],   
    backup : [], // me creo una copia de seguridad, la cual será mi soporte también para el filtrado por diets
    detail : [],
}


function rootReducer (state = initialState, action){
    switch(action.type){
        case GET_RECIPES: 
            return{
                ...state, 
                recipes: action.payload,
                backup : action.payload  //y la seteo acá, mientras uno se modifica, el otro seguira con todo
        }


        case GET_DIETS:
            return{
                ...state,
                diets: action.payload
            }

                     
        case FILTER_DIETS: 
            const allRecps = state.backup //este estado mantiene todas las recetas
            const filtered = allRecps.filter(e => e.diets.includes(action.payload))// aquí recibe el valor de cada diets al accionar el "click"
            return {
                ...state,             
                recipes : filtered  // y mi estado recipes, en cambio si se modifica de acuerdo al payload.
             }


        case FILTER_CREATED:
        let allCreated = state.backup;
        let filterCreated = action.payload === "Created" ? allCreated.filter(el => typeof el.id === "string")
        : allCreated.filter(el => typeof el.id === "number");
        return {
            ...state,
            recipes : action.payload === "All" ? state.backup : filterCreated
        }


        case ORDER_BY_HEALTHSCORE:
            const healthScoreSorted =
              action.payload === "high"
                ? [...state.recipes].sort(function (a, b) {
                    if (a.healthScore > b.healthScore) return -1;
                    if (b.healthScore > a.healthScore) return 1;
                    return 0;
                  })
                : [...state.recipes].sort(function (a, b) {
                    if (a.healthScore > b.healthScore) return 1;
                    if (b.healthScore > a.healthScore) return -1;
                    return 0;
                  });
                  return {
                    ...state,
                    recipes: healthScoreSorted,
                  };

                
        //* He aquí algunos valores "Unicode":  A: 97, B: 98, y Z: 122. 
        //* .sort() ordena un arr. en este caso se comparan dos valores, los cuales son cadenas de texto.
        //* carácter por carácter, hasta encontrar diferencias.
        //* EJEMPLO: abc & abd, los 2 primeros carácteres, tendrán un mismo valor, pero en el tercero no
        //* y es por ello que "abc" irá antes , pues c es menor a d, debido a su valor "Unicode".
       
       
        case ORDER_BY_NAME:
        let sortedArr = action.payload === 'asc' ?
        state.recipes.sort(function (a, b) {
            if(a.name > b.name){      
                return 1;
            }
            if(b.name > a.name){ //1, despues de, -1 antes que, y 0, valor igual y no se cambian pos.
                return -1;
            }
            return 0;
        }) : 
        state.recipes.sort(function (a, b){
            if(a.name > b.name){
                return -1;
            }
            if(b.name > a.name){       
                return 1;
            }
            return 0;
        })
        return{
            ...state,
            recipes : sortedArr
        }


        case GET_BY_NAME:
        return{
            ...state,
            recipes: action.payload
        }    

        case GET_DETAILS:
                    return{
                        ...state,
                        detail: action.payload
                    }

        case CREATE_RECIPE:
                    return{
                        ...state
                    }            

        default:
             return state;
    }

}

export default rootReducer;