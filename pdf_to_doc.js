const express = require("express");
const bodyParser = require("body-parser");
const libre = require('libreoffice-convert');
const fs = require("fs");
const path = require("path");
var outputFilePath;
const multer = require("multer");
const app = express();
const request= require("request");
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'./public/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + Date.now() + path.extname(file.originalname)
    );
  },
});
app.get('/pdftodoc',(req,res) => {
  res.render('pdf_to_doc',{title:"DOCX to PDF Converter - Free Media Tools"})
})
const pdf_to_doc = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== ".pdf")
  {
    return callback("This Extension is not supported");
  }
  callback(null, true);
};
const pdftodoc= multer({storage:storage,fileFilter:pdf_to_doc})
app.post('/pdftodoc',pdftodoc.single('file'),(req,res) => {
  if(req.file){
    console.log(req.file.path)
    const file = fs.readFileSync(req.file.path);
    outputFilePath = Date.now() + "output.doc" 
    console.log(outputFilePath);
    libre.convert(file,".doc",undefined,(err,done) => 
    {
      if(err)
      {
        //fs.unlinkSync(req.file.path)
        //fs.unlinkSync(outputFilePath)
        console.log(err);
        res.send("some error taken place in conversion process")
        return
      }
      fs.writeFileSync(outputFilePath, done);
      res.download(outputFilePath,(err) => 
      {
        if(err)
        {
          fs.unlinkSync(req.file.path)
          fs.unlinkSync(outputFilePath)
          res.send("some error taken place in downloading the file")
          return
        }
        fs.unlinkSync(req.file.path)
        fs.unlinkSync(outputFilePath)
      })
    })
  }
})

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});