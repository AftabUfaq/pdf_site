const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const path = require('path');
const pdftopptController = require("../Controlers/pdftopptContoller");

const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const compress_pdf= multer({storage:storage,fileFilter:compresspdf})

router.get('/pptfrompdf', (req, res) => {
    res.render('pdftoppt', { title: "Convert Office to PDF" })
})

router.post('/pptfrompdf',compress_pdf.single('file'),pdftopptController)

module.exports=router;