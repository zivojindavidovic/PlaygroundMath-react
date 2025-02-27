import React from "react";
import { useAccountsList } from "../../hooks/useAccountsList";
import { FaTrophy, FaStar } from "react-icons/fa";
import "../../styles/AccountList.scss"

const AccountList: React.FC = () => {
  const { accounts, isLoading, error, handleAccountClick } = useAccountsList();

  if (isLoading) {
    return (
      <div className="accounts-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="accounts-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="accounts-container">
      <div className="accounts-header">
        <h2>
          <i className="fas fa-users"></i>
          Upravljanje Nalozima
        </h2>
        <p>Pregledajte i pristupite nalozima za vežbanje</p>
      </div>

      {accounts.length === 0 ? (
        <div className="no-accounts">
          <i className="fas fa-user-plus"></i>
          <h5>Trenutno nemaš kreiranih naloga dece</h5>
        </div>
      ) : (
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div
              key={account.accountId}
              className="account-card"
              onClick={() => handleAccountClick(account.accountId)}
            >
              <div className="card-content">
                <div className="points-container">
                  {account.points >= 300 ? (
                    <div className="trophy-badge">
                      <FaTrophy className="trophy-icon" />
                      <div className="badge-glow"></div>
                    </div>
                  ) : (
                    <div className="star-badge">
                      <FaStar className="star-icon" />
                      <div className="badge-glow"></div>
                    </div>
                  )}
                  <h3 className="account-points">{account.points}</h3>
                  <span className="points-label">poena</span>
                </div>
                <div className="account-info">
                  <div className="username-container">
                    <i className="fas fa-user"></i>
                    <p className="account-username">{account.username}</p>
                  </div>
                  <button className="start-button">
                    <i className="fas fa-play"></i>
                    Započni vežbanje
                  </button>
                </div>
              </div>
              <div className="card-overlay"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList; 