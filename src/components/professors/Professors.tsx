import React from "react";
import { useProfessors } from "../../hooks/useProfessors";
import "../../styles/Professors.scss";

const Professors: React.FC = () => {
  const { professors, isLoading, error, handleProfessorClick } = useProfessors();

  if (isLoading) {
    return (
      <div className="professors-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje profesora...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="professors-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="professors-container">
      <div className="professors-header">
        <h2>
          <i className="fas fa-chalkboard-teacher"></i>
          Lista Profesora
        </h2>
        <p>Pregledajte i pristupite kursevima profesora</p>
      </div>

      {professors.length === 0 ? (
        <div className="no-professors">
          <i className="fas fa-user-slash"></i>
          <h5>Trenutno nema registrovanih profesora</h5>
        </div>
      ) : (
        <div className="professors-grid">
          {professors.map((professor) => (
            <div
              key={professor.teacherId}
              className="professor-card"
              onClick={() => handleProfessorClick(professor.teacherId)}
            >
              <div className="card-content">
                <div className="professor-info">
                  <div className="professor-avatar">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <h3 className="professor-email">{professor.teacherEmail}</h3>
                  <div className="courses-count">
                    <i className="fas fa-book-reader"></i>
                    <span>{professor.numberOfActiveCourses} aktivnih kurseva</span>
                  </div>
                </div>
                <button className="view-courses-button">
                  <i className="fas fa-arrow-right"></i>
                  <span>Pogledaj kurseve</span>
                </button>
              </div>
              <div className="card-overlay"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Professors; 