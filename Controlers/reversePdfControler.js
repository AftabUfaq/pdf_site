const fs = require("fs");
const scissors = require('scissors');

const reversePdfControler=(req, res) => {
    console.log(req.files);
    const files = []
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            files.push(file.path)
        });
    var reverse = scissors(files[0]).reverse()
    reverse.pdfStream()
   .pipe(fs.createWriteStream('out.pdf'))
   .on('finish', function(){
     console.log("We're done!");
        res.download("out.pdf", (err) => {
                if (err) {
                    files.forEach(file => {
                        console.log(file.split('\\')[1]);
                        fs.unlinkSync(file);
                    })
                    res.send("Some error takes place in downloading the file")

                }
                fs.unlinkSync("out.pdf")
                files.forEach(file => {
                    console.log(file.split('\\')[1]);
                    fs.unlinkSync(file);
            })

        })
   }).on('error',function(err){
     throw err;
   });

    
   }
}

module.exports =reversePdfControler;