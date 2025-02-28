import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import registerImage from '../../assets/login-register.png';

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"PARENT" | "TEACHER">("PARENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const { register, emailError, passwordError, firstNameError, lastNameError, isLoading, setPasswordError } = useRegister();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Lozinke se ne poklapaju");
      return;
    }

    await register({ email, password, accountType, firstName, lastName });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="welcome-text">Registracija</h1>
        <div className="login-content">
          <div className="login-form">
          <div className="input-group">
              <label htmlFor="firstName">Ime</label>
              <input
                id="firstName"
                type="text"
                className="login-input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && <div className="error-message">{firstNameError}</div>}
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Prezime</label>
              <input
                id="lastName"
                type="text"
                className="login-input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && <div className="error-message">{lastNameError}</div>}
            </div>
            <div className="input-group">
              <label htmlFor="email">E-Adresa</label>
              <input
                id="email"
                type="email"
                className="login-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Šifra</label>
              <input
                id="password"
                type="password"
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Ponovi šifru</label>
              <input
                id="confirmPassword"
                type="password"
                className="login-input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="account-type-container">
              <label>Registrujem se kao:</label>
              <div className="account-type-buttons">
                <button
                  className={`account-type-btn ${accountType === "PARENT" ? "active" : ""}`}
                  onClick={() => setAccountType("PARENT")}
                  type="button"
                >
                  Roditelj
                </button>
                <button
                  className={`account-type-btn ${accountType === "TEACHER" ? "active" : ""}`}
                  onClick={() => setAccountType("TEACHER")}
                  type="button"
                >
                  Učitelj
                </button>
              </div>
            </div>

            <button 
              className="login-button"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? 'Učitavanje...' : 'Registruj se'}
            </button>

            <p className="no-account-text">
              Već imaš nalog? <Link to="/login">Uloguj se</Link>
            </p>
          </div>
          <div className="login-illustration">
            <img src={registerImage} alt="Kids learning" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
