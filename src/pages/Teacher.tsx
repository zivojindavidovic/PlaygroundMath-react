import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";

interface Course {
  courseId: number;
  age: number;
  dueDate: string;
}

interface Child {
    accountId: number;
    accountData: string;
}

const Teacher: React.FC = () => {
    const { teacherId } = useParams<{ teacherId: string }>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<number | null>(null);
    const [appliedCourses, setAppliedCourses] = useState<number[]>([]);
    const userId = localStorage.getItem("userId");
  
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
  
    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      if (!userId || !accessToken) return;
      fetch(`http://0.0.0.0:8000/api/v1/user/${userId}/children`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch children");
          }
          return response.json();
        })
        .then((data: Child[]) => {
          setChildren(data);
          if (data.length > 0) {
            setSelectedChild(data[0].accountId);
          }
        })
        .catch(error => console.error("Error fetching children:", error));
    }, [userId]);
  
    const handleApply = async (courseId: number) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !selectedChild) return;
      try {
        const response = await fetch("http://0.0.0.0:8000/api/v1/course/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            courseId,
            accountId: selectedChild
          })
        });
  
        if (!response.ok) {
          throw new Error("Failed to apply for course");
        }
  
        const data = await response.json();
        if (data.message === "Application sent successfully") {
          setAppliedCourses(prev => [...prev, courseId]);
        }
      } catch (error) {
        console.error("Error applying for course:", error);
      }
    };
  
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <h2>Hello {teacherId}</h2>
          <div className="row">
            <div className="col-md-8">
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
                        <p className="card-text">
                          Due Date: {new Date(course.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApply(course.courseId)}
                        disabled={appliedCourses.includes(course.courseId)}
                      >
                        {appliedCourses.includes(course.courseId) ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && <p>No courses available for this teacher.</p>}
              </div>
            </div>
  
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <h4 className="text-center">Available Children</h4>
                {children.length > 0 ? (
                  <select
                    className="form-select mt-2"
                    value={selectedChild ?? ""}
                    onChange={(e) => setSelectedChild(Number(e.target.value))}
                  >
                    {children.map(child => (
                      <option key={child.accountId} value={child.accountId}>
                        {child.accountData}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-muted text-center mt-2">No children found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Teacher;