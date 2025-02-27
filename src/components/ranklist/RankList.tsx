import React from "react";
import { useRankList } from "../../hooks/useRankList";
import "../../styles/RankList.scss";

const RankList: React.FC = () => {
  const { rankList, isLoading, error } = useRankList();

  if (isLoading) {
    return (
      <div className="rank-list-container">
        <div className="rank-card">
          <div className="loading-spinner">
            <i className="fas fa-circle-notch fa-spin"></i>
            <span>Učitavanje rang liste...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rank-list-container">
        <div className="rank-card">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rank-list-container">
      <div className="rank-header-main">
        <h2>
          <i className="fas fa-trophy"></i>
          Najbolji Učenici
        </h2>
        <p>Pogledajte ko su naši najuspešniji polaznici</p>
      </div>
      
      <div className="rank-card">
        <div className="rank-list">
          {rankList.map((user, index) => (
            <div 
              key={user.accountId} 
              className={`rank-item ${index < 3 ? `top-${index + 1}` : ''}`}
            >
              <div className="rank-info">
                <div className="rank-number">
                  {index < 3 ? (
                    <i className={`fas fa-${index === 0 ? 'crown' : index === 1 ? 'medal' : 'award'}`}></i>
                  ) : (
                    index + 1
                  )}
                </div>
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