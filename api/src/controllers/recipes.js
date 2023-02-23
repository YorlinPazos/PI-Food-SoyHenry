const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');
const { API_KEY,API_KEY2 } = process.env;


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
                  
                                                //get All x100 recipes
    getAll = async (req, res, next) =>{
        try {

            let getRecDb = await this.model.findAll({
                attributes: ['id', 'name', 'image', 'createdInDb'],
                include: [{
                    model: Diet,
                    attributes: ['name'],
                    through: {
                        attributes: [],
                    }
                }]
            });

            const mapGetAllClear = getRecDb.map(el => {
               return{
                name: el.name,
                id: el.id,
                image: el.image,
                diets: el.diets.map(el => el.name).join(', '), 
               }
            });

            let results = [...mapGetAllClear]


            let response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?&addRecipeInformation=true&number=100&apiKey=${API_KEY}`)
            let recipesMapApi = response.data.results.map(el =>{
                return{
                    name: el.title,
                    id: el.id,
                    image: el.image,
                    diets: el.diets.map(el => el).join(', ')
                }
            });
            results = [...results, ...recipesMapApi]
            res.status(200).json(results)
            console.log(results.length)
        } catch (error) {
            next(error)            
        }
    }
     
                                // Post & validation
 
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
                    name : diets                   //busco la diet que le pase por body
                }
            })
            createRecipe.addDiet(dietDb)           //se vincula si el nombre de la diet existe en la bdd.
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
