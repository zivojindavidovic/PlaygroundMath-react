import React, { useEffect, useState } from 'react';
import { Test } from '../../types/courses';
import { CoursesService } from '../../services/coursesService';
import './TestPreviewModal.scss';

interface TestPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number;
  courseId: number;
}

const TestPreviewModal: React.FC<TestPreviewModalProps> = ({
  isOpen,
  onClose,
  accountId,
  courseId,
}) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const response = await CoursesService.getAccountTests(accountId, courseId);
        setTests(response.tests);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tests');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTests();
    }
  }, [isOpen, accountId, courseId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h3>Pregled testova za kurs {courseId}</h3>
        
        {isLoading && <div className="modal-loading">Učitavanje testova...</div>}
        
        {error && <div className="modal-error">Greška: {error}</div>}
        
        {!isLoading && !error && tests.map(test => (
          <div key={test.testId} className={`test-card ${test.isCompleted ? 'completed' : ''}`}>
            <div className="test-header">
              <h4>Test {test.testId}</h4>
              <span className={`status-badge ${test.isCompleted ? 'completed' : 'pending'}`}>
                {test.isCompleted ? 'Završen' : 'Nije završen'}
              </span>
            </div>
            
            <div className="tasks-grid">
              {test.tasks.map(task => (
                <div key={task.taskId} className="task-item">
                  {task.task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPreviewModal; 