import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import userImage from "../../assets/profile.png";
import "../../styles/LoginComponent.scss";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"PARENT" | "TEACHER">("PARENT");
  
  const { register, emailError, passwordError, isLoading, setPasswordError } = useRegister();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setPasswordError("Lozinke se ne poklapaju");
      return;
    }

    await register({ email, password, accountType });
  };

  return (
    <div className="login">
      <img src={userImage} alt="Logo img" className="login-user-image" />
      <input
        type="email"
        placeholder="E-Adresa"
        className="login-input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <div className="alert alert-danger">{emailError}</div>}
      <input
        type="password"
        placeholder="Šifra"
        className="login-input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <div className="alert alert-danger password-error">{passwordError}</div>}
      <input
        type="password"
        placeholder="Ponovi šifru"
        className="login-input-field"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="register-account-type">
        <span className="account-type-label">Registrujem se kao:</span>
        <button
          className={`btn ${accountType === "PARENT" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setAccountType("PARENT")}
        >
          Roditelj
        </button>
        <button
          className={`btn ms-2 ${accountType === "TEACHER" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setAccountType("TEACHER")}
        >
          Učitelj
        </button>
      </div>

      <p className="no-account-text">
        Već imaš nalog? <Link to="/login">Uloguj se</Link>
      </p>
      <button 
        className="login-button" 
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? 'Učitavanje...' : 'Registruj se'}
      </button>
    </div>
  );
};

export default Register;
