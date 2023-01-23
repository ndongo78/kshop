const express=require('express');
const cors=require('cors');
const PORT=5000;
const {sequelize}=require("./models");
const db=require('./models');
const path=require('path')
const userRouter = require('./route/UserRouter');
const categorieRouter = require('./route/CategorieRouter');
const articleRouter = require('./route/ArticleRouter');
const commandeRouter = require('./route/CommandeRouter');
const messageRouter = require('./route/MessageRouter');
const favoriteRouter = require('./route/FavoriteRouter');
require("dotenv").config();


const app=express()
app.use(cors())
app.use(express.json())

app.use('/users',userRouter);
app.use('/category',categorieRouter)
app.use('/article',articleRouter)
app.use('/commande',commandeRouter)
app.use('/message',messageRouter)
app.use('/favorite',favoriteRouter)
app.use("/images",express.static(path.join(__dirname,"images")))

db.sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT || 5000,(req,res)=>{
    console.log(`Le serve tourne sur le port ${PORT}`)
})
})
.catch(err=>console.log(err))


  

// app.listen(PORT,()=>{
//     console.log("Server is running on port 3001")
//      sequelize.authenticate()
//     console.log("Database is connected")
// })

