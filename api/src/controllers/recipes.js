const ModelCrud = require("./index");
const axios = require('axios');
const { Recipe, Diet } = require('../db');

class RecipeModel extends ModelCrud{
    constructor(model){
        super(model)
    }


}

const recipeController = new RecipeModel(Recipe);

module.exports = recipeController;