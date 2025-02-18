import React from "react";
import { useProfessorCourses } from "../../hooks/useProfessorCourses";
import "../../styles/ProfessorCourses.scss";

const ProfessorCourses: React.FC = () => {
  const { courses, isLoading, error, handleCourseClick } = useProfessorCourses();

  if (isLoading) {
    return (
      <div className="courses-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>Moji Kursevi</h2>
        <p>Lista vaših aktivnih kurseva</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <h5>Trenutno nemaš kreiranih kurseva</h5>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="course-card"
              onClick={() => handleCourseClick(course.courseId)}
            >
              <div className="course-info">
                <i className="fas fa-book course-icon"></i>
                <div className="course-details">
                  <h3 className="course-age">Godine: {course.age}</h3>
                  <p className="course-date">
                    Aktivno do: {new Date(course.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorCourses; 