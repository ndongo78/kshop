'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Category,Commande,Favorite}) {
      // define association here
      this.belongsTo(Category,{foreignKey:"categoryId",as: "category",onDelete:"cascade"})
      this.hasMany(Commande,{foreignKey:"articleId",as: "articles",onDelete:"cascade"})
      this.hasMany(Favorite,{foreignKey:"articleId",as: "favorite",onDelete:"cascade"})
      
    }
  };
  Article.init({
    title:{
      type: DataTypes.STRING,
      allowNull:false
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull:false,
      isNumeric:true,
      validate:{
        isNumeric:(value)=>{
          if(isNaN(value)){
            throw new Error('price must be a number')
          }
        },
      
      }
    },
    image: {
      type:DataTypes.STRING,
      allowNull:false
     },
     avis:{
      type:DataTypes.INTEGER,
      allowNull:true
   },
   imgId:{
    type: DataTypes.STRING,
    allowNull:false
  },
  }, {
    sequelize,
    modelName: 'Article',
    tableName:'articles'
  });
  return Article;
};