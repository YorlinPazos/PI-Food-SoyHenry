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
                        model: Diet
                }] 
                })
                let results = [...queryBdd]

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${name}&addRecipeInformation=true&apiKey=${API_KEY}`)
                let mapClearApiArray = queryApi.data.results.map(el =>{
                    return{
                        id: el.id,
                        name: el.title,
                        diet: el.diets.map(el => el).join(', ')
                    }
                })
                results =[...queryBdd, mapClearApiArray]
                res.status(200).send(results)
            } catch (error) {
                next(error)
            }
        }
    }
}

const recipeController = new RecipeModel(Recipe);

module.exports = recipeController;


// ...&number=100 este endpoint sirve para traerme 100 recetas. agregandolo justo
//  despues del flag.