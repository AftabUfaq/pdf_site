const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const PdfController=require("../Controlers/imageToPdfController")

router.get('/htmltopdf', (req, res) => {
    res.render('htmltopdf', { title: "Convert HTML to PDF" })
})

router.post('/htmltopdf',multer({ storage: storage }).array('address', 1),PdfController)

module.exports=router;