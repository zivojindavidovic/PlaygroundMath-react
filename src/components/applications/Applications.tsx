import React from "react";
import { useApplications } from "../../hooks/useApplications";
import "../../styles/Applications.scss";

const Applications: React.FC = () => {
  const { applications, isLoading, error, handleApplicationDecision } = useApplications();

  if (isLoading) {
    return (
      <div className="applications-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h2>Zahtevi za Pristup</h2>
        <p>Lista zahteva za pristup vašim kursevima</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <h5>Trenutno nemaš zahteva za pristup tvojim zadacima</h5>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application, index) => (
            <div key={index} className="application-card">
              <div className="application-info">
                <h3 className="username">{application.accountUsername}</h3>
                <div className="details">
                  <p>
                    <i className="fas fa-book"></i> Kurs ID: {application.courseId}
                    <span className="age-info">(Godine: {application.courseAge})</span>
                  </p>
                  <p>
                    <i className="fas fa-user"></i> Nalog ID: {application.accountId}
                    <span className="age-info">(Godine: {application.accountAge})</span>
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="approve-button"
                    onClick={() => handleApplicationDecision(application, true)}
                  >
                    <i className="fas fa-check"></i> Odobri
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleApplicationDecision(application, false)}
                  >
                    <i className="fas fa-times"></i> Odbij
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