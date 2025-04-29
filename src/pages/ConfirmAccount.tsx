import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ConfirmAccount.scss";

const ConfirmAccount: React.FC = () => {
  const [message, setMessage] = useState("Potvrđujemo vaš nalog...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirmUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("Token nije pronađen u URL-u");
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("http://local.kotlin/api/v1/user/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: token,
        });

        if (!response.ok) {
          throw new Error("Network response was not OK");
        }

        const data: boolean = await response.json();

        if (data) {
          setMessage("Nalog je uspešno potvrđen!");
          setStatus("success");
        } else {
          setMessage("Token je istekao, poslali smo vam novi email.");
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
        setMessage("Došlo je do greške. Molimo pokušajte ponovo kasnije.");
        setStatus("error");
      }
    };

    confirmUser();
  }, []);

  return (
    <div className="confirm-container">
      <div className="confirm-card">
        <div className={`confirm-icon ${status}`}>
          {status === "loading" && <i className="fas fa-spinner fa-spin"></i>}
          {status === "success" && <i className="fas fa-check-circle"></i>}
          {status === "error" && <i className="fas fa-exclamation-circle"></i>}
        </div>
        <h2 className={`confirm-message ${status}`}>{message}</h2>
        {status === "success" && (
          <Link to="http://local.react/login" className="login-link">
            Prijavi se
          </Link>
        )}
      </div>
    </div>
  );
};

export default ConfirmAccount;
