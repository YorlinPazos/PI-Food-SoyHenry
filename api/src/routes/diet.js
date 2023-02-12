const dietController = require('../controllers/diet');
const {Router} = require('express');
const router = Router();


router.get('/', dietController.getAll)

module.exports = router;