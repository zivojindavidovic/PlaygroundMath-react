import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
    courseId: number;
    age: number;
    dueDate: string;
  }

const ProfessorCourses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

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
        .then((data) => {
          if (data.success && data.results) {
            setCourses(data.results);
          } else {
            console.error("No courses found or data not in the expected format:", data);
          }
        })
        .catch((error) => console.error("Failed to fetch courses:", error));
    }, []);
  
    return (
        <div className="">
            {courses.length === 0 && (<h5 className="alert alert-danger">
          Trenutno nemaš kreiranih kurseva
        </h5>)}
          <ul className="list-group">
            {courses.map((course) => (
              <li
                key={course.courseId}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => navigate(`/professor-courses/${course.courseId}`)}
                style={{ cursor: "pointer" }}
              >
                <span>Godine za koje je kurs namenjen: {course.age}</span>
                <span>Kurs je aktivan do: {new Date(course.dueDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default ProfessorCourses;