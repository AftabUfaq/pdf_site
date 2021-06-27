
const {PDFDocument,StandardFonts,degrees,rgb}=require('pdf-lib')
const fs = require("fs");
const WaterMarkControler= (req, res) => {
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
}

module.exports =WaterMarkControler;