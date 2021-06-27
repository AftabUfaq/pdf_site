const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const path = require('path');
const compress = require("../Controlers/compressController");

const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const compress_pdf= multer({storage:storage,fileFilter:compresspdf})

router.get('/compresspdf',(req,res) => {
    res.render('compresspdf',{title:"DOCX to PDF Converter - Free Media Tools"})
})

router.post('/compresspdf',compress_pdf.single('file'),compress)

module.exports=router;