const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/imgpdfMulter")
const PdfController=require("../Controlers/imageToPdfController")

router.get('/imgtopdf', (req, res) => {
    res.render('imgtopdf', { title: "Convert JPG or PNG files to PDF" })
})

router.post('/imgtopdf', storage.array('files', 100), PdfController)

module.exports=router; 