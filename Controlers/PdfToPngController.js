const fs = require("fs");
const {exec} = require('child_process');

const pdftopngController= (req, res) => {
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
}

module.exports=pdftopngController;