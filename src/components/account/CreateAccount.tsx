import React from "react";
import { useCreateAccount } from "../../hooks/useCreateAccount";
import "../../styles/CreateAccount.scss";

const CreateAccount: React.FC = () => {
  const {
    username,
    age,
    formErrors,
    isLoading,
    setUsername,
    setAge,
    handleCreateAccount,
  } = useCreateAccount();

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <div className="create-account-header">
          <h2>Kreiraj Nalog Deteta</h2>
          <p>Unesite podatke za novi nalog</p>
        </div>

        <div className="create-account-form">
          <div className="form-group">
            <label htmlFor="username">Korisničko ime deteta</label>
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
            <label htmlFor="age">Godine deteta</label>
            <select
              id="age"
              className={`form-input ${formErrors.age ? 'error' : ''}`}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {formErrors.age && (
              <div className="error-message">{formErrors.age}</div>
            )}
          </div>

          <button
            className="submit-button"
            onClick={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? "Kreiranje..." : "Kreiraj nalog deteta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount; 