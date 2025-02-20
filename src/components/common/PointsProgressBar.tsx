import React from 'react';
import { FaStar, FaLock, FaCheck } from 'react-icons/fa';
import '../../styles/PointsProgressBar.scss';

interface PointsProgressBarProps {
  currentPoints: number;
  operations: Record<string, number>;
}

const PointsProgressBar: React.FC<PointsProgressBarProps> = ({ currentPoints, operations }) => {
  const maxPoints = Math.max(...Object.values(operations));
  const percentage = (currentPoints / maxPoints) * 100;

  // Sort operations by required points
  const sortedOperations = Object.entries(operations)
    .sort(([, a], [, b]) => a - b);

  return (
    <div className="points-progress-container">
      <div className="points-header">
        <FaStar className="star-icon" />
        <span className="current-points">{currentPoints} poena</span>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          <div className="progress-animation"></div>
        </div>
        
        {sortedOperations.map(([op, points]) => (
          <div 
            key={op}
            className="operation-milestone"
            style={{ 
              left: `${(points / maxPoints) * 100}%`,
            }}
          >
            <div className="milestone-indicator">
              {currentPoints >= points ? (
                <FaCheck className="milestone-icon unlocked" />
              ) : (
                <FaLock className="milestone-icon locked" />
              )}
              <span className="operation-symbol">{op}</span>
              <span className="points-required">{points}p</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsProgressBar; 