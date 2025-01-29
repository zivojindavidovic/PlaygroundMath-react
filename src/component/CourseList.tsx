import React, { useEffect, useState } from "react";

interface Course {
    courseId: number;
    age: number;
    dueDate: string;
}

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        fetch("http://0.0.0.0:8000/api/v1/course/myCourses", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data))
            .catch((error) => console.error("Failed to fetch courses", error));
    }, []);

    return (
        <div className="card shadow-sm p-3">
            <h3 className="text-center">My Courses</h3>
            <ul className="list-group">
                {courses.map((course) => (
                    <li key={course.courseId} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>Age: {course.age}</span>
                        <span>Due Date: {new Date(course.dueDate).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseList;
