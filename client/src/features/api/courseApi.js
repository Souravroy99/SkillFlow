import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:3001/api/v1/course/"

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['Refetch_Creator_Course'],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category, coursePrice }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category, coursePrice }
            }),
            invalidatesTags: ['Refetch_Creator_Course'],
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
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
        getCourseLectures: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET",
            })
        }),
    })
})


export const { useCreateCourseMutation, useGetCreatorCourseQuery, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetCourseLecturesQuery} = courseApi