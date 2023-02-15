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
            attributes: ['name']
        })
        try {
            let dbClear = dbLog.map(el => {
                return{
                    name: el.name
                }
            })
            if(dbClear.length) return res.send(dbClear)

                    // si hay info la retorno, si no sigo con la api.

                    let response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?&addRecipeInformation=true&apiKey=${API_KEY}`)
                    let dietsRes = response.data.results.map(el => el.diets)
                    //Aplano con flat y creo un arr unidimensional.
                    let dietsFlat = dietsRes.flat()
                    let uniqueList = Array.from(new Set(dietsFlat))
                    for(let i = 0; i < uniqueList.length; i++){
                        const diet = { name: uniqueList[i]}
                        await this.model.findOrCreate({
                            where: diet,
                            defaults: diet
                        });
                    }
                    res.send(uniqueList)
        } catch (error) {
            next(error)
        }
    }
}

  
const dietController = new DietModel(Diet);

module.exports = dietController;