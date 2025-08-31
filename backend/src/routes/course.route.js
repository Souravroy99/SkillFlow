import { Router } from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { createCourse, editCourse, getCourseById, getCreatorCourses, getPublishCourses, togglePublishCourse } from "../controllers/course.controller.js"
import { upload } from "../utils/multer.js"
import { createLecture, editLecture, getAllLectures, getLectureById, removeLecture } from "../controllers/lecture.controller.js"

const router = Router() 
// Always put static routes before dynamic ones.

router.use(isAuthenticated)

// Courses  
router.route('/').post(createCourse)
router.route('/published-courses').get(getPublishCourses)
router.route('/').get(getCreatorCourses)
router.route('/:courseId').put(upload.single("courseThumbnail"), editCourse)
router.route('/:courseId').get(getCourseById)
router.route('/:courseId/publish').patch(togglePublishCourse)

// Lectures 
router.route('/lecture/:lectureId').get(getLectureById)
router.route('/:courseId/lecture').post(createLecture)
router.route('/:courseId/lecture').get(getAllLectures)
router.route('/:courseId/lecture/:lectureId').put(editLecture)
router.route('/:courseId/lecture/:lectureId').delete(removeLecture)


export default router