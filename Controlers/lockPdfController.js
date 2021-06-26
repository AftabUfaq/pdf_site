const fs = require("fs");
const {exec} = require('child_process');

const lockPdfController  = (req,res) => {
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
}

module.exports=lockPdfController;