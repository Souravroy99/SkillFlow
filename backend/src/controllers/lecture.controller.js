import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

export const createLecture = async (req, res) => {
    try {
        const { courseId } = req.params
        const { lectureTitle } = req.body

        if (!courseId || !lectureTitle) {
            return res.status(400).json({ success: false, message: "Lecture title is required" })
        }

        const lecture = await Lecture.create({ lectureTitle })
 
        // Option 1
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { lectures: lecture._id } },  // Pushing into array 
        )

        // Option 2
        /*
            const course = await Course.findById(courseId)
            course.lectures.push(lecture._id)
            await course.save() ;
        */

        return res.status(200).json({ success: true, message: "Lecture created successfully", lecture })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create lecture" })
    }
}


export const getAllLectures = async (req, res) => {
    try {
        const { courseId } = req.params

        /*  populate("") --> Instead of just giving the ObjectIds, replace them with the ACTUAL DOCUMENTS from the referenced collection.
      
            ** Without populate → lectures: [ObjectId("..."), ObjectId("...")]
            ** With populate("lectures") → lectures: [ { full lecture doc }, { full lecture doc } ]
        */

        const course = await Course.findById(courseId).populate("lectures")

        if (!course) {
            return res.status(400).json({ message: "No course found" })
        }

        return res.status(200).json({ success: true, message: "Lectures found successfully", lectures: course.lectures })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch lectures" })
    }
}


export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, isPreviewFree, videoInfo } = req.body
        const { courseId, lectureId } = req.params

        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" })
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle
        if (videoInfo && videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl
        if (videoInfo && videoInfo.publicId) lecture.publicId = videoInfo.publicId
        if (typeof isPreviewFree !== "undefined") lecture.isPreviewFree = isPreviewFree

        await lecture.save()

        const course = await Course.findById(courseId)
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id)
            await course.save()
        }

        return res.status(200).json({ success: true, message: "Lecture updated successfully", lecture })
    }
    catch (error) {
        console.error("Edit Lecture Error:", error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const removeLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)

        if (!lecture) {
            return res.status(404).json({ success: false, message: "Lecture doesn't exists" })
        } 

        const course = await Course.findById(courseId)
        if (course && course.lectures.includes(lectureId)) 
        {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { lectures: lectureId }
            });
        }

        await deleteVideoFromCloudinary(lecture.publicId)

        return res.status(200).json({ success: true, message: "Lecture deleted successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete lecture" })
    }
}


export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findById(lectureId)

        if (!lecture) {
            return res.status(404).json({ success: false, message: "No lecture exists" })
        }
console.log(lecture);
        return res.status(200).json({ success: true, message: "Lecture found successfully", lecture })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch lecture" })
    }
}