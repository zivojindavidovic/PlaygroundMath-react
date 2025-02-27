import React, { useState } from "react";
import { useProfessorCourses } from "../../hooks/useProfessorCourses";
import "../../styles/ProfessorCourses.scss";

const ProfessorCourses: React.FC = () => {
  const { courses, isLoading, error, handleCourseClick } = useProfessorCourses();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleDescriptionClick = (description: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  if (isLoading) {
    return (
      <div className="courses-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje kurseva...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>
          <i className="fas fa-chalkboard-teacher"></i>
          Moji Kursevi
        </h2>
        <p>Lista vaših aktivnih kurseva</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <i className="fas fa-books"></i>
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
              <div className="course-header">
                <i className="fas fa-graduation-cap course-icon"></i>
                <span className="course-date">
                  <i className="fas fa-calendar-alt"></i>
                  Do: {new Date(course.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-description">
                  <p>{course.description}</p>
                  <button 
                    className="expand-description"
                    onClick={(e) => handleDescriptionClick(course.description, e)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                <div className="course-age">
                  <i className="fas fa-user-graduate age-icon"></i>
                  <span>{course.age}. razred</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDescriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Opis Kursa</h3>
              <button
                className="close-button"
                onClick={() => setShowDescriptionModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="full-description">{selectedDescription}</p>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowDescriptionModal(false)}
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorCourses; 