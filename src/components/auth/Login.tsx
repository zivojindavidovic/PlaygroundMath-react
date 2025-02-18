import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuth();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="welcome-text">Dobro došli!</h1>
        <div className="login-content">
          <div className="login-form">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="input-group">
              <label htmlFor="email">E-Adresa</label>
              <input
                id="email"
                type="email"
                className="login-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
            </div>
            <button 
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Učitavanje...' : 'Prijavi se'}
            </button>
            <p className="no-account-text">
              Nemaš registrovan nalog? <Link to="/register">Registruj se</Link>
            </p>
          </div>
          <div className="login-illustration">
            <img src="/path-to-your-kids-illustration.png" alt="Kids learning" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 