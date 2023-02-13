const recipeController = require('../controllers/recipes');
const {Router} = require('express');
const router = Router();



// CONEXION A CONTROLLERS y mi a mi Model Crud


router.get('/:id', recipeController.getById);
router.get('/', recipeController.getAll);
router.put('/:id', recipeController.update);
router.delete('/:id', recipeController.delete);
router.post('/', recipeController.post)

module.exports = router;