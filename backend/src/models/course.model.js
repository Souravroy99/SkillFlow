import mongoose from "mongoose"

const courseSchema = new mongoose.Schema(
    { 
        courseTitle: {
            type: String,
            required: true,
        },
        subTitle: String,
        description: String,
        coursePrice: Number,
        category: {
            type: String,
            required: true 
        },  
        courseLevel: {
            type: String,
            enum: ["Beginner", "Medium", "Advanced"]
        },
        courseThumbnail: String, // Thumbnail URL
        enrolledStudents: [
            // We can do 'populate' due to 'ref'
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ], 
        lectures: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lecture"
            } 
        ], 
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            reuired: true
        },
        isPublished: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)
 
export const Course = mongoose.model("Course", courseSchema)