// external dependencies
const path = require("path");
const createHttpError = require("http-errors");


//internal dependencies;
const cloudinary = require("../config/cloudinary");



const publicId = (imagePath)=>{
    const pathSegments = imagePath.split("/");
    const pathLastSegment = pathSegments[pathSegments.length - 1];
    const extenname = path.extname(imagePath);
    const publicId = pathLastSegment.replace(extenname,"");
    return publicId;
}


const uploadFileOnCloudinary = async (path,options)=>{
    try {
        const response = await cloudinary.uploader.upload(path,options);
        return response.secure_url;
    } catch (error) {
        throw error;
    }
}

const deleteFileOnClouddinary = async(path, dir)=>{
    try {
        const public_id = publicId(path);
        const {result} = await cloudinary.uploader.destroy(`${dir}/${public_id}`);
        if(result !== "ok"){
            throw createHttpError(500, "failed to delete image")
        }

    } catch (error) {
        throw error;
    }
}


module.exports = {
    uploadFileOnCloudinary,
    deleteFileOnClouddinary
}