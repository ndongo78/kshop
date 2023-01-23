const express=require('express');
const {MessageUser} =require('../models')
const authMildware =require("../midlware/auth")

const messageRouter=express.Router()

messageRouter.get('/',authMildware,async(req,res)=>{
    const {user}=req.user
  
    try {
         if(user.role==='admin'){
             const messages= await MessageUser.findAll()
             return res.json(messages)
         }else{
             return res.json({error:"Acces refuse"})
         }

    } catch (error) {
        return res.json(error)
    }

})
//create message
messageRouter.post('/create',authMildware,async(req,res)=>{
    const {user}=req.user
    const {message,objet}=req.body;
    try {
        const messageUser= await MessageUser.create({message,objet,userId:user.id})
        return res.json({message:"Nous avons bien recu votre message et prendrons contact avec vous dans les plus brefs delais"})
    } catch (error) {
        return res.json(error)
    }
})
//delete message
messageRouter.delete('/delete/:id',authMildware,async(req,res)=>{
    const {user}=req.user
    const {id}=req.params
    try {
         const isUser=await MessageUser.findOne({where:{id:id,userId:user.id}})
            if(isUser){
         await MessageUser.destroy({where:{id:id}})
           return res.json({message:"message supprimer"})
            }else{
                return res.json({error:"vous n'avez pas le droit d'effectuer cette action"})
            }
    } catch (error) {
        return res.json(error)
    }
} )

module.exports=messageRouter;