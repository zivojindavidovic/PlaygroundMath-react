import React, { useEffect, useState } from "react";

interface RankUser {
  accountId: number;
  username: string;
  points: number;
}

const RankList: React.FC = () => {
  const [rankList, setRankList] = useState<RankUser[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    fetch("http://0.0.0.0:8000/api/v1/account/rankList", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRankList(data))
      .catch((error) => console.error("Failed to fetch rank list", error));
  }, []);

  return (
    <div className="rank-list">
      <div className="card p-4 shadow-sm">
      <h5 className="alert alert-primary">
          Rang lista
        </h5>
        <ul className="list-group">
          {rankList.map((user, index) => (
            <li
              key={user.accountId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {index + 1}. {user.username}
              </span>
              <span className="badge bg-primary">{user.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RankList;
