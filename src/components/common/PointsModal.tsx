import React from 'react';
import { FaStar, FaTrophy, FaAward } from 'react-icons/fa';
import '../../styles/PointsModal.scss';

interface PointsModalProps {
  pointsFromTest: number;
  totalPoints: number;
  onClose: () => void;
}

const PointsModal: React.FC<PointsModalProps> = ({ pointsFromTest, totalPoints, onClose }) => {
  return (
    <div className="points-modal-overlay">
      <div className="points-modal-content">
        <div className="points-animation">
          {[...Array(3)].map((_, i) => (
            <FaStar key={i} className={`star star-${i + 1}`} />
          ))}
          <FaTrophy className="trophy" />
        </div>
        
        <h2>Čestitamo!</h2>
        <div className="points-info">
          <div className="test-points">
            <FaAward className="award-icon" />
            <p>Osvojili ste</p>
            <h3>{pointsFromTest} poena</h3>
            <p>na ovom testu!</p>
          </div>
          
          <div className="total-points">
            <p>Ukupno imate</p>
            <h3>{totalPoints} poena</h3>
          </div>
        </div>
        
        <button className="close-button" onClick={onClose}>
          Super!
        </button>
      </div>
    </div>
  );
};

export default PointsModal; 