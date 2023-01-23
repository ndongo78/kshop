const multer=require("multer")
const path=require('path')
module.exports=multer({
     storage: multer.diskStorage({}),
     fileFilter:(req,file,cb)=>{
       const extension=path.extname(file.originalname)
       if(extension !== '.jpg' && extension !=='.jpeg' && extension !=='.png'){
           cb (new Error("Votre image n'est pas prise en charge",false))
           return
       }
           cb(null,true)

     }
})