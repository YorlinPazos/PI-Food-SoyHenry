const axios = require('axios');
const { Recipe,Diet } = require('../db');
const ModelCrud = require("./index"); 
const { API_KEY,API_KEY2,API_KEY3,API_KEY4,API_KEY5,API_KEY6,API_KEY7 } = process.env;
const { Op  } = require('sequelize')

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }                                          //Search By name 
    getAll = async (req, res, next) =>{
        try {
            const name = req.query.name;
            if(req.query.name){
                let queryBdd = await this.model.findAll({
                  attributes:['id', 'name', 'createdInDb','healthScore', "image"],
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
                       diets: el.diets.map(el => el.name).join(', '),
                       healthScore: el.healthScore,
                       image: el.image
                       }
                    })     
                                              //  API

                let queryApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY4}&addRecipeInformation=true&number=100`)
                let filterResult = queryApi.data.results.filter(el => el.title.toLowerCase().includes(name.toLowerCase()))
             
                    let mapClearApi = await filterResult.map(el => {
                        return{
                            id: el.id,
                            name: el.title,
                            diets: el.diets.map(el => el).join(', '),
                            healthScore: el.healthScore,
                            image: el.image
                        }
                    })
                   let results = [...mapClearDB, ...mapClearApi]
                   if(results.length){
                    res.status(200).send(results);
                   }else{
                    res.status(404).json({
                        message: `No existe la receta con el nombre ${name}`
                    })
                   }

            } else {
            res.status(404).json({
                message: 'Ingrese un nombre antes de continuar con la búsqueda'
            }) 
                }
            } catch (error) {
            next(error)
        }
      
    }   
}

  
const nameController = new RecipeModel(Recipe);

module.exports = nameController;
