import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";

interface Course {
  courseId: number;
  age: number;
  dueDate: string;
}

const Teacher: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!teacherId || !accessToken) return;
    fetch(`http://0.0.0.0:8000/api/v1/user/teachers/${teacherId}/courses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data: Course[]) => {
        setCourses(data);
      })
      .catch(error => console.error("Error fetching courses:", error));
  }, [teacherId]);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2>Hello {teacherId}</h2>
        <div className="mt-4">
          {courses.map(course => (
            <div
              key={course.courseId}
              className="card mb-3 shadow-sm"
              style={{ maxWidth: "500px" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Course Age: {course.age}</h5>
                  <p className="card-text">Due Date: {course.dueDate}</p>
                </div>
                <button className="btn btn-primary">Apply</button>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p>No courses available for this teacher.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teacher;
