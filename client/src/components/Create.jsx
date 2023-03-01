// import React, {useState,useEffect} from 'react'
// import {Link,useHistory} from 'react-router-dom';
// import { postRecipe, getDiets } from '../actions/index';
// import { useDispatch, useSelector } from 'react-redux';



// function validate(input){
//     const letras = /^[a-zA-Z]+$/;
//     const numeros = /^\d+$/;
//     let errors = {};

//     if(!input.name){
//         errors.name = 'se requiere un Nombre';
//     }
//     else if(!letras.test(input.name) && !numeros.test(input.name)){
//         errors.name = 'El nombre no debe ser un caracter especial o simbolo';
//     }
//     else if(input.healthScore < 0 || input.healthScore > 100){
//         errors.healthScore = 'el healthScore no puede ser menor a 0 o mayor a 100. !.puede tener decimales.¡';
//     }
//     else if(!input.summary){
//         errors.summary = 'el summary/resúmen es un campo necesario'
//     }
//     return errors;
// }



// export default function Create(){ 
//     const dispatch = useDispatch()
//     const history = useHistory()
//     const diets = useSelector((state) => state.diets)     //me traigo mi estado que tiene las diets
//     const [errors, setErrors] = useState({})


//     const [input, setInput] = useState({
//                 name: "",
//                 summary: "",
//                 healthScore: "",                         //seteo lo que necesita el post
//                 image: "",
//                 steps: "",
//                 diets: [] 
//     })

    
//     useEffect(() => {
//         dispatch(getDiets())                            //nito renderizar mis diets. asi que las despacho
//     },[])

//     function handleChange(e){
//         setInput({
//             ...input,
//             [e.target.name] : e.target.value
//         })  
//         setErrors(validate({
//             ...input,
//             [e.target.name] : e.target.value
//         }))    
// }           

//     function handleSubmit(e){
//         e.preventDefault();
//         dispatch(postRecipe(input))
//         alert("Recipe has been created!")
//         setInput({
//             name:" ",
//             summary:"",
//             healthScore: "",
//             image:"",
//             steps: "",
//             diets:[]
//         })
//         history.push('/home')
//     }

//     function handleDietsSelect(e){
//         setInput({
//             ...input,
//             diets: [...input.diets, e.target.value]
//         })
//     }

//     return(
//         <div className='form-style'>
//             <Link to= '/home'><button>Volver</button></Link>

//             <h1>Crea tu receta</h1>
//             <form onSubmit={(e)=>handleSubmit(e)}>
             
//                 <div>
//                     <label>Name:</label>
//                     <input
//                     type= "text"
//                     value= {input.name}
//                     name= "name"
//                     onChange={(e)=>handleChange(e)}
//                     />
//                     {errors.name && (<p className='error'>{errors.name}</p>)}
//                 </div>
               
//                 <div>
//                     <label>Summary:</label>
//                     <input
//                     type="text"
//                     value= {input.summary} 
//                     name= "summary"
//                     onChange={(e)=>handleChange(e)}
//                     />
//                 </div>
               
//                 <div>
//                     <label>Steps:</label>
//                     <input
//                     type= "text"
//                     value= {input.steps}
//                     name= "steps"
//                     onChange={(e)=>handleChange(e)}
//                     />
//                 </div>
              
//                 <div>
//                     <label>HealthScore:</label>
//                     <input
//                     type= "number"
//                     value= {input.healthScore}
//                     name= "healthScore"
//                     onChange={(e)=>handleChange(e)}
//                     />
//                 </div>
              
//                 <div>
//                     <label>Image:</label>
//                     <input type="text" value={input.image} name= "image" onChange={(e)=>handleChange(e)} />
//                 </div>
              
//                  <div>
//                     <label>diets:</label>
//                 <select onChange={(e) => handleDietsSelect(e)}>
//                         <option disabled selected>Select an option</option>
//                     {diets.map((diet) => {
//                         return <option key={diet.id} value={diet.name}>{diet.name}</option>
//                         })}
//                 </select>
//                 </div> 
  
//                          <ul><li>{input.diets.map(el => el + " ,")}</li></ul>

//                 <button type='submit'>Crear receta</button>
//             </form>
//         </div>
//     )
// } 



import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { postRecipe, getDiets } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';

function validate(input) {
  const letras = /^[a-zA-Z]+$/;
  const numeros = /^\d+$/;
  let errors = {};

  if (!input.name) {
    errors.name = 'se requiere un Nombre';
  } else if (!letras.test(input.name) && !numeros.test(input.name)) {
    errors.name = 'El nombre no debe ser un caracter especial o simbolo';
  } else if (input.healthScore < 0 || input.healthScore > 100) {
    errors.healthScore =
      'el healthScore no puede ser menor a 0 o mayor a 100. !.puede tener decimales.¡';
  } else if (!input.summary) {
    errors.summary = 'el summary/resúmen es un campo necesario';
  }
  return errors;
}

export default function Create() {
  const dispatch = useDispatch();
  const history = useHistory();
  const diets = useSelector((state) => state.diets);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [input, setInput] = useState({
    name: '',
    summary: '',
    healthScore: '',
    image: '',
    steps: '',
    diets: [],
  });

  useEffect(() => {
    dispatch(getDiets());
  }, []);

  useEffect(() => {
    setErrors(validate(input));
  }, [input]);

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    dispatch(postRecipe(input))
      .then(() => {
        alert('Recipe has been created!');
        setInput({
          name: '',
          summary: '',
          healthScore: '',
          image: '',
          steps: '',
          diets: [],
        });
        setIsSubmitting(false);
        history.push('/home');
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
      });
  }

  function handleDietsSelect(e) {
    setInput({
      ...input,
      diets: [...input.diets, e.target.value],
    });
  }

  const isDisabled = Object.keys(errors).length > 0 || isSubmitting;

  return (
    <div className='form-style'>
      <Link to='/home'>
        <button>Volver</button>
      </Link>

      <h1>Crea tu receta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type='text'
            value={input.name}
            name='name'
            onChange={handleChange}
          />
          {errors.name && <p className='error'>{errors.name}</p>}
        </div>

        <div>
          <label>Summary:</label>
          <input
            type='text'
            value={input.summary}
            name='summary'
            onChange={handleChange}
          />
          {errors.summary && <p className='error'>{errors.summary}</p>}
        </div>

        <div>
          <label>Health Score:</label>
          <input
            type='number'
            value={input.healthScore}
            name='healthScore'
            onChange={handleChange}
          />
          {errors.healthScore&& <p className='error'>{errors.healthScore}</p>}
</div>
<div>
      <label>Image:</label>
      <input
        type='text'
        value={input.image}
        name='image'
        onChange={handleChange}
      />
    </div>

    <div>
      <label>Steps:</label>
      <textarea value={input.steps} name='steps' onChange={handleChange} />
    </div>

    <div>
      <label>Diets:</label>
      <select onChange={handleDietsSelect}>
        <option value=''>--Selecciona una dieta--</option>
        {diets.map((d) => (
          <option key={d.id} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>
      <ul>
        {input.diets.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>

    <button type='submit' disabled={isDisabled}>
      Crear Receta
    </button>
  </form>
</div>
);
}