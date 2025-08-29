import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";

export const createLecture = async(req, res) => {
    try {
        const { courseId } = req.params
        const { lectureTitle } = req.body

        if(!courseId || !lectureTitle) {
            return res.status(400).json({message: "Lecture title and Course Id is required"})
        }

        const lecture = await Lecture.create({ lectureTitle })
        
    // Option 1
        await Course.findByIdAndUpdate(
            courseId, 
            { $push: {lectures: lecture._id} },  // Pushing into array 
        )

    // Option 2
    /*
        const course = await Course.findById(courseId)
        course.lectures.push(lecture._id)
        await course.save() ;
    */

        return res.status(200).json({success: true, message: "Lecture created successfully", lecture})    
    } 
    catch (error) {
        return res.status(500).json({message: "Failed to create lecture"})    
    }
}

export const getAllLectures = async(req, res) => {
    try {
        const { courseId } = req.params

    /*  populate("") --> Instead of just giving the ObjectIds, replace them with the ACTUAL DOCUMENTS from the referenced collection.
  
        ** Without populate → lectures: [ObjectId("..."), ObjectId("...")]
        ** With populate("lectures") → lectures: [ { full lecture doc }, { full lecture doc } ]
    */

        const course = await Course.findById(courseId).populate("lectures")

        if(!course) {
            return res.status(400).json({message: "No course found"})    
        }

        return res.status(200).json({ success: true, message: "Lectures found successfully", lectures: course.lectures })
    } 
    catch (error) {
        return res.status(500).json({message: "Failed to fetch lectures"})    
    }
}

export const editLecture = async(req, res) => {
    try {
        const { lectureId } = req.params
        const { lectureTitle, isPreviewFree, videoInfo} = req.body
    } 
    catch (error) {
        return res.status(500).json({message: "Failed to edit lecture"})    
    }
}