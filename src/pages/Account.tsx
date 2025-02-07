import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../component/Header";
import jsPDF from "jspdf";

interface RankUser {
  accountId: number;
  username: string;
  points: number;
}

// Response shape for tasks
interface TaskResponse {
  type: string;
  tasks: any;
}

// An online task
interface OnlineTask {
  taskId: number;
  task: string;
}

// A course (as given by the API)
interface Course {
  courseId: number;
  courseAge: number;
}

const Account: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  const [numberOneFrom, setNumberOneFrom] = useState<number>(1);
  const [numberOneTo, setNumberOneTo] = useState<number>(10);
  const [numberTwoFrom, setNumberTwoFrom] = useState<number>(1);
  const [numberTwoTo, setNumberTwoTo] = useState<number>(10);
  const [testType, setTestType] = useState<"online" | "pdf">("online");
  const [operations, setOperations] = useState<string[]>([]);
  const [rankList, setRankList] = useState<RankUser[]>([]);
  const [pdfTasks, setPdfTasks] = useState<string[]>([]);
  const [onlineTasks, setOnlineTasks] = useState<OnlineTask[]>([]);
  const [onlineResponses, setOnlineResponses] = useState<Record<number, string>>(
    {}
  );
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch the rank list
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    fetch("http://0.0.0.0:8000/api/v1/account/rankList", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRankList(data))
      .catch((error) => console.error("Failed to fetch rank list", error));
  }, []);

  // Fetch courses
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:8000/api/v1/course/${accountId}/list`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch online tasks if testType is "online"
  useEffect(() => {
    const fetchOnlineTasks = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      try {
        const response = await fetch("http://0.0.0.0:8000/api/v1/task/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ accountId: Number(accountId) }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch online tasks");
        }
        const data: TaskResponse = await response.json();
        if (data.type === "online") {
          setOnlineTasks(data.tasks || []);
          setOnlineResponses({});
        } else {
          setOnlineTasks([]);
        }
      } catch (error) {
        console.error("Error fetching online tasks:", error);
        setOnlineTasks([]);
      }
    };

    if (testType === "online") {
      setPdfTasks([]);
      fetchOnlineTasks();
    } else {
      setOnlineTasks([]);
    }
  }, [testType, accountId]);

  // Toggle operation in operations array
  const toggleOperation = (op: string) => {
    setOperations((prevOps) =>
      prevOps.includes(op) ? prevOps.filter((o) => o !== op) : [...prevOps, op]
    );
  };

  // Create tasks (either PDF or online) based on inputs
  const handleCreateTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          numberOneFrom,
          numberOneTo,
          numberTwoFrom,
          numberTwoTo,
          testType,
          accountId: Number(accountId),
          operations,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tasks");
      }
      const data: TaskResponse = await response.json();
      if (data.type === "pdf") {
        setPdfTasks(data.tasks as string[]);
      } else if (data.type === "online") {
        setOnlineTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error creating tasks:", error);
    }
  };

  // Download the PDF tasks
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Ime:", 10, 20);
    doc.line(25, 20, 90, 20);
    doc.text("Datum:", 140, 20);
    doc.line(160, 20, 190, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Zadaci:", 90, 40);

    const leftTasks = pdfTasks.slice(0, 10);
    const rightTasks = pdfTasks.slice(10, 20);

    doc.setFontSize(12);
    leftTasks.forEach((task, index) => {
      doc.text(task, 20, 60 + index * 10);
    });
    rightTasks.forEach((task, index) => {
      doc.text(task, 110, 60 + index * 10);
    });

    doc.save(`tasks_${accountId}.pdf`);
  };

  // Handle changes for online task responses
  const handleOnlineResponseChange = (taskId: number, value: string) => {
    setOnlineResponses((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  // Submit (solve) online tasks
  const handleSubmitOnlineTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    try {
      const answersObject: Record<string, string> = {};
      Object.keys(onlineResponses).forEach((key) => {
        answersObject[key] = onlineResponses[parseInt(key, 10)];
      });
      const response = await fetch("http://0.0.0.0:8000/api/v1/task/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          testAnswers: [answersObject],
          accountId: Number(accountId),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to solve tasks");
      }
      const data = await response.json();
      alert(`You won ${data.pointsFromTest} points from this test!`);
    } catch (error) {
      console.error("Error submitting tasks:", error);
    }
  };

  const isCreateTasksDisabled = testType === "online" && onlineTasks.length > 0;

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="row mt-4">
          {/* Left column (Task creation, PDF/Online tasks) */}
          <div className="col-md-7">
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3">Task Settings</h4>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Number One From</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOneFrom}
                    onChange={(e) => setNumberOneFrom(Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Number One To</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOneTo}
                    onChange={(e) => setNumberOneTo(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Number Two From</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberTwoFrom}
                    onChange={(e) => setNumberTwoFrom(Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Number Two To</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberTwoTo}
                    onChange={(e) => setNumberTwoTo(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="testTypeToggle"
                  checked={testType === "pdf"}
                  onChange={() =>
                    setTestType(testType === "online" ? "pdf" : "online")
                  }
                />
                <label className="form-check-label" htmlFor="testTypeToggle">
                  {testType === "online" ? "Online" : "PDF"}
                </label>
              </div>
              <div className="mb-3">
                <h6>Select Operations:</h6>
                {["+", "-", "*", "/"].map((op) => (
                  <div key={op} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`operation-${op}`}
                      checked={operations.includes(op)}
                      onChange={() => toggleOperation(op)}
                    />
                    <label className="form-check-label" htmlFor={`operation-${op}`}>
                      {op}
                    </label>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleCreateTasks}
                disabled={isCreateTasksDisabled}
              >
                Create Tasks
              </button>
            </div>

            {/* PDF tasks preview and download */}
            {testType === "pdf" && pdfTasks.length > 0 && (
              <div
                className="mt-4 border p-4 bg-white shadow-sm position-relative"
                style={{ height: "29.7cm", width: "21cm", padding: "20px" }}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>Ime:</strong>{" "}
                    <span
                      className="border-bottom d-inline-block"
                      style={{ width: "200px" }}
                    ></span>
                  </div>
                  <div>
                    <strong>Datum:</strong>{" "}
                    <span
                      className="border-bottom d-inline-block"
                      style={{ width: "150px" }}
                    ></span>
                  </div>
                </div>
                <h4 className="text-center mt-3">Zadaci:</h4>
                <div className="row mt-3">
                  <div className="col-md-6">
                    {pdfTasks.slice(0, 10).map((task, index) => (
                      <p key={index} className="fs-5">
                        {task}
                      </p>
                    ))}
                  </div>
                  <div className="col-md-6">
                    {pdfTasks.slice(10, 20).map((task, index) => (
                      <p key={index} className="fs-5">
                        {task}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-end mt-4">
                  <button className="btn btn-success" onClick={handleDownloadPDF}>
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            {/* Online tasks list */}
            {testType === "online" && onlineTasks.length > 0 && (
              <div className="mt-4 card p-4 bg-white shadow-sm">
                <h5 className="mb-3">Unresolved Tasks</h5>
                {onlineTasks.map((taskObj, index) => (
                  <div
                    key={taskObj.taskId}
                    className="d-flex align-items-center mb-3"
                  >
                    <span className="me-3">
                      {index + 1}. {taskObj.task}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "120px" }}
                      placeholder="Your answer"
                      value={onlineResponses[taskObj.taskId] || ""}
                      onChange={(e) =>
                        handleOnlineResponseChange(taskObj.taskId, e.target.value)
                      }
                    />
                  </div>
                ))}
                <div className="text-end mt-3">
                  <button className="btn btn-success" onClick={handleSubmitOnlineTasks}>
                    Submit Tasks
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column (Rank list + Courses) */}
          <div className="col-md-5">
            {/* Rank List */}
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3 text-center">Rank List</h4>
              <ul className="list-group">
                {rankList.map((user, index) => (
                  <li
                    key={user.accountId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {index + 1}. {user.username}
                    </span>
                    <span className="badge bg-primary">{user.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="mt-3 card p-4 shadow-sm">
              <h4 className="mb-3 text-center">Courses</h4>
              <ul className="list-group">
                {courses.map((course) => (
                  <li
                    key={course.courseId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {/* 
                      Link to the course page:
                      /account/:accountId/course/:courseId 
                    */}
                    <Link to={`/account/${accountId}/course/${course.courseId}`}>
                      Course #{course.courseId} - Age {course.courseAge}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
