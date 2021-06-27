const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const path = require('path');
const pdftodocController = require("../Controlers/pdftodocController")

const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const compress_pdf= multer({storage:storage,fileFilter:compresspdf})

router.get('/pdftodoc', (req, res) => {
    res.render('pdftodoc', { title: "Convert Office to PDF" })
})

router.post('/pdftodoc',compress_pdf.single('file'),pdftodocController)

module.exports=router;