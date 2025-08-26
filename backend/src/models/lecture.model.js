import mongoose from 'mongoose'

const lectureSchema = new mongoose.Schema(
    {
        lectureTitle: {
            type: String,
            required: true
        },
        videoUrl: String,
        publicId: String,
        isPreviewFree: Boolean 
    }, 
    {
        timestamps: true
    }
)

export const Lecture = mongoose.model('Lecture', lectureSchema) 