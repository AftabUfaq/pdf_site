const fs = require("fs");
const scissors = require('scissors');
    
const splitPdfControler= (req, res) => {
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
}

module.exports =splitPdfControler;