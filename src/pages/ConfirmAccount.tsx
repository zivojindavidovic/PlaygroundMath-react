import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmAccount: React.FC = () => {
  const [message, setMessage] = useState("Confirming your account...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirmUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("No token found in URL");
        return;
      }

      try {
        const response = await fetch("http://0.0.0.0:8000/api/v1/user/confirm", {
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
          setMessage("Account confirmed");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setMessage("Token expired, we sent you a new email.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong. Please try again later.");
      }
    };

    confirmUser();
  }, [navigate]);

  return <div>{message}</div>;
};

export default ConfirmAccount;
