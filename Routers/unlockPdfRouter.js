const express=require("express");
const router=express.Router();
var multer = require('multer')
const PdfController=require("../Controlers/unlockPdfController")

router.get('/unlockpdf', (req, res) => {
    res.render('unlockpdf', { title: "Remove password to PDF" })
})

router.post('/unlockpdf', multer({ storage: storage }).array('files', 1), PdfController)

module.exports=router; 