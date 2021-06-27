const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
var multer = require('multer')
const path = require('path');
const {exec} = require('child_process');
const scissors = require('scissors');
const app = express();
const storage=require("./Multer/lockPdfMulter")
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

const reversepdfRouter=require("./Routers/reversePdfRouter.js");
app.use("/",reversepdfRouter);

const rotatepdfRouter=require("./Routers/rotatePdfRouter.js");
app.use("/",rotatepdfRouter);

const splitpdfRouter=require("./Routers/splitPdfRouter.js");
app.use("/",splitpdfRouter);

const waterMarkRouter=require("./Routers/waterMarkRouter.js");
app.use("/",waterMarkRouter);

const ImageWaterMarkRouter=require("./Routers/imageWaterMarkRouter.js");
app.use("/",ImageWaterMarkRouter);


const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"))


// Basic get requests

app.get('/', (req, res) => {
    res.render('Home', { title: "Home" })
})

app.get('/pdf-to-pdfa', (req, res) => {
    res.render('pdfa', { title: "Remove password to PDF" })
})
app.post('/pdf-to-pdfa', multer({ storage: storage }).single('file'), (req, res) => {
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf"
    if (req.file) {

        convertapi.convert('pdfa', {
            File: req.file.path,
        }, 'pdf').then(function (result) {
            result.saveFiles(outputFilePath);
        }).then(() => {
            res.download(outputFilePath, (err) => {
                if (err) {
                    fs.unlinkSync(file);
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync(outputFilePath)
                fs.unlinkSync(req.file.path);
            })
        })
    }
})


//App listen
app.listen(PORT, () => {
    console.log(`The Server has started at port ${PORT}`);
})
