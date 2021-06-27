const express=require("express");
const router=express.Router();
const storage=require("../Multer/lockPdfMulter")
const PdfController=require("../Controlers/lockPdfController")

router.get('/protectpdf', (req, res) => {
    res.render('protectpdf', { title: "Convert Office to PDF" })
})

router.post('/protectpdf',storage.single('file'), PdfController)

module.exports=router; 