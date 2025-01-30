import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";
import jsPDF from "jspdf";

interface Course {
  courseId: number;
  age: number;
  dueDate: string;
}

interface TaskResponse {
  tasks: string[];
}

interface TestItem {
  testId: number;
  courseId: number;
}

const MyCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);

  const [numberOneFrom, setNumberOneFrom] = useState<number>(1);
  const [numberOneTo, setNumberOneTo] = useState<number>(10);
  const [numberTwoFrom, setNumberTwoFrom] = useState<number>(1);
  const [numberTwoTo, setNumberTwoTo] = useState<number>(10);
  const [operations, setOperations] = useState<string[]>([]);
  const [pdfTasks, setPdfTasks] = useState<string[]>([]);
  const [tests, setTests] = useState<TestItem[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!courseId || !accessToken) return;

    fetch(`http://0.0.0.0:8000/api/v1/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        return response.json();
      })
      .then((data: Course) => {
        setCourse(data);
        setLoadingCourse(false);
      })
      .catch(error => {
        console.error("Error fetching course:", error);
        setLoadingCourse(false);
      });
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    fetchTests(); // Fetch tests whenever courseId changes or on initial load
  }, [courseId]);

  const fetchTests = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !courseId) return;
    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/course/${courseId}/tests`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      const data: TestItem[] = await response.json();
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const toggleOperation = (op: string) => {
    setOperations(prevOps =>
      prevOps.includes(op) ? prevOps.filter(o => o !== op) : [...prevOps, op]
    );
  };

  const handleCreateTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !courseId) return;

    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          numberOneFrom,
          numberOneTo,
          numberTwoFrom,
          numberTwoTo,
          testType: "course",
          operations,
          courseId: Number(courseId)
        })
      });
      if (!response.ok) {
        throw new Error("Failed to create tasks");
      }
      const data: TaskResponse = await response.json();
      setPdfTasks(data.tasks || []);
      await fetchTests(); // Refresh tests after creating a new one
    } catch (error) {
      console.error("Error creating tasks:", error);
    }
  };

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

    doc.save(`tasks_course_${courseId}.pdf`);
  };

  if (loadingCourse) {
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <h2>Loading course data...</h2>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header />
        <div className="container mt-4">
          <h2>Course not found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h2>My Course (ID: {course.courseId})</h2>
        <div className="card p-3 mt-3 shadow-sm mb-4">
          <p><strong>Age:</strong> {course.age}</p>
          <p><strong>Due Date:</strong> {new Date(course.dueDate).toLocaleDateString()}</p>
        </div>

        <div className="card p-4 shadow-sm mb-4">
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

          <div className="mb-3">
            <h6>Select Operations:</h6>
            {["+", "-", "*", "/"].map(op => (
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

          <button className="btn btn-primary w-100" onClick={handleCreateTasks}>
            Create Tasks
          </button>
        </div>

        {pdfTasks.length > 0 && (
          <div
            className="mb-4 border p-4 bg-white shadow-sm position-relative"
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

        {tests.length > 0 && (
          <div className="mb-4">
            <h4>All Tests for This Course</h4>
            {tests.map(test => (
              <div key={test.testId} className="card mb-2 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Test ID: {test.testId}</h5>
                  <p className="card-text">Course ID: {test.courseId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
