const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const mergePdfController=require("../Controlers/mergePdfControler")

router.get('/mergepdf', (req, res) => {
    res.render('mergepdf', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
})

router.post('/mergepdf', multer({ storage: storage }).array('files', 100), mergePdfController)

module.exports=router;