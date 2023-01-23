'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Commande, MessageUser,Favorite}) {
      // define association here
      this.hasMany(Commande,{foreignKey:'userId',as:'commande',onDelete:'cascade'})
      this.hasMany(MessageUser,{foreignKey:'userId',as:'messageUser',onDelete:'cascade'})
      this.hasMany(Favorite,{foreignKey:'userId',as:'favorite',onDelete:'cascade'})
    }
  };
  User.init({
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4
    },
    nom:{ 
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:(value)=>{
        if(!value){
          throw new Error("Le nom est obligatoire")
        }
      },
    }
    },
    prenom:{
     type:DataTypes.STRING,
     allowNull:false,
      validate:{
        notNull:(value)=>{
          if(!value){
            throw new Error("Le prenom est obligatoire")
          }
        }
      }
     },
    email: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      isEmail:true,
     isUnique: async(value,next)=>{
      const user=await User.findOne({where:{email:value}})
      
      if(!value) return next("veillez entrer votre email")
      if(user){
        return next("Cet email existe deja")
      }
      next()
     }
    }
    },
    password:{
     type: DataTypes.STRING,
     allowNull:false,
      validate:{
        notNull:(value)=>{
          if(!value){
            throw new Error("Le mot de pass est obligatoire")
          }
        },
        isValidPassword: (value)=>{
          if(value.length<8){
            throw new Error("Le mot de pass doit avoir au moins 8 caracteres")
          }
        }


      }
     },
    telephone: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:(value)=>{
        if(!value){
          throw new Error("Le numero de telephone est obligatoire")
        }
      },
     
    }
    },
    addresse:{
    type: DataTypes.STRING, 
    allowNull:false
     },
     role:{
       type:DataTypes.STRING,
       allowNull:true,
       defaultValue:'client'
     },
     pays:{
       type:DataTypes.STRING,
       allowNull:false
     }

  }, {
    sequelize,
    modelName: 'User',
    tableName:'users'
  });
  return User;
};