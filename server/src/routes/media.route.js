import express from "express"
import upload from "../utils/multer.js"
import { uploadMedia } from "../utils/cloudinary.js"

const router = express.Router()

router.route('/upload-video').post(upload.single('file'), async (req, res) => {
    try {
        const localFile = req.file
        const localFilePath = localFile.path

        const result = await uploadMedia(localFilePath)
        return res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Video upload failed!"
        })
    }
});

export default router