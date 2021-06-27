const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
var multer = require('multer')
const path = require('path');

const pdfMerge = require('easy-pdf-merge');
const {exec} = require('child_process');
const puppeteer = require('puppeteer-core');
//const libre = require('libreoffice-convert');
const scissors = require('scissors');
const app = express();
var convertapi = require('convertapi')('yFG0IdFN6xoCsS9k');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const mergepdfRouter=require("./Routers/mergePdfRouter.js");
app.use("/",mergepdfRouter);

const pdftodoc=require("./Routers/pdftodoc.js");
app.use("/",pdftodoc);

const pdftoxlsx=require("./Routers/pdftoxlsx.js");
app.use("/",pdftoxlsx);

const pdftoppt=require("./Routers/pdftoppt.js");
app.use("/",pdftoppt);

const imgpdfRouter=require("./Routers/imageToPdfRouter.js");
app.use("/",imgpdfRouter);

const htmlToPdfRouter=require("./Routers/htmlToPdfRouter.js");
app.use("/",htmlToPdfRouter);

const unlockPdfRouter=require("./Routers/unlockPdfRouter.js");
app.use("/",unlockPdfRouter);

const lockPdfRouter=require("./Routers/lockPdfRouter.js");
app.use("/",lockPdfRouter);

const compress=require("./Routers/compress.js");
app.use("/",compress);

const officetopdf=require('./Routers/OfficetoPdfRouter.js');
app.use("/",officetopdf);

const pdftopng=require('./Routers/PdfToPngRouter.js');
app.use("/",pdftopng);

const PORT = process.env.PORT || 5000;

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


app.get('/edit', (req, res) => {
    res.render('edit', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
})

//const { PDFNet } = require('@pdftron/pdfnet-node');


app.get('/', (req, res) => {
    res.render('Home', { title: "Home" })
})


app.get('/pdftopng',(req,res) => {
    res.render('pdf_to_png',{title:"DOCX to PDF Converter - Free Media Tools"})
})
app.get('/watermark', (req, res) => {
    res.render('watermark', { title: "Reverse PDF" })
})
app.get('/imagewatermark', (req, res) => {
    res.render('imagewatermark', { title: "Reverse PDF" })
})
app.get('/rotatepdf', (req, res) => {
    res.render('rotatepdf', { title: "Rotate PDF" })
  })

app.get('/reversepdf', (req, res) => {
    res.render('reversepdf', { title: "Reverse PDF" })
  })

app.get('/splitpdf', (req, res) => {
    res.render('splitpdf', { title: "Split PDF" })
})

app.get('/officetopdf', (req, res) => {
    res.render('officetopdf', { title: "Convert Office to PDF" })
})

app.get('/pdf-to-pdfa', (req, res) => {
    res.render('pdfa', { title: "Remove password to PDF" })
})

app.get('/signpdf', (req, res) => {
    res.render('signpdf', { title: "Remove password to PDF" })
})

app.get('/pdf-to-pdfa', (req, res) => {
    convertapi.convert('pdfa', {
        File: 'public/uploads/int.pdf'
    }, 'pdf').then(function(result) {
        result.saveFiles('public/uploads/output_file.pdfa');
    });
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
const {Powerpoint}=require('pdf-officegen')
app.post('/pdftoppt', pdftopng.single('file'), (req, res) => {
    outputFilePath = "public/uploads/" + "output"+ Date.now() +".pdf"
    if (req.file)
    {
        console.log(req.file)
        files=[]
        files.push(req.file.path)
        const p = new Powerpoint();
        console.log(files)
        p.convertFromPdf(files, (err, result) => {
        })
    }
})
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


const compresspdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf")
    {
      return callback("This Extension is not supported");
    }
    callback(null, true);
};
const compress_pdf= multer({storage:storage,fileFilter:compresspdf})


const {PDFDocument,StandardFonts,degrees,rgb}=require('pdf-lib')
const watermark_pdf= multer({storage:storage,fileFilter:compresspdf})
app.post('/watermark',watermark_pdf.single('file'),(req,res) => {
    if(req.file)
    {
        console.log('hi');
        outputFilePath = "public/uploads/" + Date.now() + "output.pdf";
        run().catch(err => console.log(err));
        async function run() {
        const content = await PDFDocument.load(fs.readFileSync(req.file.path));
        const helveticaFont = await content.embedFont(StandardFonts.Helvetica);
        const pages = await content.getPages();
        for (const [i, page] of Object.entries(pages)) {
            page.drawText(req.body.text, {
                x: page.getWidth()/2-8*req.body.text.length,
                y: 5*page.getHeight()/(2*req.body.text.length+1),
                size: 50,
                color: rgb(0.95, 0.1, 0.1),
                rotate: degrees(55),
                opacity: 0.2
              });
        }
        fs.writeFileSync(outputFilePath, await content.save());
        console.log(outputFilePath)
        res.download(outputFilePath,(err) => 
        {
            if(err)
            {
                console.log(err);
                res.send("some error taken place in downloading the file")
                return
            }
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(outputFilePath);
        })
    
        }
    }
})


const imagewater = (req, file, cb) => {
    if (file.fieldname === "file") { // if uploading resume
      if (file.mimetype === 'application/pdf')
      { 
        cb(null, true);
      } 
      else
      {
        cb(null, false); 
      }
    } 
    else{
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
      { 
        cb(null, true);
      } 
      else
      {
        cb(null, false);
      }
    }
  };
const imagewatermark_pdf= multer({storage:storage,fileFilter:imagewater})
app.post('/imagewatermark',multer({storage:storage}).fields([{name: 'file'},{name: 'image'}]),(req,res) => {
    if(req.files)
    {
        console.log(req.files['file'][0]['path'])
        run().catch(err => console.log(err));
        async function run() {
        const pdfDoc = await PDFDocument.load(fs.readFileSync(req.files['file'][0]['path']));
        const img = await pdfDoc.embedPng(fs.readFileSync(req.files['image'][0]['path']));
        const pages = await pdfDoc.getPages();
        for (const [i, page] of Object.entries(pages)) 
        {
            page.drawImage(img, {
            x: page.getWidth()/3,
            y: page.getWidth()/3,
            width: page.getWidth()/3,
            height: page.getHeight()/3,
            opacity: 0.2 
            });
        }
        const pdfBytes = await pdfDoc.save();
        outputFilePath = "public/uploads/" + Date.now() + "output.pdf";
        fs.writeFileSync(outputFilePath, pdfBytes);
        res.download(outputFilePath,(err) => 
        {
            if(err)
            {
                console.log(err);
                res.send("some error taken place in downloading the file")
                return
            }
            fs.unlinkSync(req.files['file'][0]['path'])
            fs.unlinkSync(req.files['image'][0]['path'])
            fs.unlinkSync(outputFilePath)
        })
    }
        
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
    var reverse = scissors(files[0]).reverse()
    reverse.pdfStream()
   .pipe(fs.createWriteStream('out.pdf'))
   .on('finish', function(){
     console.log("We're done!");
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
app.post('/splitpdf', multer({ storage: storage }).fields([{
    name: 'files', maxCount: 1
  },{
    name: 'pagestart', maxCount: 1
  }, {
    name: 'pageend', maxCount: 1
  }]), (req, res) => {
     var srt=req.body.pagestart
     var end=req.body.pageend
     console.log(srt)
     console.log(end)
     console.log(req.files.files[0].path);
     const files = []
     if (req.files) 
     {
        files.push(req.files.files[0].path)
        var pg = scissors(files[0]).getNumPages()
        var pdf1=scissors(files[0]).range(srt,end)
        pdf1.pdfStream()
        .pipe(fs.createWriteStream('out1.pdf'))
        .on('finish', function(){
        console.log("We're done!");
        res.download("out1.pdf", (err) => {
                if (err) {
                    files.forEach(file => {
                        console.log(file.split('\\')[1]);
                    })
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync("out1.pdf")
                files.forEach(file => {
                    console.log(file.split('\\')[1]);
            })
        })
   }).on('error',function(err){
     throw err;
   });
    }
})
const compresspdf1 = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    callback(null, true);
};
const compress_pdf1= multer({storage:storage,fileFilter:compresspdf1})
app.post('/officetopdf', compress_pdf1.single('file'),(req,res) => {
    
    if(req.file)
    {
        console.log(req.file);
        inputFile=req.file.path;
        outputFilePath=inputFile.split(".")[0]+".pdf"
        console.log(inputFile);
        exec(
            `libreoffice --headless --convert-to pdf:"writer_pdf_Export:ReduceImageResolution=True;MaxImageResolution=75;Quality=50" ${inputFile} --outdir ~/pdf_site/public/uploads/`,
            (err, stdout, stderr) => {
              if (err) 
              {
                console.log(err);
                res.send("Some error in compressing");
                return;
              }
              res.download(outputFilePath,(err) => 
                {
                    if(err)
                    {
                        console.log(err);
                        res.send("some error taken place in downloading the file")
                        return
                    }
                    fs.unlinkSync(req.file.path)
                    fs.unlinkSync(outputFilePath)
                })
            }
          );
    }
})
app.listen(PORT, () => {
    console.log(`The Server has started at port ${PORT}`);
})
