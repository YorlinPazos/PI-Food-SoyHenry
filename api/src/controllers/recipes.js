const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');
const { API_KEY } = process.env;
const { Op } = require('sequelize')

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }

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
                        model: Diet                      //Aquí vinculo mis diets a mi búsqueda por query
                }] 
                })
                let mapClear = queryBdd.map(el => {
                    return{
                        id: el.id,
                        name: el.name,
                        diets: el.diets.map(diet => diet.name).join(', ')
                    }
                })
                let results = [...mapClear]

                                        //Acá la peticiona la api en primera instancia

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&addRecipeInformation=true&apiKey=${API_KEY}`)
                let mapClearApiArray = queryApi.data.results.map(el =>{
                    return{
                        id: el.id,
                        name: el.title,
                        diets: el.diets.map(el => el).join(', ')
                    }
                })
                results =[...queryBdd, mapClearApiArray]
                res.status(200).send(results)
            } catch (error) {
                next(error)
            }
        }
    }

    post = async (req, res, next) => {
        let {name, summary, healthScore, steps, image, diets} = req.body;

        if(!req.body.name ) return res.status(400).json({message: 'El campo >| name |< es obligatorio'})
        if(!req.body.summary ) return res.status(400).json({message: 'El campo >| summary |< es obligatorio'})

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