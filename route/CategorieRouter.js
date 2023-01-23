const express =require('express');
const {Category} =require('../models')
const authMildware=require('../midlware/auth')

const categorieRouter=express.Router()

//get all category
categorieRouter.get('/',async(req,res)=>{
    try {
        const categories= await Category.findAll({
            includes:'articles'
        })
        return res.json(categories)
    } catch (error) {
        return res.json({errors:error})
    }
})
//get category by id
categorieRouter.get('/:id',async(req,res)=>{
    const {id}=req.params
    try {
        const category= await Category.findOne({where:{id}})
        return res.json(category)
    } catch (error) {
        return res.json({errors:error})
    }
}
)
//create category
categorieRouter.post('/create',authMildware,async(req,res)=>{
        const {name}=req.body;
        const {user}=req.user
        try {
            if(user.role==='admin'){
            const categorie= await Category.create({name})
            return res.json({message:"Categorie creer avec success"})
            }else{
                return res.json({error:"Acces refuse"})
            }
        } catch (error) {
            return res.json(error)
        }
})
//update category
categorieRouter.put('/update/:id',authMildware,async(req,res)=>{
    const {id}=req.params;
    const {name}=req.body;
    const {user}=req.user
    try {
        if(user.role==='admin'){
        const categorie= await Category.findOne({where: {id}})
        categorie.name=name
        await categorie.save()
        return res.json({message:"Categorie modifié avec success"})
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
} )
//delete category
categorieRouter.delete('/delete/:id',authMildware,async(req,res)=>{
    const {id}=req.params;
    const {user}=req.user
    try {
        if(user.role==='admin'){
        const categorie= await Category.findOne({where: {id}})
        await categorie.destroy()
        return res.json({message:"Categorie supprimé avec success"})
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
    
} )


module.exports=categorieRouter;