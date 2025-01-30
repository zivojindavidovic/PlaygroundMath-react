import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import CreateCourse from "../component/CreateCourse";
import CourseList from "../component/CourseList";

interface Account {
  accountId: number;
  username: string;
  points: number;
}

interface Teacher {
  teacherId: number;
  teacherEmail: string;
  numberOfActiveCourses: number;
}

const Home: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(1);
  const navigate = useNavigate();
  const isTeacher = localStorage.getItem("isTeacher") === "true";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken && !isTeacher) {
      fetch(`http://0.0.0.0:8000/api/v1/account/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => setAccounts(data.accounts))
        .catch(error => console.error("Failed to fetch accounts", error));
    }
  }, [isTeacher]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isTeacher) {
      fetch("http://0.0.0.0:8000/api/v1/user/teachers", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => setTeachers(data))
        .catch(error => console.error("Failed to fetch teachers", error));
    }
  }, [isTeacher]);

  const handleCreateUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ username, age })
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/account/delete/${accountId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      setAccounts(accounts.filter(account => account.accountId !== accountId));
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  return (
    <div>
      <Header />
      {!isTeacher ? (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="border p-3 shadow-sm rounded bg-light">
                <h3 className="text-center mb-3">Accounts</h3>
                {accounts.map(account => (
                  <div
                    key={account.accountId}
                    className="card mb-3 shadow-sm border-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/account/${account.accountId}`)}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">{account.username}</h5>
                        <p className="card-text">Points: {account.points}</p>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAccount(account.accountId);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {accounts.length < 3 && (
                  <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>
                    Add Account
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="border p-3 shadow-sm rounded bg-light h-100">
                <h3 className="text-center mb-3">Teachers</h3>
                {teachers.map(teacher => (
                  <div
                    key={teacher.teacherId}
                    className="card mb-3 shadow-sm border-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/teacher/${teacher.teacherId}`)}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">{teacher.teacherEmail}</h5>
                        <p className="card-text">Active Courses: {teacher.numberOfActiveCourses}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">
              <CreateCourse />
            </div>
            <div className="col-md-6">
              <CourseList />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Account</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <select
                  className="form-control mb-2"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                >
                  {[...Array(10).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button className="btn btn-success w-100" onClick={handleCreateUser}>
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
