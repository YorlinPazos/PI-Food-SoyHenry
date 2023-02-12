const recipeController = require('../controllers/recipes');
const {Router} = require('express');
const router = Router();

router.get('/:id', recipeController.getById);
router.get('/', recipeController.getAll);
router.put('/:id', recipeController.update);
router.delete('/:id', recipeController.delete);

module.exports = router;