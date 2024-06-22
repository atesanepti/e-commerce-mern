//External Dependencies
const multer = require("multer");


//Internal Dependencies

const fileHandler = (dir,fileAcceptType, maxFileSize) => {
  const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
      cb(null,dir)
    },
    filename : (req,file,cb)=>{
      let fileName = file.originalname;
      cb(null,fileName)
    }
  })

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("only image file will be accepted"), false);
      }
      else if(fileAcceptType.indexOf(file.mimetype) == -1){
        console.log(file.mimetype);
        
        cb(new Error("image must be type png or jpg"), false);
      }
      else {
        cb(null,true);
      }
    },
  });
  return upload;
};





module.exports = { fileHandler };
