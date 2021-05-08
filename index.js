const express = require("express");

const bodyParser = require("body-parser");

const fs = require("fs");
var multer = require('multer')
const path = require('path');

const pdfMerge = require('easy-pdf-merge');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));


var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var dir = "./uploads";
var subdir = "./uploads";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(subdir);
}

app.get('/mergepdf', (req, res) => {
    res.render('mergepdf', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
})

app.post('/mergepdf', multer({ storage: storage }).array('files', 100), (req, res) => {
    console.log(req.files);
    const files = []
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf"
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            files.push(file.path)
        });

        pdfMerge(files, outputFilePath, (err) => {
            if (err) res.send(err);
            res.download(outputFilePath, (err) => {
                if (err) {
                    files.forEach(file => {
                        console.log(file.split('\\')[1]);
                        fs.unlinkSync(file);
                    })
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync(outputFilePath)
                files.forEach(file => {
                    console.log(file.split('\\')[1]);
                    fs.unlinkSync(file);
                })
            })

        })
    }
})

app.get('/pdftopng',(req,res) => {
    res.render('pdf_to_png',{title:"DOCX to PDF Converter - Free Media Tools"})
})
const pdf_to_png = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const pdftopng= multer({storage:storage,fileFilter:pdf_to_png})
app.post('/pdftopng',pdftopng.single('file'),(req,res) => {
    if(req.file){
      console.log(req.file.path)
      const file = fs.readFileSync(req.file.path);
      outputFilePath = "output.png" 
      console.log(outputFilePath);
      var PDFImage = require("pdf-image").PDFImage;
      var pdfImage = new PDFImage(req.file.path,{
        graphicsMagick: true,
      });
      pdfImage.convertPage(0).then(function (imagePath) 
      {
        fs.existsSync(imagePath);
        res.download(imagePath,(err) => 
          {
            if(err)
            {
              console.log(err);
              res.send("some error taken place in downloading the file")
              return
            }

          })
      },function(err){
        console.log(err);
      });
    }
})

app.listen(PORT, () => {
    console.log(`The Server has started at port ${PORT}`);
})