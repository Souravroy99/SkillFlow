import express from "express"
import { upload } from "../utils/multer.js"
import { uploadVideo } from "../controllers/videoUpload.controller.js"

const router = express.Router()

router.route('/upload-video').post(upload.single("file"), uploadVideo)

export default router   