const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const splitPdfControler=require("../Controlers/splitPdfControler")

router.get('/splitpdf', (req, res) => {
    res.render('splitpdf', { title: "Split PDF" })
})
router.post('/splitpdf', multer({ storage: storage }).fields([{
    name: 'files', maxCount: 1
  },{
    name: 'pagestart', maxCount: 1
  }, {
    name: 'pageend', maxCount: 1
  }]), splitPdfControler)

module.exports=router;