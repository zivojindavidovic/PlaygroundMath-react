import React from 'react';
import { useAdminAccounts } from '../../hooks/useAdminAccounts';
import { FaCheck } from 'react-icons/fa';
import '../../styles/AdminAccounts.scss';

const AdminAccounts: React.FC = () => {
  const { 
    accounts, 
    isLoading, 
    error, 
    editingStates,
    updateEditingState,
    handleUpdateAccount, 
    handleDeleteAccount 
  } = useAdminAccounts();

  if (isLoading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2 className="admin-title">
          <i className="fas fa-user-circle admin-icon"></i>
          <span>Upravljanje Nalozima</span>
        </h2>
        <p className="admin-subtitle">Pregled i administracija svih naloga u sistemu</p>
      </header>

      <div className="accounts-list">
        {accounts.map(account => (
          <article key={account.accountId} className="account-card">
            <div className="account-form">
              <div className="account-inputs">
                <input
                  type="text"
                  value={editingStates[account.accountId]?.username || ''}
                  onChange={(e) => updateEditingState(account.accountId, 'username', e.target.value)}
                  placeholder="Korisničko ime"
                  className="account-input account-input--text"
                />
                <input
                  type="number"
                  value={editingStates[account.accountId]?.points || 0}
                  onChange={(e) => updateEditingState(account.accountId, 'points', parseInt(e.target.value))}
                  className="account-input account-input--number"
                />
              </div>
              <button 
                className="btn btn--save"
                onClick={() => handleUpdateAccount(account.accountId)}
              >
                <FaCheck className="btn__icon" />
                <span className="btn__text">Sačuvaj</span>
              </button>
              <button 
                className="btn btn--delete"
                onClick={() => handleDeleteAccount(account.accountId)}
              >
                Obriši
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminAccounts; 