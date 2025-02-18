import React from "react";
import { useProfessors } from "../../hooks/useProfessors";
import "../../styles/Professors.scss";

const Professors: React.FC = () => {
  const { professors, isLoading, error, handleProfessorClick } = useProfessors();

  if (isLoading) {
    return (
      <div className="professors-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="professors-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="professors-container">
      <div className="professors-header">
        <h2>Profesori</h2>
        <p>Lista dostupnih profesora</p>
      </div>

      {professors.length === 0 ? (
        <div className="no-professors">
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
              <div className="professor-info">
                <i className="fas fa-user-tie professor-icon"></i>
                <h3 className="professor-email">{professor.teacherEmail}</h3>
                <p className="courses-count">
                  Broj aktivnih kurseva: {professor.numberOfActiveCourses}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Professors; 