import React from "react";
import { useApplications } from "../../hooks/useApplications";
import "../../styles/Applications.scss";

const Applications: React.FC = () => {
  const { applications, isLoading, error, handleApplicationDecision } = useApplications();

  if (isLoading) {
    return (
      <div className="applications-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje zahteva...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header-main">
        <h2>
          <i className="fas fa-envelope-open-text"></i>
          Pristupni Zahtevi
        </h2>
        <p>Pregledajte i upravljajte zahtevima za pristup kursevima</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <i className="fas fa-inbox"></i>
          <p>Trenutno nema aktivnih zahteva za pristup</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application, index) => (
            <div key={index} className="application-card">
              <div className="application-info">
                <div className="user-header">
                  <i className="fas fa-user-graduate"></i>
                  <h3 className="username">{application.accountUsername}</h3>
                </div>
                <div className="details">
                  <div className="detail-item">
                    <i className="fas fa-book"></i>
                    <div className="detail-content">
                      <span className="detail-label">Kurs ID</span>
                      <span className="detail-value">{application.courseId}</span>
                      <span className="age-info">{application.courseAge} godina</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-user"></i>
                    <div className="detail-content">
                      <span className="detail-label">Nalog ID</span>
                      <span className="detail-value">{application.accountId}</span>
                      <span className="age-info">{application.accountAge} godina</span>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <button
                    className="approve-button"
                    onClick={() => handleApplicationDecision(application, true)}
                  >
                    <i className="fas fa-check"></i>
                    <span>Odobri</span>
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleApplicationDecision(application, false)}
                  >
                    <i className="fas fa-times"></i>
                    <span>Odbij</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications; 