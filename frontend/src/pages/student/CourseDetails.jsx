import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/BuyCourseButton";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
    const params = useParams()
    const courseId = params.courseId
    const purchaseCourse = true;

    return (
        <div className="mt-20 space-y-5">
            {/* Course Header Section */}
            <div className="bg-[#2D2F31] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col items-center text-center gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>

                    <p className="text-base md:text-lg">Course Sub-title</p>

                    <p className="text-sm m-0">
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">
                            Sourav MernStack
                        </span>
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm m-0">
                        <BadgeInfo className="shrink-0" size={16} />
                        <p className="m-0">Last updated 01-09-2025</p>
                    </div>

                    <p className="text-sm m-0">Students enrolled: 10</p>
                </div>
            </div>


            {/* Course Details Section */}
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">

                {/* Left Side - Description + Lectures */}
                <div className="w-full lg:w-2/3 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p className="text-sm text-gray-300">
                        This is the course description. Random things will happen and you
                        will learn useful stuff here.
                    </p>

                    {/* Lectures List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3, 4].map((lecture, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 border-b last:border-b-0 pb-2"
                                >
                                    <span className="text-gray-600">
                                        {purchaseCourse ? (
                                            <PlayCircle size={18} />
                                        ) : (
                                            <Lock size={18} />
                                        )}
                                    </span>
                                    <p className="text-sm">Lecture {idx + 1} title</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side - Video + Pricing */}
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            {/* Preview Video */}
                            <div className="w-full aspect-video mb-4 bg-gray-800 flex items-center justify-center text-gray-400">
                                Video Preview
                            </div>

                            {/* Lecture Info */}
                            <h1 className="text-base md:text-lg font-medium">
                                Lecture Title
                            </h1>
                            <Separator className="my-2" />

                            {/* Course Price */}
                            <h1 className="text-lg md:text-xl font-semibold">₹999</h1>
                        </CardContent>

                        {/* Footer Action */}
                        <CardFooter className="flex p-4 justify-center">
                            {purchaseCourse ? (
                                <Button className="w-full">Continue Course</Button>
                            ) : (
                                <BuyCourseButton courseId={courseId} />
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
