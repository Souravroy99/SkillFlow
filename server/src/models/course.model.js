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
            enum: ["Beginner", "Medium", "Advance"]
        },
        courseThumbnail: String,
        enrolledStudents: [
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
            ref: "User"
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