const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const PdfController=require("../Controlers/PdfToPngController")

router.get('/pdftopng', (req, res) => {
    res.render('pdftopng', { title: "Convert PDF files to PNG" })
})

router.post('/imgtopdf',  multer({ storage: storage }).array('files', 100), PdfController)

module.exports=router; 