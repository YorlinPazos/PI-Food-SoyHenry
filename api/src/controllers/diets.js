const axios = require('axios');
const { Diet } = require('../db');
const ModelCrud = require("./index"); 
const { API_KEY } = process.env;


class DietModel extends ModelCrud{
    constructor(model){
        super(model)
    }

    getAll = async (req, res, next) => {
                    //Empiezo preguntando si hay info en la db, si da true la retorno y corto
        let dbLog = await this.model.findAll({
            attributes: ['name'],
        })
        try {
            let dbClear = dbLog.map(el => {
                return{
                    name: el.name
                }
            })
            if(dbClear.length) return res.send(dbClear)
                    // Si no había info en mi database, voy a la api, la pido y la creo

                    let response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?&addRecipeInformation=true&apiKey=${API_KEY}`)
                    let dietsRes = response.data.results.map(el => el.diets)
                    //Aplano con flat y creo un arr unidimensional.
                    let dietsFlat = dietsRes.flat()
                    for(let i = 0; i < dietsFlat.length; i++){
                        const diet = { name: dietsFlat[i]}
                        await this.model.findOrCreate({
                            where: diet,
                            defaults: diet
                        });
                    }
                    res.send(dietsFlat)
        } catch (error) {
            next(error)
        }
    }
}

  
const dietController = new DietModel(Diet);

module.exports = dietController;