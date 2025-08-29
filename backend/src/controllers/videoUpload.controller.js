import { uploadOnCloudinary } from "../utils/cloudinary.js"

export const uploadVideo = async(req, res) => {
    try {
        const videoLocalPath = req.file.path
        const result = await uploadOnCloudinary(videoLocalPath)

        return res.status(200).json({message: "Video uploaded successfully", data: result})    
    } 
    catch (error) {
        return res.status(500).json({message: "Server error during video upload"})    
    }
}