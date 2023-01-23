const express=require('express')
const jwt = require('jsonwebtoken');
const authMildware = require('../midlware/auth');
const generatorToken=require('../midlware/generatorToken')
const bcrypt=require('bcryptjs')
const {User,ResetPassword}=require('../models')
const nodemailer=require('nodemailer')
const {google}= require('googleapis');

require("dotenv").config();

const userRouter=express.Router()

//get all user
userRouter.get('/',authMildware,async (req,res)=>{
    const {user}=req.user
    try {
        if(user.role==='admin'){
            const users=await User.findAll()
            return res.json(users)
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
})
//get user by id
userRouter.get('/user/:id',authMildware,async (req,res)=>{
    const {user}=req.user
    const {id}=req.params
    try {
        if(user.role==='admin'){
            const user=await User.findOne({where:{id}})
            return res.json(user)
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
}
)
//update user by admin
userRouter.put('/update/:id',authMildware,async (req,res)=>{
    const {user}=req.user
    const id=req.params
    try {
        if(user.role==='admin'){
            const user=await User.findOne({where: id})
            if(!user){
                return res.json({error:"user not found"})
            }
            await user.update(req.body); 
            res.status(201).json(user)

        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
}
)
//delete user by admin
userRouter.delete('/delete/:id',authMildware,async (req,res)=>{
    const {user}=req.user
    const id=req.params
    try {
        if(user.role==='admin'){
            const user=await User.findOne({where: id})
            await user.destroy()
            return res.json({message:"User delete"})
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
}
)

//register user
userRouter.post('/register',async(req,res)=>{
    const {
        nom,
        prenom,
        naissance,
        email,
        password,
        telephone,
        addresse,
        pays,
     }=req.body;
   try {
    try {
         
            //const hash= bcrypt.hash(password,10)
            const hash=bcrypt.hashSync(password,10)
             const user=await User.create({
                             nom,
                           prenom,
                           naissance,
                           email,
                           password:hash,
                           telephone,
                           addresse,
                           pays
             })
                if(user)return res.status(201).json({message:"vous etes bien inscrit, veuillez vous connecter en utilisant votre email et mot de passe"})
             
      
    } catch (error) {
        
        return res.status(400).json(error)
    }

   } catch (error) {
       
   }
})
//user login 
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({ where:{ email:email}});
        if(!user){
            return res.status(400).send('Identifiant ou mot de passe incorrect');
        }
        const isValid=await bcrypt.compare(password,user.password);
        if(!isValid){
            return res.status(400).send('Identifiant ou mot de passe incorrect');
        }
       
        const token=generatorToken(user);
        // //const refreshTok=refreshToken(user)

        return res.status(200).json({token});
    } catch (error) {
        return res.status(401).json({errors:error});
    }
})
//get user details
userRouter.get("/me",authMildware,async(req,res)=>{

    try {
        const user=await User.findOne({where:{id:req.user.user.id},includes:'commande'});
        return res.status(200).json(user)
    } catch (error) {
        return res.status(401).json(error)
    }
}
)
//update user

userRouter.put("/:id",authMildware,async(req,res)=>{
   
    try {
        const user= await User.findOne({where: req.user.user.id})
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        await user.update(req.body); 
        res.status(200).json(user)
        
    } catch (error) {
        return res.json(error)
    }
})


userRouter.patch('/resetPassword',async(req,res)=>{
     const {email}=req.body
   try {
       const user=await User.findOne({where: {email}})
       if(!user){
           return res.json({error:"Aucun compte n'est associé a cet email"})
       }
       const authUser= new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
         authUser.setCredentials({refresh_token: process.env.REFRESH_TOKEN})
         const accesToken= await authUser.getAccessToken() 
    //    host: 'smtp.sendgrid.net',   user:"apikey", pass:"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"
    //         port: 465,
    //         secure: true,
       const token=jwt.sign({id:user.id},process.env.RESET_KEY,{expiresIn: "30m"})
       const transporter=nodemailer.createTransport({
            service: 'gmail',
           auth:{
               type:'OAuth2',
               user:"ndongod.shop@gmail.com",
               clientId:process.env.CLIENT_ID,
               clientSecret:process.env.CLIENT_SECRET,
               refreshToken: process.env.REFRESH_TOKEN,
               accessToken: accesToken
           }
       })
       const mailOptions={
           from:"noreply@hello.com",
           to: user.email,
           subject:"Réinistalisation mot de pass",
           html:`
             <div style="display:'block'; margin:'auto' ">
             <h6>Cliquez le lien ci-dessous pour reinistaliser votre mot de pass</h6>
              <a href='${process.env.URL}/${token}/${user.id}'>lien pour renistalize password</a>
              </div>
           `
       }
            transporter.sendMail(mailOptions,(error,result)=>{
           if(error){
            return res.json(error)
           }else{
               return res.json({success:'Vous allez recevoir un email pour réinitialiser votre  mot de passe'})
           }
       })
       
   } catch (error) {
       return res.json(error)
   }
})

userRouter.put('/changerPassword/:id',async(req,res)=>{
    const id=req.params
   
    const {password}=req.body
    try {
        const user=await User.findOne({where: id})
        const hash=bcrypt.hashSync(password,10)
        user.nom=user.nom,
        user.prenom=user.prenom,
        user.email=user.email,
        user.password=hash,
        user.telephone=user.telephone,
        user.addresse=user.addresse,
        user.pays=user.pays,
       await user.save(); 
       res.json({success:'Votre mot de pass est changer avec success'})


    } catch (error) {
        return res.json(error)
    }
})






module.exports=userRouter;