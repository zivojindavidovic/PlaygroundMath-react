import React, { useState, useEffect } from "react";
import "../../styles/AdminTeacherCourses.scss";

interface Task {
  taskId: number;
  task: string;
}

interface Test {
  testId: number;
  tasks: Task[];
}

interface Course {
  courseId: number;
  courseName: string;
  courseDescription: string;
  courseAge: number;
  tests: Test[];
}

interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  email: string;
  courses: Course[];
}

interface DeleteModal {
  show: boolean;
  type: 'course' | 'test';
  itemId: number | null;
}

const AdminTeacherCourses: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTeachers, setExpandedTeachers] = useState<number[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({
    show: false,
    type: 'course',
    itemId: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  const fetchTeacherCourses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://0.0.0.0:8000/api/v1/admin/teacher-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teacher courses");
      }

      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacher = (teacherId: number) => {
    setExpandedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const toggleCourse = (courseId: number) => {
    setExpandedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleDelete = async () => {
    if (!deleteModal.itemId) return;

    const token = localStorage.getItem("accessToken");
    const endpoint = deleteModal.type === 'course' 
      ? `http://0.0.0.0:8000/api/v1/admin/course/${deleteModal.itemId}`
      : `http://0.0.0.0:8000/api/v1/admin/test/${deleteModal.itemId}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (result === true) {
        setSuccessMessage(deleteModal.type === 'course' 
          ? "Kurs je uspešno izbrisan"
          : "Test je uspešno izbrisan"
        );
        await fetchTeacherCourses(); // Refresh the data
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteModal({ show: false, type: 'course', itemId: null });
      
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-courses-container">
        <div className="loading-spinner">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Učitavanje kurseva...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-courses-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-courses-container">
      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>{successMessage}</span>
        </div>
      )}

      <div className="admin-courses-header">
        <h2>
          <i className="fas fa-book-reader"></i>
          Upravljanje Kursevima
        </h2>
        <p>Pregled i upravljanje svim kursevima profesora</p>
      </div>

      <div className="teachers-list">
        {teachers.map((teacher) => (
          <div key={teacher.teacherId} className="teacher-card">
            <div 
              className="teacher-header"
              onClick={() => toggleTeacher(teacher.teacherId)}
            >
              <div className="teacher-info">
                <i className="fas fa-user-tie"></i>
                <div className="teacher-details">
                  <h3>{teacher.firstName} {teacher.lastName}</h3>
                  <span className="teacher-email">{teacher.email}</span>
                </div>
              </div>
              <i className={`fas fa-chevron-${expandedTeachers.includes(teacher.teacherId) ? 'up' : 'down'}`}></i>
            </div>

            {expandedTeachers.includes(teacher.teacherId) && (
              <div className="courses-list">
                {teacher.courses.map((course) => (
                  <div key={course.courseId} className="course-card">
                    <div 
                      className="course-header"
                      onClick={() => toggleCourse(course.courseId)}
                    >
                      <div className="course-info">
                        <i className="fas fa-book"></i>
                        <div className="course-details">
                          <h4>{course.courseName}</h4>
                          <span className="course-age">{course.courseAge} godine</span>
                        </div>
                      </div>
                      <div className="course-actions">
                        <button 
                          className="delete-button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({
                              show: true,
                              type: 'course',
                              itemId: course.courseId
                            });
                          }}
                        >
                          <i className="fas fa-trash-alt"></i>
                          Obriši kurs
                        </button>
                        <i className={`fas fa-chevron-${expandedCourses.includes(course.courseId) ? 'up' : 'down'}`}></i>
                      </div>
                    </div>

                    {expandedCourses.includes(course.courseId) && (
                      <div className="course-content">
                        <p className="course-description">{course.courseDescription}</p>
                        
                        <div className="tests-list">
                          {course.tests.map((test) => (
                            <div key={test.testId} className="test-card">
                              <div className="test-header">
                                <div className="test-info">
                                  <i className="fas fa-clipboard-list"></i>
                                  <span>Test #{test.testId}</span>
                                </div>
                                <button 
                                  className="delete-button"
                                  onClick={() => {
                                    setDeleteModal({
                                      show: true,
                                      type: 'test',
                                      itemId: test.testId
                                    });
                                  }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                  Obriši test
                                </button>
                              </div>
                              <div className="tasks-list">
                                {test.tasks.map((task) => (
                                  <div key={task.taskId} className="task-item">
                                    <span className="task-number">#{task.taskId}</span>
                                    <span className="task-content">{task.task}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          {course.tests.length === 0 && (
                            <p className="no-tests">Nema dostupnih testova</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Potvrda brisanja</h3>
              <button 
                className="close-button"
                onClick={() => setDeleteModal({ show: false, type: 'course', itemId: null })}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>
                {deleteModal.type === 'course' 
                  ? "Da li si siguran da želiš da obrišeš kurs? Ovim brišeš i sve testove povezane sa kursom."
                  : "Da li stvarno želiš da obrišeš test?"
                }
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setDeleteModal({ show: false, type: 'course', itemId: null })}
              >
                <i className="fas fa-times"></i>
                Otkaži
              </button>
              <button 
                className="confirm-button"
                onClick={handleDelete}
              >
                <i className="fas fa-trash-alt"></i>
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherCourses; 