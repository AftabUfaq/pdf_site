const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const ImageWaterMarkController=require("../Controlers/ImageWaterMarkController")


router.get('/imagewatermark', (req, res) => {
    res.render('imagewatermark', { title: "Reverse PDF" })
})


const imagewater = (req, file, cb) => {
    if (file.fieldname === "file") { // if uploading resume
      if (file.mimetype === 'application/pdf')
      { 
        cb(null, true);
      } 
      else
      {
        cb(null, false); 
      }
    } 
    else{
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
      { 
        cb(null, true);
      } 
      else
      {
        cb(null, false);
      }
    }
  };
const imagewatermark_pdf= multer({storage:storage,fileFilter:imagewater})
router.post('/imagewatermark',multer({storage:storage}).fields([{name: 'file'},{name: 'image'}]),ImageWaterMarkController)


module.exports=router; 