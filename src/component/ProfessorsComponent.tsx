import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Teacher {
  teacherId: number;
  teacherEmail: string;
  numberOfActiveCourses: number;
}

const ProfessorsComponent: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const navigate = useNavigate();
  const isTeacher = localStorage.getItem("isTeacher") === "true";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isTeacher) {
      fetch("http://0.0.0.0:8000/api/v1/user/teachers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setTeachers(data))
        .catch((error) => console.error("Failed to fetch teachers", error));
    }
  }, [isTeacher]);

  return (
    <div className="teachers">
      {teachers.length === 0 && (
        <h5 className="alert alert-danger">
          Trenutno nema registrovanih profesora
        </h5>
      )}
      <div className="col-md-6">
        <div className="">
          {teachers.map((teacher) => (
            <div
              key={teacher.teacherId}
              className="card mb-3 shadow-sm border-0"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/professors/${teacher.teacherId}`)}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{teacher.teacherEmail}</h5>
                  <p className="card-text">
                    Broj aktivnih kurseva: {teacher.numberOfActiveCourses}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorsComponent;
