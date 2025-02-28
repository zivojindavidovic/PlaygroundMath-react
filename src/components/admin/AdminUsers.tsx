import React from 'react';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { FaCheck, FaTimes, FaEdit } from 'react-icons/fa';
import '../../styles/Admin.scss';

const AdminUsers: React.FC = () => {
  const { 
    users, 
    isLoading, 
    error, 
    handleDeleteUser, 
    editingUser, 
    setEditingUser, 
    handleUpdateUser 
  } = useAdminUsers();

  if (isLoading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2 className="admin-title">
          <i className="fas fa-users admin-icon"></i>
          <span>Upravljanje Korisnicima</span>
        </h2>
        <p className="admin-subtitle">Pregled i administracija svih korisnika sistema</p>
      </header>

      <div className="users-list">
        {users.map(user => (
          <article key={user.id} className="user-card">
            <div className="user-content">
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-type">
                  {user.isTeacher ? 'Učitelj' : user.isParent ? 'Roditelj' : 'Admin'}
                </span>
              </div>
              {editingUser?.id === user.id ? (
                <div className="user-form">
                  <div className="user-inputs">
                    <input
                      type="text"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                      placeholder="Ime"
                      className="user-input user-input--text"
                    />
                    <input
                      type="text"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                      placeholder="Prezime"
                      className="user-input user-input--text"
                    />
                  </div>
                  <div className="user-actions">
                    <button 
                      className="btn btn--save"
                      onClick={() => handleUpdateUser(user.id, editingUser.firstName, editingUser.lastName)}
                    >
                      <FaCheck className="btn__icon" />
                      <span className="btn__text">Sačuvaj</span>
                    </button>
                    <button 
                      className="btn btn--cancel"
                      onClick={() => setEditingUser(null)}
                    >
                      <FaTimes className="btn__icon" />
                      <span className="btn__text">Otkaži</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-display">
                  <span className="user-name">{user.firstName} {user.lastName}</span>
                  <button 
                    className="btn btn--edit"
                    onClick={() => setEditingUser(user)}
                  >
                    <FaEdit className="btn__icon" />
                    <span className="btn__text">Izmeni</span>
                  </button>
                </div>
              )}
            </div>
            <button 
              className="btn btn--delete"
              onClick={() => handleDeleteUser(user.id)}
            >
              Obriši
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers; 