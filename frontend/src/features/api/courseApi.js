import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:7001/api/v1/course/"

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['Refetch_Creator_Course', 'Refetch_Lecture'],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category, coursePrice }) => ({
                url: "/",
                method: "POST",
                body: { courseTitle, category, coursePrice }
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "/", 
                method: "GET",
            }),
            providesTags: ['Refetch_Creator_Course']
        }),
        editCourse: builder.mutation({
            query: ({formData, courseId}) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",      
            })
        }),     
        createLecture: builder.mutation({
            query: ({lectureTitle, courseId}) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: {lectureTitle}
            })
        }), 
        getPublishedCourses: builder.query({
            query: () => ({
                url: `/published-courses`,
                method: "GET",
            }),
        }),         
        getCourseLectures: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: ["Refetch_Lecture"]
        }), 
        editLecture: builder.mutation({
            query: ({ lectureTitle, isPreviewFree, videoInfo, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "PUT", 
                body: {lectureTitle, isPreviewFree, videoInfo}
            })
        }), 
        removeLecture: builder.mutation({
            query: ({courseId, lectureId}) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture"]
        }), 
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET",      
            })
        }),
        publishCourse: builder.mutation({
            query: ({courseId, query}) => ({
                url: `/${courseId}/publish?publish=${query}`,
                method: "PATCH",
            })
        }), 
    })
})

 
export const { 
    useCreateCourseMutation, 
    useGetCreatorCourseQuery, 
    useEditCourseMutation, 
    useGetCourseByIdQuery, 
    useEditLectureMutation, 
    useCreateLectureMutation, 
    useGetCourseLecturesQuery,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useGetPublishedCoursesQuery,
} = courseApi
