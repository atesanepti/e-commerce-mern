
//Internal Dependencies
const { fileHandler ,fileHandlerWithDisk} = require("../helpers/multer");
const { userFileUploadDir } = require("../../secret");
const { reduceTo } = require("../utilities/math");



const userAvatarUpload = (fieldName)=>{
    // const UPLOAD_DIR = userFileUploadDir;
    const fileAccept = ["image/jpeg", "image/jpg", "image/png"];
    const fileMaxSize = reduceTo("1mb");
    const dir = "public/images/users/avatars"
    const upload = fileHandler(dir,fileAccept, fileMaxSize);

    return upload.single(fieldName);

}

const productImageUpload = (fieldName)=>{
    // const UPLOAD_DIR = userFileUploadDir;
    const fileAccept = ["image/jpeg", "image/jpg", "image/png"];
    const fileMaxSize = reduceTo("3mb");
    const dir = "public/images/products"
    const upload = fileHandler(dir,fileAccept, fileMaxSize);

    return upload.single(fieldName);

}




module.exports = { userAvatarUpload,productImageUpload };