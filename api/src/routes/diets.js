const dietController = require('../controllers/diets');
const {Router} = require('express');
const router = Router();


router.get('/', dietController.getAll)

module.exports = router;