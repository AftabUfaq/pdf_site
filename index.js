const { PDFNet } = require('@pdftron/pdfnet-node');
const express = require('express');
const { fstat } = require('fs');
const app = express()
const path = require('path')

app.get('/',(req,res) => {
    console.log(req.query);
    res.status(200).json({
        status: 'success',
        data: 'Hello from the server...'
    })
})

app.get('/office',(req,res) => {
    console.log(req.query);
    const {fileName} = req.query;
    const inputPath = path.resolve(__dirname, `./files/${fileName}`)
    const outputPath = path.resolve(__dirname, `./files/${fileName}.pdf`)

    const convertToPDF = async () => {
        const pdfDoc = await PDFNet.PDFDoc.create()
        await pdfDoc.initSecurityHandler()
        await PDFNet.Convert.toPdf(pdfDoc, inputPath)
        pdfDoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized)
        
         
    }

    PDFNet.runWithCleanup(convertToPDF).then(()=>{
        fs.readFile(outputPath,(err,data)=>{
            if(err){
                res.statusCode=500
                res.end(err)
            }else{
                res.setHeader('ContentType','application/pdf')
                res.end(data)

            }
        })
    }).catch(err => {
        res.statusCode = 500
        console.log(err)
    })

    
})

app.listen(3000, () =>{
    console.log('App is running...')
})