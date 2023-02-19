const nameController = require('../controllers/name');
const {Router} = require('express');
const router = Router();



//   Get by name

router.get('/', nameController.getAll);

module.exports = router;