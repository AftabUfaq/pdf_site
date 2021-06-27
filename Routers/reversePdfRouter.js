const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const reversePdfController=require("../Controlers/reversePdfControler")

router.get('/reversepdf', (req, res) => {
    res.render('reversepdf', { title: "Reverse PDF" })
  })

router.post('/reversepdf', multer({ storage: storage }).array('files', 1), reversePdfController)

module.exports=router;