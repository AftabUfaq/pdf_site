const fs = require("fs");
const {exec} = require('child_process');

const unlockPdfController = (req, res) => {
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
}

module.exports=unlockPdfController;