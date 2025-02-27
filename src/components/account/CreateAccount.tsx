import React from "react";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import "../../styles/CreateAccount.scss";

const CreateAccount: React.FC = () => {
  const {
    username,
    age,
    formErrors,
    errorMessage,
    isLoading,
    setUsername,
    setAge,
    handleCreateAccount,
  } = useCreateAccount();

  return (
    <div className="create-account-container">
      <div className="create-account-header">
        <h2>
          <i className="fas fa-user-plus"></i>
          Kreiraj Nalog
        </h2>
        <p>Dodajte novi korisnički nalog za dete</p>
      </div>

      <div className="create-account-card">
        <div className="create-account-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
              Korisničko ime deteta
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${formErrors.username ? 'error' : ''}`}
              placeholder="peradetlic01"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {formErrors.username && (
              <div className="error-message">{formErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="age">
              <i className="fas fa-birthday-cake"></i>
              Godine deteta
            </label>
            <select
              id="age"
              className={`form-input ${formErrors.age ? 'error' : ''}`}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 3} value={i + 3}>
                  {i + 3}
                </option>
              ))}
            </select>
            {formErrors.age && (
              <div className="error-message">{formErrors.age}</div>
            )}
          </div>

          {errorMessage && (
            <div className="error-message" style={{ marginBottom: '15px', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}

          <button
            className="submit-button"
            onClick={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Kreiranje...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Kreiraj nalog
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount; 