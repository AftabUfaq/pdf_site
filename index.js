const express = require("express");

const bodyParser = require("body-parser");

const fs = require("fs");
var multer = require('multer')
const path = require('path');

const pdfMerge = require('easy-pdf-merge');
const {exec} = require('child_process');
const scissors = require('scissors');
//const libre = require('libreoffice-convert');

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

const imageFilter = function (req, file, cb) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
};

var upload = multer({ storage: storage, fileFilter: imageFilter });

var dir = "public";
var subDirectory = "public/uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);

  fs.mkdirSync(subDirectory);
}

app.get('/mergepdf', (req, res) => {
    res.render('mergepdf', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
})

app.get('/imgtopdf', (req, res) => {
    res.render('imgtopdf', { title: "Convert JPG or PNG files to PDF" })
})

app.get('/pdftopng',(req,res) => {
    res.render('pdf_to_png',{title:"DOCX to PDF Converter - Free Media Tools"})
})

app.get('/rotatepdf', (req, res) => {
    res.render('rotatepdf', { title: "Rotate PDF" })
  })

app.get('/reversepdf', (req, res) => {
    res.render('reversepdf', { title: "Reverse PDF" })
  })

// app.get('/splitpdf', (req, res) => {
//     res.render('splitpdf', { title: "Split PDF" })
// })

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

app.post('/imgtopdf', upload.array('files', 100), (req, res) => {
    console.log(req.files);
    var list = ""
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf"
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            list+= `${file.path}`
            list+= ""
        });

        exec(`magick convert ${list} ${outputFilePath}`, (err,stdout,stderr) => {
            if (err){
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(outputFilePath)
        
                res.send("some error taken place in conversion process")
            }

            res.download(outputFilePath,(err) => {
                if (err){
                    fs.unlinkSync(req.file.path)
                    fs.unlinkSync(outputFilePath)
            
                    res.send("some error taken place in conversion process")
                }
                
                req.files.forEach((file) => {
                fs.unlinkSync(file.path);
                });

                fs.unlinkSync(outputFilePath);
            })
        })
        
    }
})

app.post('/rotatepdf', multer({ storage: storage }).array('files', 1), (req, res) => {
    console.log(req.files);
    const files = []
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            files.push(file.path)
        });
    //const file = fs.readFileSync(files[0])
    var rotated = scissors(files[0]).rotate(90)
    rotated.pdfStream()
   .pipe(fs.createWriteStream('out.pdf'))
   .on('finish', function(){
     console.log("We're done!");
        //outputFilePath = "./uploads/" + Date.now() + "out.pdf"
            res.download("out.pdf", (err) => {
                if (err) {
                    files.forEach(file => {
                        console.log(file.split('\\')[1]);
                        fs.unlinkSync(file);
                    })
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync("out.pdf")
                files.forEach(file => {
                    console.log(file.split('\\')[1]);
                    fs.unlinkSync(file);
            })

        })
   }).on('error',function(err){
     throw err;
   });

    
     }
})

app.post('/reversepdf', multer({ storage: storage }).array('files', 1), (req, res) => {
    console.log(req.files);
    const files = []
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            files.push(file.path)
        });
    //const file = fs.readFileSync(files[0])
    var reverse = scissors(files[0]).reverse()
    reverse.pdfStream()
   .pipe(fs.createWriteStream('out.pdf'))
   .on('finish', function(){
     console.log("We're done!");
        //outputFilePath = "./uploads/" + Date.now() + "out.pdf"
            res.download("out.pdf", (err) => {
                if (err) {
                    files.forEach(file => {
                        console.log(file.split('\\')[1]);
                        fs.unlinkSync(file);
                    })
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync("out.pdf")
                files.forEach(file => {
                    console.log(file.split('\\')[1]);
                    fs.unlinkSync(file);
            })

        })
   }).on('error',function(err){
     throw err;
   });

    
     }
})

// app.post('/splitpdf', multer({ storage: storage }).array('files', 1), (req, res) => {
//     console.log(req.files);
//     const files = []
//     if (req.files) {
//         req.files.forEach(file => {
//             console.log(file.path)
//             files.push(file.path)
//         });
//     //const file = fs.readFileSync(files[0])
//     var pg = scissors(files[0]).getNumPages()
//     var pdf1=scissors(files[0]).range(1,2)
//     var pdf2=scissors(files[0]).range(2,5)
//     pdf1.pdfStream()
//    .pipe(fs.createWriteStream('out1.pdf'))
//    .on('finish', function(){
//      console.log("We're done!");
//         //outputFilePath = "./uploads/" + Date.now() + "out.pdf"
//             res.download("out1.pdf", (err) => {
//                 if (err) {
//                     files.forEach(file => {
//                         console.log(file.split('\\')[1]);
//                         //fs.unlinkSync(file);
//                     })
//                     res.send("Some error takes place in downloading the file")

//                 }
//                 fs.unlinkSync("out1.pdf")
//                 files.forEach(file => {
//                     console.log(file.split('\\')[1]);
//                     //fs.unlinkSync(file);
//             })
//         })

    
//    }).on('error',function(err){
//      throw err;
//    });

//    pdf2.pdfStream()
//    .pipe(fs.createWriteStream('out2.pdf'))
//    .on('finish', function(){
//      console.log("We're done!");
//         //outputFilePath = "./uploads/" + Date.now() + "out.pdf"
//             res.download("out2.pdf", (err) => {
//                 if (err) {
//                     files.forEach(file => {
//                         console.log(file.split('\\')[1]);
//                         fs.unlinkSync(file);
//                     })
//                     res.send("Some error takes place in downloading the file")

//                 }
//                 fs.unlinkSync("out2.pdf")
//                 files.forEach(file => {
//                     console.log(file.split('\\')[1]);
//                     fs.unlinkSync(file);
//             })
//         })

    
//    }).on('error',function(err){
//      throw err;
//    });
//      }
// })



app.listen(PORT, () => {
    console.log(`The Server has started at port ${PORT}`);
})