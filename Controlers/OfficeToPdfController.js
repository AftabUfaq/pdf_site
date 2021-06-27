const {exec} = require('child_process');
const fs = require("fs");
const pdftodocController=(req,res) => {
    if(req.file)
    {
        inputFile=req.file.path;
        outputFilePath=inputFile.split(".")[0]+".docx"
        console.log(inputFile);
        exec(
            `libreoffice --headless --convert-to docx:"writer_pdf_Export:ReduceImageResolution=True;MaxImageResolution=75;Quality=50" ${inputFile} --outdir ~/pdf_site/public/uploads/`,
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

module.exports=pdftodocController;