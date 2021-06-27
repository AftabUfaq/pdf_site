const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const WaterMarkControler=require("../Controlers/WaterMarkControler")


router.get('/watermark', (req, res) => {
    res.render('watermark', { title: "Reverse PDF" })
})
const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};


const watermark_pdf= multer({storage:storage,fileFilter:compresspdf})
router.post('/watermark',watermark_pdf.single('file'),WaterMarkControler)


module.exports=router; 