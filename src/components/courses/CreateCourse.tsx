import React from "react";
import { useCreateCourse } from "../../hooks/useCreateCourse";
import "../../styles/CreateCourse.scss";

const CreateCourse: React.FC = () => {
  const {
    age,
    dueDate,
    isLoading,
    title,
    description,
    setAge,
    setDueDate,
    setTitle,
    setDescription,
    handleCreateCourse
  } = useCreateCourse();

  return (
    <div className="create-course-container">
      <div className="create-course-card">
        <div className="create-course-header">
          <h2>Kreiraj Kurs</h2>
          <p>Unesite podatke za novi kurs</p>
        </div>

        <div className="input-group">
              <label htmlFor="courseTitle">Naziv kursa</label>
              <input
                id="courseTitle"
                type="text"
                className="login-input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* {emailError && <div className="error-message">{emailError}</div>} */}
        </div>

        <div className="input-group">
              <label htmlFor="courseDescription">Opis kursa</label>
              <textarea
                id="courseDescription"
                className="login-input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* {emailError && <div className="error-message">{emailError}</div>} */}
        </div>

        <div className="create-course-form">
          <div className="form-group">
            <label htmlFor="age">Godine za koje je kurs namenjen</label>
            <select
              id="age"
              className="form-input"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Datum završetka kursa</label>
            <input
              id="dueDate"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button
            className="submit-button"
            onClick={handleCreateCourse}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Kreiranje...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Kreiraj kurs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse; 