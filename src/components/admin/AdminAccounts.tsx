import React from 'react';
import { useAdminAccounts } from '../../hooks/useAdminAccounts';
import '../../styles/Admin.scss';

const AdminAccounts: React.FC = () => {
  const { 
    accounts, 
    isLoading, 
    error, 
    pointsMap, 
    setPointsMap, 
    handleUpdatePoints, 
    handleDeleteAccount 
  } = useAdminAccounts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-container">
      <h2>Svi nalozi</h2>
      <div className="accounts-list">
        {accounts.map(account => (
          <div key={account.accountId} className="account-item">
            <div className="account-info">
              <span className="account-username">{account.username}</span>
              <div className="points-control">
                <input
                  type="number"
                  value={pointsMap[account.accountId]}
                  onChange={(e) => setPointsMap({
                    ...pointsMap,
                    [account.accountId]: parseInt(e.target.value)
                  })}
                  className="points-input"
                />
                <button 
                  className="save-button"
                  onClick={() => handleUpdatePoints(account.accountId)}
                >
                  Sačuvaj
                </button>
              </div>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDeleteAccount(account.accountId)}
            >
              Obriši
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAccounts; 