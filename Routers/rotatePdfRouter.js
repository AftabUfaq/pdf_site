const express=require("express");
const router=express.Router();
var multer = require('multer')
const storage=require("../Multer/Multer")
const rotatePdfController=require("../Controlers/rotatePdfControler")

// router.get('/mergepdf', (req, res) => {
//     res.render('mergepdf', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
// })

router.get('/rotatepdf', (req, res) => {
    res.render('rotatepdf', { title: "Rotate PDF" })
  })

// router.post('/mergepdf', multer({ storage: storage }).array('files', 100), mergePdfController)
router.post('/rotatepdf', multer({ storage: storage }).array('files', 1), rotatePdfController)

module.exports=router;