const express = require('express');
const {Favorite} = require('../models');
const authMildware = require('../midlware/auth');




const favoriteRouter = express.Router();

//get all favorite
favoriteRouter.get('/me',authMildware, async (req, res) => {
          const {user}=req.user
    try {
        if(user){
        const favorites = await Favorite.findAll({
            where: {
                userId: user.id
            },
            include: "articles"
        });
        return res.json(favorites)
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
}   
)
//create favorite
favoriteRouter.post('/create',authMildware, async (req, res) => {
    const {user}=req.user
    const {articleId}=req.body
    try {
        if(user){
            const exist = await Favorite.findOne({
                where: {
                    userId: user.id,
                    articleId:articleId
                }
            });
            if(exist){
                return res.json({error:"Article already exist"})
            }
            const favorite = await Favorite.create({
                userId: user.id,
                articleId:articleId
            });
            return res.json(favorite)
        }
      

    } catch (error) {
        return res.status(500).json(error)
    }
    
}
)
//delete favorite
favoriteRouter.delete('/delete/:id',authMildware, async (req, res) => {
    const {user}=req.user
    const {id}=req.params
    try {
        if(user){
        const favorite = await Favorite.destroy({
            where: {
                userId: user.id,
                id: id
            }
        });
        return res.json({message:"L'article a été supprimé de vos favoris"})
        }else{
            return res.json({error:"Acces refuse"})
        }
    } catch (error) {
        return res.json(error)
    }
}
)

module.exports = favoriteRouter;