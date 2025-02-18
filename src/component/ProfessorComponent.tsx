import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Course {
  courseId: number;
  age: number;
  dueDate: string;
}

interface Account {
  accountId: number;
  username: string;
  points: number;
}

const ProfessorComponent: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | "">("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!teacherId || !accessToken) return;

    fetch(`http://0.0.0.0:8000/api/v1/course/all?professorId=${teacherId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data: Course[]) => {
        setCourses(data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [teacherId]);

  const handleApply = (courseId: number) => {
    setSelectedCourseId(courseId);
    setShowModal(true);

    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!userId || !accessToken) return;

    fetch(`http://0.0.0.0:8000/api/v1/account/getAll?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && data.results && data.results.length > 0) {
          setAccounts(data.results[0].accounts);
        }
      })
      .catch((error) => console.error("Error fetching accounts:", error));
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccountId(Number(event.target.value));
  };

  const handleSendApplication = async (courseId: number | null) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/course/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          courseId,
          accountId: selectedAccountId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to apply for course");
      }

      // const data = await response.json();
      // if (data.message === "Application sent successfully") {
      //   setAppliedCourses(prev => [...prev, courseId]);
      // }
    } catch (error) {
      console.error("Error applying for course:", error);
    }
    setShowModal(false);
  };

  return (
    <div className="professor-courses">
      {courses.length === 0 && (
        <h5 className="alert alert-danger">
          Ovaj profesor trenutno nema aktivnih kurseva
        </h5>
      )}
      {courses.map((course) => (
        <div
          key={course.courseId}
          className="card mb-3 shadow-sm"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title">Kurs namenjan za uzrast: {course.age}</h5>
              <p className="card-text">
                Kurs ističe: {new Date(course.dueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleApply(course.courseId)}
            >
              Apliciraj
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apliciraj</h5>
              </div>
              <div className="modal-body">
                <label htmlFor="accountSelect">Odaberite korisnika:</label>
                <select
                  id="accountSelect"
                  className="form-control"
                  value={selectedAccountId}
                  onChange={handleAccountChange}
                >
                  <option value="" disabled>
                    -
                  </option>
                  {accounts.map((account) => (
                    <option key={account.accountId} value={account.accountId}>
                      {account.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Zatvori
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSendApplication(selectedCourseId)}
                >
                  Pošalji aplikaciju
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorComponent;
