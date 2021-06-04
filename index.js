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

var upload = multer({ storage: storage, fileFilter: imageFilter });

app.get('/mergepdf', (req, res) => {
    res.render('mergepdf', { title: "Concatenate or Merge Multiple PDF Files Online - Free Media Tools" })
})

const { PDFNet } = require('@pdftron/pdfnet-node');


app.get('/', (req, res) => {
    res.render('Home', { title: "Home" })
})



app.get('/imgtopdf', (req, res) => {
    res.render('imgtopdf', { title: "Convert JPG or PNG files to PDF" })
})

app.get('/pdftopng',(req,res) => {
    res.render('pdf_to_png',{title:"DOCX to PDF Converter - Free Media Tools"})
})

app.get('/htmltopdf', (req, res) => {
    res.render('htmltopdf', { title: "Convert HTML to PDF" })
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
app.get('/compresspdf',(req,res) => {
    res.render('compresspdf',{title:"DOCX to PDF Converter - Free Media Tools"})
})
app.get('/officetopdf', (req, res) => {
    res.render('officetopdf', { title: "Convert Office to PDF" })
})
app.get('/protectpdf', (req, res) => {
    res.render('protectpdf', { title: "Convert Office to PDF" })
})
app.get('/pdftodoc', (req, res) => {
    res.render('pdftoword', { title: "Convert Office to PDF" })
})
app.get('/pdftoxlsx', (req, res) => {
    res.render('pdftoexcel', { title: "Convert Office to PDF" })
})
app.get('/unlockpdf', (req, res) => {
    res.render('unlockpdf', { title: "Remove password to PDF" })
})

app.get('/pdf-to-pdfa', (req, res) => {
    convertapi.convert('pdfa', {
        File: 'public/uploads/int.pdf'
    }, 'pdf').then(function(result) {
        result.saveFiles('public/uploads/output_file.pdfa');
    });
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

app.post('/unlockpdf', multer({ storage: storage }).array('files', 1), (req, res) => {
    console.log(req.files[0].path);
    outputFilePath = "public/uploads/" + "output"+ Date.now() +".pdf"
    const rpp = require('remove-pdf-password');
    if (req.files) {
        console.log(req.files[0].path)

        var pass = req.body.text;
        const params = {
            inputFilePath: req.files[0].path,
            password: pass,
            outputFilePath: outputFilePath,
        }
        rpp(params)
        console.log(outputFilePath)
            const fs = require("fs");
            setTimeout(() => {
                
                    if (fs.existsSync(outputFilePath)) 
                    {
                        console.log("hbhjbh")
                        res.download(outputFilePath,(err) => 
                        {
                            if(err)
                            {
                                console.log(err);
                                res.send("some error taken place in downloading the file")
                                return
                            }
                            //fs.unlinkSync(req.file.path)
                            fs.unlinkSync(outputFilePath)
                    })
                }
                
            }, 1000)
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
            list+=" "
        });

        exec(`magick convert ${list} ${outputFilePath}`, (err,stdout,stderr) => {
            if (err){
                //fs.unlinkSync(req.file.path)
                req.files.forEach((file) => {
                    //fs.unlinkSync(file.path);
                });
                //fs.unlinkSync(outputFilePath)
                console.log(err)
        
                res.send("some error taken place in conversion process")
                return
            }

            res.download(outputFilePath,(err) => {
                if (err){
                    //fs.unlinkSync(req.file.path)
                    req.files.forEach((file) => {
                        //fs.unlinkSync(file.path);
                    });
                    //fs.unlinkSync(outputFilePath)
                    console.log(err)
                    res.send("some error taken place in conversion process")
                    return
                }
                
                req.files.forEach((file) => {
                //fs.unlinkSync(file.path);
                });

                //fs.unlinkSync(outputFilePath);
            })
        })
        
    }
})

app.post('/htmltopdf',multer({ storage: storage }).array('address', 1),(req,res)=>{
    console.log(req.body.address);
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf";
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`${req.body.address}`, {
          waitUntil: 'networkidle2',
        });
        await page.pdf({ path: `${outputFilePath}`, format: 'a4' });
        res.download(outputFilePath,(err) => {
            if (err){
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(outputFilePath)
                console.log(err)
                res.send("some error taken place in conversion process")
            }
            
            fs.unlinkSync(req.file.path);

            fs.unlinkSync(outputFilePath);
        })
        await browser.close();
    })();
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
app.post('/pdftoxlsx',compress_pdf.single('file'),(req,res) => {
    if(req.file)
    {
        inputFile=req.file.path;
        outputFilePath = "public/uploads/" + Date.now() + "output.xlsx";
        const reader = require('xlsx')
        var pdf2table = require('pdf2table');
        var fs = require('fs');
        console.log(inputFile);
        fs.readFile(inputFile, function (err, buffer) {
        if (err) 
            return console.log(err);
        pdf2table.parse(buffer, function (err, rows, rowsdebug) 
        {
            if(err) 
                return console.log(err);
            console.log(rows);
            var excel = require('excel4node');
            var data='';
            var workbook = new excel.Workbook();
            var worksheet = workbook.addWorksheet('Sheet 1');
            var style = workbook.createStyle({
                font: {
                  color: '#FF0800',
                  size: 12
                },
                numberFormat: '$#,##0.00; ($#,##0.00); -'
              });
            var writeStream = fs.createWriteStream(outputFilePath);
            writeStream.close();
            for (var i = 0; i < rows.length; i++) 
            {
                for (var j=0; j<rows[i].length;j++)
                {
                    worksheet.cell(i+1,j+1).string(rows[i][j]).style(style);
                }
            }
            workbook.write(outputFilePath);
            console.log(data);
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
            
        });
        });
    }
})
app.post('/compresspdf',compress_pdf.single('file'),(req,res) => {
    if(req.file)
    {
        inputFile=req.file.path;
        outputFilePath = "public/uploads/" + Date.now() + "output.pdf";
        exec(
            `gs \ -q -dNOPAUSE -dBATCH -dSAFER \ -sDEVICE=pdfwrite \ -dCompatibilityLevel=1.3 \ -dPDFSETTINGS=/ebook \ -dEmbedAllFonts=true \ -dSubsetFonts=true \ -dAutoRotatePages=/None \ -dColorImageDownsampleType=/Bicubic \ -dColorImageResolution=72 \ -dGrayImageDownsampleType=/Bicubic \ -dGrayImageResolution=72 \ -dMonoImageDownsampleType=/Subsample \ -dMonoImageResolution=72 \ -sOutputFile=${outputFilePath} \ ${inputFile}`,
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
const protect_pdf= multer({storage:storage,fileFilter:compresspdf})
app.post('/protectpdf',protect_pdf.single('file'),(req,res) => {
    if(req.file)
    {
        inputFile=req.file.path;
        outputFilePath = "public/uploads/" + Date.now() + "output.pdf";
        exec(
            `qpdf --encrypt ${req.body.text} ${req.body.text} 40 -- ${inputFile} ${outputFilePath}`,
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
app.post('/officetopdf', multer({ storage: storage }).array('file', 1), (req, res) => {
    
    console.log(req.files[0].path);
    
    const files = []
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf"

    const convertToPDF = async () => {
        const pdfDoc = await PDFNet.PDFDoc.create()
        await pdfDoc.initSecurityHandler()
        await PDFNet.Convert.toPdf(pdfDoc, req.files[0].path)
        pdfDoc.save(outputFilePath, PDFNet.SDFDoc.SaveOptions.e_linearized)
        
         
    }

    
    PDFNet.runWithCleanup(convertToPDF).then(()=>{
        res.download(outputFilePath,(err) => {
            if (err){
                fs.unlinkSync(req.files[0].path)
                fs.unlinkSync(outputFilePath)
                console.log(err)
                res.send("some error taken place in conversion process")
            }
            
            fs.unlinkSync(req.file[0].path);

            fs.unlinkSync(outputFilePath);
        })
    }).catch(err => {
        res.statusCode = 500
        console.log(err)
    })
})
app.listen(PORT, () => {
    console.log(`The Server has started at port ${PORT}`);
})