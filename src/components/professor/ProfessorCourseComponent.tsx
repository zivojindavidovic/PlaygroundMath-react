import React, { useState } from 'react';
import { useProfessorCourse } from '../../hooks/useProfessorCourse';
import ProfessorGame from '../game/ProfessorGame';
import './ProfessorCourseComponent.scss';

const ProfessorCourseComponent: React.FC = () => {
  const { courseData, isLoading, error } = useProfessorCourse();
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);

  const toggleAccount = (accountId: number) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };

  return (
    <div className="professor-course-container">
      <div className="game-section">
        <ProfessorGame />
      </div>

      <div className="professor-course">
        {isLoading && (
          <div className="loading">Učitavanje kursa...</div>
        )}

        {error && (
          <div className="error">Greška: {error}</div>
        )}

        {courseData && (
          <>
            <section className="course-section accounts-section">
              <h2>Polaznici kursa</h2>
              <div className="accounts-list">
                {courseData.accounts.map((account) => (
                  <div key={account.accountId} className="account-item">
                    <div 
                      className="account-header"
                      onClick={() => toggleAccount(account.accountId)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="username">{account.username}</span>
                      <i className={`fas fa-chevron-${expandedAccount === account.accountId ? 'up' : 'down'}`} />
                    </div>
                    {expandedAccount === account.accountId && (
                      <div className="account-details">
                        <div className="progress-info">
                          <span>Rešeni testovi:</span>
                          <span className="solved-count">{account.solvedTest} od {courseData.totalTests}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress"
                            style={{ width: `${(account.solvedTest / courseData.totalTests) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="course-section tests-section">
              <h2>Trenutni testovi</h2>
              <div className="tests-grid">
                {courseData.tests.map((test) => (
                  <div key={test.testId} className={`test-card ${test.isCompleted ? 'completed' : ''}`}>
                    <div className="test-header">
                      <h3>Test {test.testId}</h3>
                      <span className={`status-badge ${test.isCompleted ? 'completed' : 'pending'}`}>
                        {test.isCompleted ? 'Završen' : 'U toku'}
                      </span>
                    </div>
                    <div className="tasks-list">
                      {test.tasks.map((task) => (
                        <div key={task.taskId} className="task-item">
                          {task.task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfessorCourseComponent;
