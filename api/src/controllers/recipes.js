const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }

    getAll = async (req, res, next) =>{
        if(req.query.name){
            const name = req.query.name.toLowerCase()
            try {
                let queryBdd = await this.model.findAll({
                    attributes:[/*'id', 'name', 'image','type', 'createdInDb' */],
                    where:{
                        name : {
                            [Op.iLike]: `%${name}%`  
                        }, 
                    },
                    include: [{
                        model: Diet
                     }]
                })

            } catch (error) {
                
            }
        }

    }

}

const recipeController = new RecipeModel(Recipe);

module.exports = recipeController;