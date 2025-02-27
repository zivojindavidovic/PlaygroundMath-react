import React from "react";
import { useProfessor } from "../../hooks/useProfessor";
import "../../styles/Professor.scss";

const Professor: React.FC = () => {
  const {
    courses,
    accounts,
    showModal,
    isLoading,
    selectedAccountId,
    setShowModal,
    setSelectedAccountId,
    handleApply,
    handleSendApplication,
  } = useProfessor();

  if (isLoading) {
    return (
      <div className="professor-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje kurseva...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="professor-container">
      <div className="professor-header">
        <h2>
          <i className="fas fa-chalkboard-teacher"></i>
          Kursevi Profesora
        </h2>
        <p>Lista dostupnih kurseva</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <i className="fas fa-books"></i>
          <h5>Ovaj profesor trenutno nema aktivnih kurseva</h5>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.courseId} className="course-card">
              <div className="course-info">
                <div className="course-header">
                  <i className="fas fa-graduation-cap course-icon"></i>
                  <span className="course-date">
                    Do: {new Date(course.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-age">
                    <i className="fas fa-user-graduate age-icon"></i>
                    <span>{course.age}. razred</span>
                  </div>
                  <button
                    className="apply-button"
                    onClick={() => handleApply(course.courseId)}
                  >
                    <i className="fas fa-paper-plane"></i>
                    <span>Apliciraj</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Apliciraj za Kurs</h3>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="accountSelect">Odaberite korisnika:</label>
                <select
                  id="accountSelect"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                >
                  <option value="">-</option>
                  {accounts.map((account) => (
                    <option key={account.accountId} value={account.accountId}>
                      {account.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Zatvori
              </button>
              <button
                className="submit-button"
                onClick={handleSendApplication}
                disabled={!selectedAccountId}
              >
                Pošalji aplikaciju
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Professor; 