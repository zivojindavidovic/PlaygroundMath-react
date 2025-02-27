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
      <div className="create-header-main">
        <h2>
          <i className="fas fa-chalkboard-teacher"></i>
          Novi Kurs
        </h2>
        <p>Kreirajte novi kurs i započnite edukativno putovanje</p>
      </div>

      <div className="create-course-card">
        <div className="create-course-form">
          <div className="form-group">
            <label htmlFor="courseTitle">
              <i className="fas fa-heading"></i>
              Naziv kursa
            </label>
            <input
              id="courseTitle"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Unesite naziv kursa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseDescription">
              <i className="fas fa-align-left"></i>
              Opis kursa
            </label>
            <textarea
              id="courseDescription"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Unesite opis kursa"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">
              <i className="fas fa-user-graduate"></i>
              Godine za koje je kurs namenjen
            </label>
            <select
              id="age"
              className="form-input"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i + 3} value={i + 3}>
                  {i + 3} godine
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              <i className="fas fa-calendar-alt"></i>
              Datum završetka kursa
            </label>
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
                <i className="fas fa-spinner fa-spin"></i>
                Kreiranje...
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                Kreiraj kurs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse; 