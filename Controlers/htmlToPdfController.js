const fs = require("fs");
const {exec} = require('child_process');
const puppeteer = require('puppeteer-core');


const htmlToPdfController = (req,res)=>{
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
}

module.exports=htmlToPdfController;