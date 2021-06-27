const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const path = require('path');
const pdftoxlsxController = require("../Controlers/pdftoxlsxController");

const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const compress_pdf= multer({storage:storage,fileFilter:compresspdf})

router.get('/pdftoxlsx', (req, res) => {
    res.render('pdftoxlsx', { title: "Convert Office to PDF" })
})

router.post('/pdftoxlsx',compress_pdf.single('file'),pdftoxlsxController)

module.exports=router;