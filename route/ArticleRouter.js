const express =require('express');
const upload = require('../midlware/multer');
const cloudinary=require('../midlware/cloudinary')
const {Article} =require('../models')
const {Op}=require('sequelize')
const authMildware=require('../midlware/auth')

const articleRouter=express.Router()


//get all articles
articleRouter.get('/',async(req,res)=>{
    
    try {
        const articles= await Article.findAll({include:'category'});
        return res.json(articles)
    } catch (error) {
        return res.json(error)
    }
})
//get new add
articleRouter.get('/nouveau',async(req,res)=>{
    try {
        const articles= await Article.findAll({ limit: 10 });
        return res.json(articles)
    } catch (error) {
        return res.json(error)
    }
})
//get popular item
articleRouter.get('/popular',async(req,res)=>{
    try {
        const articles= await Article.findAll({ order: [ [ 'createdAt', 'DESC' ]],limit:10 });
        return res.json(articles)
    } catch (error) {
        return res.json(error)
    }
})

//best noted 
articleRouter.get('/noted',async(req,res)=>{
    try {
        const articles= await Article.findAll({ where:{avis:{[Op.gt]:4}} });
        return res.json(articles)
    } catch (error) {
        return res.json(error)
    }
})

articleRouter.get('/carousel',async(req,res)=>{
    try {
        const articles= await Article.findAll({ order: [ [ 'createdAt', 'DESC' ]],limit:5 });
        return res.json(articles)
    } catch (error) {
        return res.json(error)
    }
})

// `${req.protocol}://${req.get("host")}/images/${req.file.filename}`

//post new article
articleRouter.post('/create',upload.single('image'),authMildware,async(req,res)=>{
    const {title,description,price,image,categoryId,avis}=req.body;
    const {user}=req.user
    
     try {
         if(user.role ==='admin'){
           const result= await cloudinary.uploader.upload(req.file.path)

         const article=await Article.create({
             categoryId,
             title,
             description,
             price,
             avis,
             image: result.secure_url,
             imgId: result.public_id
         })
         return res.json(article)
            }else{
                return res.json({error:"Acces refuse"})
            }
     } catch (error) {
         return res.json(error)
     }
})
//delete
articleRouter.delete('/delete/:id',authMildware,async(req,res)=>{
    const id= req.params;
    const {user}=req.user
    try {
        if(user.role ==='admin'){
        const article=await Article.findOne({where: id})
         await cloudinary.uploader.destroy(article.imgId)
        await Article.destroy({where: id})
        return res.json({message:'Article sumprimé avec success'})
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
    
})
//delete
articleRouter.put('/update/:id',authMildware,async(req,res)=>{
    const id= req.params;
    const {title,description,price,image,categoryId,avis}=req.body;
    const {user}=req.user
    try {
        if(user.role ==='admin'){
         const article=await Article.findOne({where: id})
        article.categoryId=categoryId
        article.title=title
        article.description=description;
        article.price=price;
        article.image=image;
        article.avis=avis;
       await article.save();
        return res.json(article)
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
    
})
//get detail article
articleRouter.get('/:id',async(req,res)=>{
    const id=req.params
    try {
        const article=await Article.findOne({where: id})
        return res.json(article)
    } catch (error) {
        return res.json(error)
    }
})

articleRouter.post('/payement',async(req,res)=>{
    console.log(req.body)
})
module.exports=articleRouter;