'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'cascade'
      })
    }
  };
  MessageUser.init({
    objet: {
     type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:(value)=>{
          if(!value) throw new Error("Objet manquant")
        },
        notEmpty:true
      }
    },
    message: {
     type: DataTypes.STRING,
     allowNull: false,
      validate: {
        notNull:(value)=>{
          if(!value) throw new Error("Message manquant")
        },
        notEmpty:true
      }
    },
    userId: {
     type: DataTypes.INTEGER,
      allowNull : false,
    }
  }, {
    sequelize,
    modelName: 'MessageUser',
    tableName: 'messageUsers',
  });
  return MessageUser;
};