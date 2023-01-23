'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid:{
        type:Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
      },
      nom: {
        type: Sequelize.STRING,
        allowNull:false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.STRING,
        allowNull:false
      },
      telephone: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      addresse: {
        type: Sequelize.STRING,
        allowNull:false
      },
      role:{
        type:Sequelize.STRING,
        allowNull:true,
        defaultValue:null
      },
      pays:{
        type:Sequelize.STRING,
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
    await queryInterface.dropTable('users');
  }
};