const axios = require('axios');
const { Recipe,Diet } = require('../db');
const ModelCrud = require("./index"); 
const { API_KEY } = process.env;
const { Op  } = require('sequelize')

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }

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
                        attributes: ['name'],   //incluyo el modelo Diet
                }] 
            })
                let mapClearDB = queryBdd.map(el => {
                    return{
                        id: el.id,
                        name: el.name,           //Limpio un poco los results
                        diets: el.diets.map(el => el.name).join(', ')
                    }
                })                  
                                        // API

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
                let filterResult = queryApi.data.results.filter(el => el.title.toLowerCase().includes(name.toLowerCase()))
             
                    let mapClearApi = await filterResult.map(el => {
                        return{
                            id: el.id,
                            name: el.title,
                            diets: el.diets.map(el => el).join(', ')
                        }
                    })
                   let results = [...mapClearDB, ...mapClearApi]
    
                   res.status(200).send(results);
            } catch (error) {
                next(error)
            }
        }
    }   
}

  
const nameController = new RecipeModel(Recipe);

module.exports = nameController;