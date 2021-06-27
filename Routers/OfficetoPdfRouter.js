const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const path = require('path');
const officetopdfController = require("../Controlers/OfficeToPdfController")

const officetopdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".doc" && ext != '.docx' && ext != '.xlsx' && ext != '.pptx')
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const office_to_pdf = multer({storage:storage,fileFilter:officetopdf})

router.get('/officetopdf', (req, res) => {
    res.render('officetopdf', { title: "Convert Office to PDF" })
})

router.post('/officetopdf',office_to_pdf.single('file'),officetopdfController)

module.exports=router;