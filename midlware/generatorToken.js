const jwt = require('jsonwebtoken');

const generatorToken=(user)=>{
    return jwt.sign({user},process.env.ACCESS_TOKEN,{expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN})
}

module.exports=generatorToken;

