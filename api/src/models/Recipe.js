const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
       },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthScore:{
      type: DataTypes.INTEGER
    },
    steps: {
      type: DataTypes.STRING
    },
    created:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {timestamps: false}
  );
};


//probando el git push