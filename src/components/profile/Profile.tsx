import React from "react";
import { useProfile } from "../../hooks/useProfile";
import "../../styles/Profile.scss";

const Profile: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    showModal,
    password,
    deleteMode,
    setShowModal,
    setPassword,
    setDeleteMode,
    setSelectedAccountId,
    handleDelete,
    closeModal
  } = useProfile();

  const email = localStorage.getItem("email");
  const isTeacher = localStorage.getItem("isTeacher") === "true";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profil</h2>
          <p>{email}</p>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h3>Korisnički nalog</h3>
            <button
              className="delete-button"
              onClick={() => {
                setDeleteMode("user");
                setShowModal(true);
              }}
            >
              Obriši nalog
            </button>
          </div>

          {!isTeacher && (
            <div className="profile-section">
              <h3>Nalozi dece</h3>
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : accounts.length === 0 ? (
                <p className="no-accounts">Nema dostupnih naloga dece.</p>
              ) : (
                <div className="accounts-list">
                  {accounts.map((account) => (
                    <div key={account.accountId} className="account-item">
                      <div className="account-info">
                        <h4>{account.username}</h4>
                        <p>Poeni: {account.points}</p>
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setDeleteMode("account");
                          setSelectedAccountId(account.accountId);
                          setShowModal(true);
                        }}
                      >
                        Obriši
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {deleteMode === "user"
                  ? "Potvrda brisanja naloga"
                  : "Potvrda brisanja naloga dece"}
              </h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <input
                type="password"
                className="password-input"
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>
                Otkaži
              </button>
              <button className="confirm-button" onClick={handleDelete}>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 