import React, { useState } from 'react';
import { useChildCourses } from '../../hooks/useChildCourses';
import TestPreviewModal from './TestPreviewModal';
import './ReviewChildCourses.scss';

interface SelectedCourse {
  accountId: number;
  courseId: number;
}

const ReviewChildCourses: React.FC = () => {
  const userId = localStorage.getItem('userId') || '';
  const { accounts, isLoading, error } = useChildCourses(userId);
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null);

  const handleCourseClick = (accountId: number, courseId: number) => {
    setSelectedCourse({ accountId, courseId });
  };

  if (isLoading) {
    return (
      <div className="review-child-courses">
        <div className="loading">Učitavanje kurseva...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-child-courses">
        <div className="error">Greška pri učitavanju kurseva: {error}</div>
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="review-child-courses">
        <h2>Istorija kurseva</h2>
        <div className="no-courses">Nema aktivnih kurseva za vaše naloge.</div>
      </div>
    );
  }

  return (
    <div className="review-child-courses">
      <h2>Istorija kurseva</h2>
      <div className="accounts-container">
        {accounts.map((account) => (
          <div key={account.accountId} className="account-card">
            <h3>Nalog ID: {account.accountId}</h3>
            <div className="courses-grid">
              {account.courses.map((course) => (
                <div
                  key={course.courseId}
                  className="course-card"
                  onClick={() => handleCourseClick(account.accountId, course.courseId)}
                  role="button"
                  tabIndex={0}
                >
                  <h4>Kurs ID: {course.courseId}</h4>
                  <div className="course-stats">
                    <div className="stat">
                      <span>Ukupno testova:</span>
                      <span>{course.courseTestsCount}</span>
                    </div>
                    <div className="stat">
                      <span>Rešeno testova:</span>
                      <span>{course.accountSolvedTestsCount}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ 
                          width: `${(course.accountSolvedTestsCount / course.courseTestsCount) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <TestPreviewModal
          isOpen={true}
          onClose={() => setSelectedCourse(null)}
          accountId={selectedCourse.accountId}
          courseId={selectedCourse.courseId}
        />
      )}
    </div>
  );
};

export default ReviewChildCourses; 