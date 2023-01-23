'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Article,User}) {
      // define association here
      this.belongsTo(Article,{foreignKey:'articleId',as:'articles',onDelete:'cascade' })
      this.belongsTo(User,{foreignKey:'userId',as:'user',onDelete:'cascade'})
    }
  };
  Commande.init({
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    articleId:{
     type: DataTypes.INTEGER,
     allowNull:false
    },
    status:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:'attente'
    }
  }, {
    sequelize,
    modelName: 'Commande',
    tableName:'commandes'
  });
  return Commande;
};