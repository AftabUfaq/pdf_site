const {PDFDocument,StandardFonts,degrees,rgb}=require('pdf-lib')
const fs = require("fs");
const ImageWaterMarkController = (req,res)=>{
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
}

module.exports =ImageWaterMarkController;