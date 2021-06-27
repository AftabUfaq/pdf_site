const fs = require("fs");
const scissors = require('scissors');

const rotatePdfControler= (req, res) => {
    console.log(req.files);
    const files = []
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            files.push(file.path)
        });
    //const file = fs.readFileSync(files[0])
    var rotated = scissors(files[0]).rotate(90)
    rotated.pdfStream()
   .pipe(fs.createWriteStream('out.pdf'))
   .on('finish', function(){
     console.log("We're done!");
        //outputFilePath = "./uploads/" + Date.now() + "out.pdf"
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

module.exports =rotatePdfControler;