const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');
const { API_KEY,API_KEY2,API_KEY3,API_KEY4 } = process.env;


class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }                                   // By ID

    getById = async (req, res, next) =>{
       
        const id = req.params.id; 

        try {
            if(isNaN(id)){
                let recipeIdBd = await this.model.findOne({
                    attributes: ['id', 'name', 'image','summary', 'healthScore'],
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

                recipeIdBd = JSON.stringify(recipeIdBd);
                recipeIdBd = JSON.parse(recipeIdBd);
                recipeIdBd.diets = recipeIdBd.diets.map(r => r.name).join(', ');

                if(recipeIdBd){
                    res.status(200)
                       .send(recipeIdBd)
                }else{
                    res.status(404).json({message: 'La receta no existe en la Base de datos'})
                }
            }

        else if(!isNaN(id)) {
                let obj = {};
                 let recipeIdApi;
        try {
            recipeIdApi = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY4}`);
            obj = {
                name: recipeIdApi.data.title,
                id: recipeIdApi.data.id,
                image: recipeIdApi.data.image,
                summary: recipeIdApi.data.summary,
                healthScore: recipeIdApi.data.healthScore,
                diets: recipeIdApi.data.diets.map(el => el).join(', ')
            };
                res.status(200).json(obj)

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
                attributes: ['id', 'name', 'image', 'createdInDb', 'healthScore'],
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
                healthScore: el.healthScore,
                createdInDb: el.createdInDb
               }
            });

            let results = [...mapGetAllClear]


            let response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?&addRecipeInformation=true&number=100&apiKey=${API_KEY4}`)
            let recipesMapApi = response.data.results.map(el =>{
                return{
                    name: el.title,
                    id: el.id,
                    image: el.image,
                    diets: el.diets.map(el => el).join(', '),
                    healthScore: el.healthScore
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

        if(req.body.healthScore < 0 || healthScore > 100) return res.status(400).json({message: 'El healthScore debe ser un numero entre 0 y 100. EJEMPLO: 74.5'})
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
