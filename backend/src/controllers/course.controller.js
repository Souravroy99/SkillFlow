import { Course } from "../models/course.model.js";
import { deleteMediaFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category, } = req.body
        if (!courseTitle || !category) {
            return res.status(400).json({ success: false, message: "Course title and category are required" })
        }

        const course = await Course.create({ courseTitle, category, creator: req.user._id })

        return res.status(200).json({ success: true, message: "Course successfully created", course })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create course" })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const _id = req.user._id
        const allCourses = await Course.find({ creator: _id })

        if (allCourses.length === 0) {
            return res.status(404).json({ success: false, message: "No course found", courses: [] })
        }
        return res.status(200).json({ success: true, message: "Courses found successfully", courses: allCourses })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch courses" })
    }
}


export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body
        const courseThumbnailLocalPath = req.file?.path

        const isCourseExists = await Course.findById(courseId)
        if (!isCourseExists) {
            return res.status(404).json({ success: false, message: "Course not found" })
        }

        let courseThumbnail;

        if (courseThumbnailLocalPath) {
            if (isCourseExists.courseThumbnail) {
                const courseThumbnailPublicId = isCourseExists.courseThumbnail.split('/').pop().split('.')[0]
                await deleteMediaFromCloudinary(courseThumbnailPublicId)
            }
            courseThumbnail = await uploadOnCloudinary(courseThumbnailLocalPath)
        }

        const updateData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            courseThumbnail: courseThumbnail?.url
        }


        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true })

        return res.status(200).json({ success: true, message: "Course updated successfully", course: updatedCourse })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to edit course" })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({ success: false, message: "Course does not exists" })
        }

        return res.status(200).json({ success: true, message: "Course fetched successfully", course })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch course by id" })
    }
}

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { publish } = req.query

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ success: false, message: "Course does not exists" })
        }


        course.isPublished = publish === "true" ? true : false
        await course.save()


        return res.status(200).json({ success: true, message: `Course is ${publish === "true" ? "Published" : "Unpublished"}` })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update status" })
    }
}