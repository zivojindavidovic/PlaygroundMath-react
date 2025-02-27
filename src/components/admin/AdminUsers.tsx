import React from 'react';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import '../../styles/Admin.scss';

const AdminUsers: React.FC = () => {
  const { users, isLoading, error, handleDeleteUser } = useAdminUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>
          <i className="fas fa-users"></i>
          Upravljanje Korisnicima
        </h2>
        <p>Pregled i administracija svih korisnika sistema</p>
      </div>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <span className="user-type">
                {user.isTeacher ? 'Učitelj' : user.isParent ? 'Roditelj' : 'Admin'}
              </span>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDeleteUser(user.id)}
            >
              Obriši
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers; 