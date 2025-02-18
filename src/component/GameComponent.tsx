import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/GameComponent.scss";

interface OnlineTask {
  taskId: number;
  task: string;
}

interface ApiResponse<T> {
  success: boolean;
  errors: string[];
  results: T[];
}

interface TaskResult {
  type: "pdf" | "online";
  tasks: string[] | OnlineTask[];
}

interface Course {
  courseId: number;
  courseAge: number;
}

interface TestTask {
  taskId: number;
  task: string;
}

interface UnresolvedTest {
  testId: number;
  tasks: TestTask[];
}

interface UnresolvedTestsResponse {
  courseId: number;
  tests: UnresolvedTest[];
}

const GameComponent: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();

  const [numberOneFrom, setNumberOneFrom] = useState<number>(1);
  const [numberOneTo, setNumberOneTo] = useState<number>(10);
  const [numberTwoFrom, setNumberTwoFrom] = useState<number>(1);
  const [numberTwoTo, setNumberTwoTo] = useState<number>(10);
  const [testType, setTestType] = useState<"online" | "pdf">("online");
  const [operations, setOperations] = useState<string[]>(["+"]);
  const [pdfTasks, setPdfTasks] = useState<string[]>([]);
  const [onlineTasks, setOnlineTasks] = useState<OnlineTask[]>([]);
  const [onlineResponses, setOnlineResponses] = useState<Record<number, string>>({});

  const [sumUnitsGoesOverCurrentTenSum, setsumUnitsGoesOverCurrentTenSum] = useState<boolean>(false);
  const [sumExceedTwoDigitsSum, setSumExceedTwoDigitsSum] = useState<boolean>(false);
  const [allowedNegativeResultsSub, setAllowedNegativeResultsSub] = useState<boolean>(false);
  const [allowedBiggerUnitsInSecondNumberSub, setAllowedBiggerUnitsInSecondNumberSub] = useState<boolean>(false);
  const [allowedThreeDigitsResultMul, setAllowedThreeDigitsResultMul] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);


  const [unresolvedTests, setUnresolvedTests] = useState<Record<number, UnresolvedTest[]>>({});
  const [unresolvedTestResponses, setUnresolvedTestResponses] = useState<Record<number, Record<number, string>>>({});

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:8000/api/v1/course/list?accountId=${accountId}`, {
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
  }, [accountId]);

  useEffect(() => {
    if (!accountId || courses.length === 0) return;

    courses.forEach((course) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;
      const fetchUnresolvedTests = async () => {
        try {
          const response = await fetch(
            `http://0.0.0.0:8000/api/v1/test/unresolved?accountId=${accountId}&courseId=${course.courseId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch unresolved tests");
          }
          const data: UnresolvedTestsResponse[] = await response.json();
          if (data && data.length > 0) {
            setUnresolvedTests((prev) => ({
              ...prev,
              [course.courseId]: data[0].tests,
            }));
          } else {
            setUnresolvedTests((prev) => ({
              ...prev,
              [course.courseId]: [],
            }));
          }
        } catch (error) {
          console.error(`Error fetching unresolved tests for course ${course.courseId}:`, error);
          setUnresolvedTests((prev) => ({
            ...prev,
            [course.courseId]: [],
          }));
        }
      };

      fetchUnresolvedTests();
    });
  }, [courses, accountId]);

  useEffect(() => {
    const fetchOnlineTasks = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const response = await fetch(
          `http://0.0.0.0:8000/api/v1/task/unresolved?accountId=${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch online tasks");
        }

        const data: ApiResponse<TaskResult> = await response.json();

        if (data.success && data.results.length > 0) {
          const result = data.results[0];
          if (result.type === "online") {
            setOnlineTasks(result.tasks as OnlineTask[]);
            setOnlineResponses({});
          } else {
            setOnlineTasks([]);
          }
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

  const toggleOperation = (op: string) => {
    setOperations((prevOps) => {
      let newOps: string[];
      if (prevOps.includes(op)) {
        newOps = prevOps.filter((o) => o !== op);
      } else {
        newOps = [...prevOps, op];
      }
      if (newOps.length === 0) {
        return ["+"];
      }
      return newOps;
    });
  };

  const handleCreateTasks = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/task/generate", {
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
          sumUnitsGoesOverCurrentTenSum,
          sumExceedTwoDigitsSum,
          allowedNegativeResultsSub,
          allowedBiggerUnitsInSecondNumberSub,
          allowedThreeDigitsResultMul,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tasks");
      }
      const data: ApiResponse<TaskResult> = await response.json();
      if (data.success && data.results.length > 0) {
        const result = data.results[0];
        if (result.type === "pdf") {
          setPdfTasks(result.tasks as string[]);
        } else if (result.type === "online") {
          setOnlineTasks(result.tasks as OnlineTask[]);
        }
      }
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

    doc.save(`tasks_${accountId}.pdf`);
  };

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

  const handleOnlineResponseChange = (taskId: number, value: string) => {
    setOnlineResponses((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleTestResponseChange = (testId: number, taskId: number, value: string) => {
    setUnresolvedTestResponses((prev) => {
      const testResponses = prev[testId] || {};
      return {
        ...prev,
        [testId]: {
          ...testResponses,
          [taskId]: value,
        },
      };
    });
  };

  const isCreateTasksDisabled = testType === "online" && onlineTasks.length > 0;

  const handleSubmitUnresolvedTest = async (testId: number) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
  
    const testAnswers = unresolvedTestResponses[testId] || {};
  
    try {
      const response = await fetch("http://0.0.0.0:8000/api/v1/task/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          testAnswers: [testAnswers],
          accountId: Number(accountId),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to solve test");
      }
  
      const data = await response.json();
      alert(`You won ${data.pointsFromTest} points from this test!`);
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };
  

  return (
    <div className="game">
      <h5 className="alert alert-danger text-center">Generator zadataka</h5>
      <div>
        <div>
          <div>
            <div className="card p-4 shadow-sm">
              <h4 className="mb-3">Konfigurator generatora zadataka</h4>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Minimalna vrednost prvog broja</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberOneFrom}
                    onChange={(e) => setNumberOneFrom(Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Maksimalna vrednost prvog broja</label>
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
                  <label className="form-label">Minimalna vrednost drugog broja</label>
                  <input
                    type="number"
                    className="form-control"
                    value={numberTwoFrom}
                    onChange={(e) => setNumberTwoFrom(Number(e.target.value))}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Maksimalna vrednost drugog broja</label>
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
                <h6>Odaberi operacije:</h6>
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
              {/* Additional options */}
              <div>
                {operations.includes("+") && (
                  <div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sumUnitsGoesOverCurrentTenSumToggle"
                        checked={sumUnitsGoesOverCurrentTenSum}
                        onChange={() => setsumUnitsGoesOverCurrentTenSum(!sumUnitsGoesOverCurrentTenSum)}
                      />
                      <label className="form-check-label" htmlFor="sumUnitsGoesOverCurrentTenSumToggle">
                        {sumUnitsGoesOverCurrentTenSum
                          ? "Sabirak jedinica prelazi u sledeću deseticu"
                          : "Sabirak jedinica ne prelazi u sledeću deseticu"}
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sumExceedTwoDigitsSumToggle"
                        checked={sumExceedTwoDigitsSum}
                        onChange={() => setSumExceedTwoDigitsSum(!sumExceedTwoDigitsSum)}
                      />
                      <label className="form-check-label" htmlFor="sumExceedTwoDigitsSumToggle">
                        {sumExceedTwoDigitsSum
                          ? "Sabirak može biti trocifren"
                          : "Sabirak može biti jednocifren ili dvocifren"}
                      </label>
                    </div>
                  </div>
                )}
                {operations.includes("-") && (
                  <div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="allowedNegativeResultsSubToggle"
                        checked={allowedNegativeResultsSub}
                        onChange={() => setAllowedNegativeResultsSub(!allowedNegativeResultsSub)}
                      />
                      <label className="form-check-label" htmlFor="allowedNegativeResultsSubToggle">
                        {allowedNegativeResultsSub
                          ? "Rezultat oduzimanja može biti negativan"
                          : "Rezultat oduzimanja je pozitivan"}
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="allowedBiggerUnitsInSecondNumberSubToggle"
                        checked={allowedBiggerUnitsInSecondNumberSub}
                        onChange={() => setAllowedBiggerUnitsInSecondNumberSub(!allowedBiggerUnitsInSecondNumberSub)}
                      />
                      <label className="form-check-label" htmlFor="allowedBiggerUnitsInSecondNumberSubToggle">
                        {allowedBiggerUnitsInSecondNumberSub
                          ? "Jedinice drugog broja mogu biti veće od jedinica prvog broja"
                          : "Jedinice drugog broja su manje od jedinica prvog broja"}
                      </label>
                    </div>
                  </div>
                )}
                {operations.includes("*") && (
                  <div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="allowedThreeDigitsResultMulToggle"
                        checked={allowedThreeDigitsResultMul}
                        onChange={() => setAllowedThreeDigitsResultMul(!allowedThreeDigitsResultMul)}
                      />
                      <label className="form-check-label" htmlFor="allowedThreeDigitsResultMulToggle">
                        {allowedThreeDigitsResultMul
                          ? "Rezultat množenja može biti trocifren broj"
                          : "Rezultat množenja je jednocifren ili dvocifren broj"}
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <button className="btn btn-primary w-100" onClick={handleCreateTasks} disabled={isCreateTasksDisabled}>
                Generiši zadatke
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
                    <span className="border-bottom d-inline-block" style={{ width: "200px" }}></span>
                  </div>
                  <div>
                    <strong>Datum:</strong>{" "}
                    <span className="border-bottom d-inline-block" style={{ width: "150px" }}></span>
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

            {testType === "online" && onlineTasks.length > 0 && (
              <div className="mt-4 card p-4 bg-white shadow-sm">
                <h5 className="mb-3">Nerešen test</h5>
                {onlineTasks.map((taskObj, index) => (
                  <div key={taskObj.taskId} className="d-flex align-items-center mb-3">
                    <span className="me-3">
                      {index + 1}. {taskObj.task}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "120px" }}
                      placeholder="Your answer"
                      value={onlineResponses[taskObj.taskId] || ""}
                      onChange={(e) => handleOnlineResponseChange(taskObj.taskId, e.target.value)}
                    />
                  </div>
                ))}
                <div className="text-end mt-3">
                  <button className="btn btn-success" onClick={handleSubmitOnlineTasks}>
                    Pošalji
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h5 className="alert alert-danger mt-4 text-center">Kursevi</h5>
      <div className="mt-3 card p-4 shadow-sm">
        {courses.length === 0 && (<div><p className="mt-2 mb-0 text-muted">Nema nerešenih testova</p></div>)}
        <ul className="list-group">
          {courses.map((course) => (
            <li key={course.courseId} className="list-group-item">
              <h5>
                Kurs #{course.courseId} - Kurs pripada uzrastu {course.courseAge} godina
              </h5>
              {unresolvedTests[course.courseId] && unresolvedTests[course.courseId].length > 0 ? (
                unresolvedTests[course.courseId].map((test) => (
                  <div key={test.testId} className="card p-3 mt-3">
                    <h6>Test #{test.testId}</h6>
                    {test.tasks.map((task, index) => (
                      <div key={task.taskId} className="d-flex align-items-center mb-2">
                        <span className="me-3">
                          {index + 1}. {task.task}
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: "120px" }}
                          placeholder="Your answer"
                          value={unresolvedTestResponses[test.testId]?.[task.taskId] || ""}
                          onChange={(e) => handleTestResponseChange(test.testId, task.taskId, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="text-end">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSubmitUnresolvedTest(test.testId)}
                      >
                        Pošalji
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-2 mb-0 text-muted">Nema nerešenih testova</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameComponent;
