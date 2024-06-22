const createHttpError = require("http-errors");

//External Dependencies
const fs = require("fs").promises;


const deleteImage = async (imagePath)=>{
    try {
        if(!imagePath){
            console.log("no need to delete image");
            return true;
        }
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log("image was delete");
    } catch (error) {
        console.log("image does not exist");
    }
}


module.exports = {deleteImage}