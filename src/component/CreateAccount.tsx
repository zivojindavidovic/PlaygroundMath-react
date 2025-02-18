import React, { useState } from "react";

import "../styles/CreateAccount.scss";
import { useNavigate } from "react-router-dom";

const CreateAccount: React.FC = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(3);
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    age?: string;
  }>({});
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    setFormErrors({});

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        "http://0.0.0.0:8000/api/v1/account/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ username, age }),
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/accounts")
      } else {
        const newFormErrors: { username?: string; age?: string } = {};

        data.errors.forEach((errorObj: any) => {
          if (errorObj.username) {
            newFormErrors.username = errorObj.username;
          }
          if (errorObj.age) {
            newFormErrors.age = errorObj.age;
          }
        });

        setFormErrors(newFormErrors);
      }
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  return (
    <div className="create-user-form">
      <label htmlFor="username">Korisničko ime deteta</label>
      <input
        className="input-field"
        id="username"
        type="text"
        placeholder="peradetlic01"
        onChange={(e) => setUsername(e.target.value)}
      />
      {formErrors.username && (
        <div className="alert alert-danger mb-2 username-error">{formErrors.username}</div>
      )}
      <label htmlFor="age">Godine deteta</label>
      <select
        id="age"
        className="input-field"
        onChange={(e) => setAge(Number(e.target.value))}
      >
        {[...Array(10).keys()].slice(2).map((i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <button className="input-field-btn" onClick={handleCreateAccount}>
        Kreiraj nalog deteta
      </button>
    </div>
  );
};

export default CreateAccount;
