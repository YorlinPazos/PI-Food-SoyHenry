const { Router } = require('express');
const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const recipeRoutes = require("./recipes")
const dietRoutes = require("./diet")


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/recipes", recipeRoutes);
router.use("/diet", dietRoutes);


module.exports = router;
