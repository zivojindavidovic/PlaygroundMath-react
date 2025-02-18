import React from "react";
import { useRankList } from "../../hooks/useRankList";
import "../../styles/RankList.scss";

const RankList: React.FC = () => {
  const { rankList, isLoading, error } = useRankList();

  if (isLoading) {
    return (
      <div className="rank-list-container">
        <div className="rank-card">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rank-list-container">
        <div className="rank-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rank-list-container">
      <div className="rank-card">
        <div className="rank-header">
          <h2>Rang Lista</h2>
          <p>Top učenici i njihovi poeni</p>
        </div>
        
        <div className="rank-list">
          {rankList.map((user, index) => (
            <div 
              key={user.accountId} 
              className={`rank-item ${index < 3 ? `top-${index + 1}` : ''}`}
            >
              <div className="rank-info">
                <span className="rank-number">{index + 1}</span>
                <span className="username">{user.username}</span>
              </div>
              <div className="points">
                <span className="points-value">{user.points}</span>
                <span className="points-label">poena</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankList; 