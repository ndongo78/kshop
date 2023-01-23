'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull:false
      },
      categoryId:{
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.STRING,
        allowNull:false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      image: {
        type: Sequelize.STRING,
        allowNull:false
      },
      avis:{
         type:Sequelize.INTEGER,
         allowNull:true
      },
      imgId:{
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('articles');
  }
};