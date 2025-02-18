import React, { useEffect, useState } from "react";

import "../styles/AccountList.scss";
import { useNavigate } from "react-router-dom";

interface Account {
  accountId: number;
  username: string;
  points: number;
}

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isTeacher = localStorage.getItem("isTeacher") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken && !isTeacher) {
      fetch(`http://0.0.0.0:8000/api/v1/account/getAll?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.results && data.results.length > 0) {
            setAccounts(data.results[0].accounts);
          } else {
            console.error("No accounts found or data not in expected format.");
          }
        })
        .catch((error) => console.error("Failed to fetch accounts", error));
    }
  }, [isTeacher]);

  return (
    <div className="accounts-list">
      {accounts.length === 0 && (
        <h5 className="alert alert-danger">
          Trenutno nemaš kreiranih naloga dece
        </h5>
      )}
      {accounts.map((account) => (
        <div
          key={account.accountId}
          className="account-card"
          onClick={() => navigate(`/game/${account.accountId}`)}
        >
          <h5 className="account-points">{account.points}</h5>
          <p className="account-username">{account.username}</p>
        </div>
      ))}
    </div>
  );
};

export default AccountList;
