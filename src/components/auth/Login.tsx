import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import userImage from "../../assets/profile.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuth();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <div className="login">
      <img src={userImage} alt="Logo img" className="login-user-image"/>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="email"
        placeholder="E-Adresa"
        className="login-input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Šifra"
        className="login-input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className="no-account-text">
        Nemaš registrovan nalog? <Link to="/register">Registruj se</Link>
      </p>
      <button 
        className="login-button"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Učitavanje...' : 'Prijavi se'}
      </button>
    </div>
  );
};

export default Login; 