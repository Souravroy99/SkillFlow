import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
dotenv.config({path: "./.env"})
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadMedia = async (localFilePath) => {
    try {
        if(!localFilePath) {
            console.log("Local File Path is not found!");
            return null ;
        }

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        fs.unlinkSync(localFilePath); 
        return uploadResult
    } 
    catch (error) {
        fs.unlinkSync(localFilePath); 
        console.log(`Cloudinary -->: ${error}`);
        return null
    }
}

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log(error);
    }
}

export const deleteVedioFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        })
    } catch (error) {
        console.log(error);
    }
}