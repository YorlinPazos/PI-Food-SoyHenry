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
                    res.json(recipeIdBd)
                }else{
                    res.status(404).json({message: 'La receta no existe en la Base de datos'})
                }
            }
            else if(!isNaN(id)){
                let recipeIdApi = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
                let obj = {}// la info me llega en un obj y no en un arr, por eso hago esto.
                obj = {
                    name: recipeIdApi.data.title,
                    id: recipeIdApi.data.id,
                    image: recipeIdApi.data.image
                }
                    res.json(obj)
            }
        } catch (error) { 
           next(error)
    }
}                                        //By Name
    getAll = async (req, res, next) =>{
        if(req.query.name){
            const name = req.query.name.toLowerCase()
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
          
                let mapClear = queryBdd.map(el => {
                    return{
                        id: el.id,
                        name: el.name,
                        diets: el.diets.map(el => el.name).join(', ')
                    }
                })
                let results = [...mapClear]

                                            //   API  

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&addRecipeInformation=true&apiKey=${API_KEY}`)
                let mapClearApiArray = queryApi.data.results.map(el =>{
                    return{
                        id: el.id,
                        name: el.title,
                        diets: el.diets.map(el => el).join(', ')
                    }
                })
                results =[...mapClear, mapClearApiArray]
                res.status(200).send(results)
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
