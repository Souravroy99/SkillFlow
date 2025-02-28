import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateLectureMutation, useGetCourseLecturesQuery } from '@/features/api/courseApi'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState("")
    const navigate = useNavigate()

    const params = useParams();
    const courseId = params.courseId

    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation()
    const { data: lectureData, isLoading: lectureLoading, isError: lectureError, refetch } = useGetCourseLecturesQuery(courseId)


    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId })
    }

    useEffect(() => {
        if (isSuccess) {
            refetch()
            toast.success(data?.message || "Lecture successfully created")
        }
        if (error) {
            toast.error(error?.message || "Create lecture error")
        }
    }, [isSuccess, error])

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Let's add lectures! add some basic details for your new lecture.
                </h1>
                <p className="text-sm text-gray-600">
                    Enter the lecture title and necessary stuffs.
                </p>

            </div>

            <div className="space-y-4">
                <div>
                    <Label className='font-semibold'>Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Your Title Name"
                    />
                </div>



                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
                        Back to course
                    </Button>
                    <Button
                        disabled={isLoading} onClick={createLectureHandler} >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Create new lecture"
                        )}
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? (
                            <p>Loading lecture...</p>
                        ) : lectureError ? (
                            <p>Failed to load lectures...</p>
                        ) : lectureData.length === 0 ? (
                            <p>No lectures available</p>
                        ) : (
                            lectureData.lectures.map((lecture,index) => (

                                <Lecture key={lecture._id} index={index} lecture={lecture} />
                            ))
                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default CreateLecture