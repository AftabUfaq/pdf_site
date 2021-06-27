const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const PdfController=require("../Controlers/PdfToPngController")

router.get('/pdftopng', (req, res) => {
    res.render('pdf_to_png', { title: "Convert PDF files to PNG" })
})

router.post('/pdftopng',  multer({ storage: storage }).single('file'), PdfController)

module.exports=router; 