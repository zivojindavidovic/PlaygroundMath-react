import React, { useState } from "react";

import userImage from "../assets/profile.png";

import "../styles/LoginComponent.scss";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"PARENT" | "TEACHER">(
    "PARENT"
  );

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Lozinke se ne poklapaju");
      return;
    }

    try {
      const requestBody: {
        email: string;
        password: string;
        accountType?: "PARENT" | "TEACHER";
      } = {
        email,
        password,
      };

      requestBody.accountType = accountType;

      const response = await fetch("http://0.0.0.0:8000/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Registracija je uspela. Proveri svoju e-adresu kako bi potvrdio kreiranje naloga.",
          { autoClose: 2000 }
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((errObj: Record<string, string>) => {
            if (errObj.email) {
              setEmailError(errObj.email);
            }
            if (errObj.password) {
              setPasswordError(errObj.password);
            }
          });
        }
      }
    } catch (error) {
      toast.error("Registracija nije uspela. Pokušaj ponovo kasnije.", {
        autoClose: 2000,
      });
    }
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
          className={`btn ${
            accountType === "PARENT" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setAccountType("PARENT")}
        >
          Roditelj
        </button>
        <button
          className={`btn ms-2 ${
            accountType === "TEACHER" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setAccountType("TEACHER")}
        >
          Učitelj
        </button>
      </div>

      <p className="no-account-text">
        Već imaš nalog? <Link to={"/login"}>Uloguj se</Link>
      </p>
      <button className="login-button" onClick={handleRegister}>
        Registruj se
      </button>
    </div>
  );
};

export default RegisterComponent;
