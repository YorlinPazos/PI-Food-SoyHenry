const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');

class DietModel extends ModelCrud{
    constructor(model){
        super(model)
    }


}

  
const dietController = new DietModel(Diet);

module.exports = dietController;