import React, { useState } from 'react';
import { UnresolvedTestResponse, UnresolvedTestItem } from '../../types/game';

interface UnresolvedTestsProps {
  tests: UnresolvedTestResponse[];
  onSubmitTest: (testId: number, answers: Record<number, string>) => void;
}

const UnresolvedTests: React.FC<UnresolvedTestsProps> = ({ tests, onSubmitTest }) => {
  const [answers, setAnswers] = useState<Record<number, Record<number, string>>>({});

  const handleAnswerChange = (testId: number, taskId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [testId]: {
        ...(prev[testId] || {}),
        [taskId]: value
      }
    }));
  };

  const handleSubmit = (testId: number) => {
    const testAnswers = answers[testId] || {};
    onSubmitTest(testId, testAnswers);
  };

  return (
    <div className="unresolved-tests mt-4">
      {tests.map((courseTests) => (
        courseTests.tests.map((test: UnresolvedTestItem) => (
          <div key={test.testId} className="card mb-4 p-4 shadow-sm">
            <h4 className="mb-3">Neriješeni test #{test.testId}</h4>
            <div className="row g-3">
              {test.tasks.map((task) => (
                <div key={task.taskId} className="col-md-6 col-lg-4">
                  <div className="task-item p-3 border rounded">
                    <div className="mb-2">{task.task} = </div>
                    <input
                      type="text"
                      className="form-control"
                      value={answers[test.testId]?.[task.taskId] || ''}
                      onChange={(e) => handleAnswerChange(test.testId, task.taskId, e.target.value)}
                      placeholder="Unesite odgovor"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleSubmit(test.testId)}
            >
              Predaj test
            </button>
          </div>
        ))
      ))}
    </div>
  );
};

export default UnresolvedTests; 