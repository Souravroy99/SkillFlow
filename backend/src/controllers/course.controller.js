import { Course } from "../models/course.model.js";

export const createCourse = async(req, res) => {
    try {
        const { courseTitle, category,  } = req.body
        if(!courseTitle || !category) {
            return res.status(400).json({success: false, message: "Course title and category are required"})    
        }

        const course = await Course.create({courseTitle, category, creator: req.user._id})

        return res.status(200).json({success: true, message: "Course successfully created", course})    

    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to create course"})    
    }
}

export const getCreatorCourses = async(req, res) => {
    try {
        const _id = req.user._id
        const allCourses = await Course.find({ creator: _id })

        if(!allCourses) {
            return res.status(404).json({success: false, message: "No course found", courses: []})    
        }
        return res.status(200).json({success: true, message: "Courses found successfully", courses: allCourses})    
    } 
    catch (error) {
        return res.status(500).json({success: false, message: "Failed to fetch courses"})    
    }
}