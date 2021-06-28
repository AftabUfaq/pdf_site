const fs = require("fs");
const {exec} = require('child_process');

const imageToPdfController= (req, res) => {
    console.log(req.files);
    var list = ""
    outputFilePath = "public/uploads/" + Date.now() + "output.pdf"
    if (req.files) {
        req.files.forEach(file => {
            console.log(file.path)
            list+= `${file.path}`
            list+=" "
        });

        exec(`convert ${list} ${outputFilePath}`, (err,stdout,stderr) => {
            if (err){
                //fs.unlinkSync(req.file.path)
                req.files.forEach((file) => {
                    //fs.unlinkSync(file.path);
                });
                //fs.unlinkSync(outputFilePath)
                console.log(err)
        
                res.send("some error taken place in conversion process")
                return
            }

            res.download(outputFilePath,(err) => {
                if (err){
                    //fs.unlinkSync(req.file.path)
                    req.files.forEach((file) => {
                        //fs.unlinkSync(file.path);
                    });
                    //fs.unlinkSync(outputFilePath)
                    console.log(err)
                    res.send("some error taken place in conversion process")
                    return
                }
                
                req.files.forEach((file) => {
                //fs.unlinkSync(file.path);
                });

                //fs.unlinkSync(outputFilePath);
            })
        })
        
    }
}

module.exports=imageToPdfController;