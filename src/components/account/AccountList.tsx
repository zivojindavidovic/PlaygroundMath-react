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
        <h2>Nalozi Dece</h2>
        <p>Izaberite nalog za početak igre</p>
      </div>

      {accounts.length === 0 ? (
        <div className="no-accounts">
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
              <div className="points-container">
                {account.points >= 300 ? (
                  <FaTrophy className="trophy-icon" />
                ) : (
                  <FaStar className="star-icon" />
                )}
                <h3 className="account-points">{account.points}</h3>
                <span className="points-label">poena</span>
              </div>
              <div className="account-info">
                <p className="account-username">{account.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountList; 