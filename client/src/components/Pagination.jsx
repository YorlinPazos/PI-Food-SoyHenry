import React from 'react';

export default function Paginado({recipesPerPage, allRecipes, paginado}){
    const pageNumbers = []

    for(let i = 0; i <= Math.ceil(allRecipes/recipesPerPage); i++){
        pageNumbers.push(i+1)
    }

    return(
        <nav>
            <div className='paginado'>
                {
                    pageNumbers &&
                    pageNumbers.map(number =>(
                        <button className='number' key={number}>
                        <a href onClick={() => paginado(number)}>{number}</a>
                        </button>
                    ))
                }
            </div>
        </nav>
    )
}
