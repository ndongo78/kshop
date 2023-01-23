'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Article}) {
      // define association here
      this.hasMany(Article,{foreignKey:'categoryId',as:'articles',onDelete:'cascade' })
    }
  };
  Category.init({
    name:{
     type: DataTypes.STRING,
     allowNull:false,
     unique:true,
     validate:{
        notNull:(value)=>{
          if(!value){
            throw new Error('category name is required')
          }
        }
    }
    },
    
  }, {
    sequelize,
    modelName: 'Category',
    tableName:'categories'
  });
  return Category;
};