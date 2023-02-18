const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');
const { API_KEY } = process.env;
const { Op  } = require('sequelize')

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }                                   // By ID

    getById = async (req, res, next) =>{
       
        const id = req.params.id; 

        try {
            if(isNaN(id)){
                let recipeIdBd = await this.model.findOne({
                    attributes: ['id', 'name', 'image', ],
                    where: {
                        id: id
                    },
                    include: [{
                        model: Diet,
                        attributes: ['name'],
                        through:{
                            attributes: []
                        }
                    }]
                })
                if(recipeIdBd){
                    res.status(200)
                       .json({
                        data: recipeIdBd,
                        message: 'Se encontró esta receta'
                    })
                }else{
                    res.status(404).json({message: 'La receta no existe en la Base de datos'})
                }
            }

        else if(!isNaN(id)) {
                let obj = {};
                 let recipeIdApi;

        try {
            recipeIdApi = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
            obj = {
                name: recipeIdApi.data.title,
                id: recipeIdApi.data.id,
                image: recipeIdApi.data.image
            };
                res.status(200).json({
                    data: obj,
                    message: 'Se encontró esta receta'
                });

        } catch (error) { //catch propio de la parte de API para no obstruir el handler de la app 
            res.status(404).json({ message: 'La receta no existe en la API externa' });
        }
    }
    } catch (error) {
    next(error);
    }
}   
                                           //By Name
    getAll = async (req, res, next) =>{
        if(req.query.name){
            const name = req.query.name;
            try {
                let queryBdd = await this.model.findAll({
                    attributes:['id', 'name', 'createdInDb'],
                    where:{
                        name : {
                            [Op.iLike]: `%${name}%`  
                        }, 
                    },
                    include: [{
                        model: Diet,
                        attributes: ['name'],
                           //Aquí vinculo mis diets a mi búsqueda por query
                }] 
            })
          
                let mapClearDB = queryBdd.map(el => {
                    return{
                        id: el.id,
                        name: el.name,
                        diets: el.diets.map(el => el.name).join(', ')
                    }
                })
                let results = [...mapClearDB]

                                            //   API  

                // let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&addRecipeInformation=true&apiKey=${API_KEY}`)
                // let mapClearApiArray = queryApi.data.results.map(el =>{
                //     return{
                //         id: el.id,
                //         name: el.title,
                //         diets: el.diets.map(el => el).join(', ')
                //     }
                // })
                // results =[...mapClear, mapClearApiArray]
                // res.status(200).send(results)

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&apiKey=${API_KEY}`)
                let filterResult = queryApi.data.results.filter(el => el.title.toLowerCase().includes(name.toLowerCase()))
                  console.log(filterResult)
             
                    let mapClearApi = await filterResult.map(el => {
                        return{
                            id: el.id,
                            name: el.title,
                            diets: el.diets.map(el => el).join(', ')
                        }
                    })
                    results = [...mapClearDB, mapClearApi]
                   res.status(200).send(results);
            } catch (error) {
                next(error)
            }
        }
    }                                   // Post & validation
 
    post = async (req, res, next) => {
        let {name, summary, healthScore, steps, image, diets} = req.body;

        if(!req.body.name ) return res.status(400).json({message: 'El campo >| name |< es obligatorio'})
        if(!req.body.summary ) return res.status(400).json({message: 'El campo >| summary |< es obligatorio'})
        if(typeof req.body.healthScore != 'number' ) return res.status(400).json({message: 'El campo >| healthScore |< debería ser un número'})

        try {
            let createRecipe = await this.model.create({
                name,
                summary,
                healthScore,
                steps,
                image
            })
            let dietDb = await Diet.findAll({
                where: {
                    name : diets
                }
            })
            createRecipe.addDiet(dietDb)
            res.status(201).json({
                data: createRecipe,
                message: 'La receta ha sido creada con éxito'
            })

        } catch (error) {
        next(error)           
        }
    }
}

const recipeController = new RecipeModel(Recipe);

module.exports = recipeController;


// ...&number=100 este endpoint sirve para traerme 100 recetas. agregandolo justo
//  despues del flag.
