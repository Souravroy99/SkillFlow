import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js"

export const createLecture = async(req, res) => {
    try {
        const {lectureTitle} = req.body;
        const courseId = req.params.courseId 

        if(!lectureTitle || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Lecture title is required!"
            })
        }

        const lecture = await Lecture.create({
            lectureTitle
        })

        const course = await Course.findById(courseId)

        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course is not present!"
            })
        }

        course.lectures.push(lecture._id)
        await course.save()

        return res.status(201).json({
            success: true,
            message: "Lecture created successfully",
            lecture
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error to create lecture!"
        })
    }
} 

export const getCourseLectures = async(req, res) => {
    try {
        const {courseId} = req.params
        const course = await Course.findById(courseId).populate("lectures") ;

    // If you only return course.lectures without .populate(), you will only get ObjectIds.
    // If you need full lecture data, use .populate("lectures"), otherwise, you will have to manually fetch lecture details with another query.

        if(!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Lectures are found successfully",
            lectures: course.lectures
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error to fetch lectures!"
        })
    }
}
