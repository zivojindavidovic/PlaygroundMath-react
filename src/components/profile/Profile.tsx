import React from "react";
import { useProfile } from "../../hooks/useProfile";
import "../../styles/Profile.scss";

const Profile: React.FC = () => {
  const {
    userData,
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

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje podataka...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header-main">
        <h2>
          <i className="fas fa-user-circle"></i>
          Korisnički Profil
        </h2>
        <p>Upravljajte vašim nalogom i povezanim nalozima</p>
      </div>

      <div className="profile-card">
        <div className="user-info-section">
          <div className="user-details">
            <p className="user-name">{userData?.firstName} {userData?.lastName}</p>
            <p className="user-email">{userData?.email}</p>
          </div>
          <button
            className="delete-button"
            onClick={() => {
              setDeleteMode("user");
              setShowModal(true);
            }}
          >
            <i className="fas fa-trash-alt"></i>
            Obriši nalog
          </button>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            {userData?.accounts && userData.accounts.length > 0 && (
              <div className="accounts-table-container">
                <table className="accounts-table">
                  <thead>
                    <tr>
                      <th>Korisničko ime</th>
                      <th>Poeni</th>
                      <th>Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.accounts.map((account) => (
                      <tr key={account.accountId}>
                        <td>{account.username}</td>
                        <td>
                          <span className="points">
                            <i className="fas fa-star"></i>
                            {account.points}
                          </span>
                        </td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => {
                              setDeleteMode("account");
                              setSelectedAccountId(account.accountId);
                              setShowModal(true);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                            Obriši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(!userData?.accounts || userData.accounts.length === 0) && (
              <div className="no-accounts">
                <i className="fas fa-users-slash"></i>
                <p>Nema dostupnih naloga.</p>
              </div>
            )}
          </div>
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
                <i className="fas fa-times"></i>
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
                <i className="fas fa-times"></i>
                Otkaži
              </button>
              <button className="confirm-button" onClick={handleDelete}>
                <i className="fas fa-trash-alt"></i>
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