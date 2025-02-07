import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";

interface TaskItem {
  taskId: number;
  task: string;
}

interface CourseTestData {
  courseId: number;
  tests: TaskItem[][];
}

const AccountCourse: React.FC = () => {
  const { accountId, courseId } = useParams<{
    accountId: string;
    courseId: string;
  }>();

  const [courseTests, setCourseTests] = useState<TaskItem[][]>([]);

  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchUnresolvedTests = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const response = await fetch(
          `http://0.0.0.0:8000/api/v1/course/${accountId}/unresolvedTests`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unresolved tests");
        }
        const data: CourseTestData[] = await response.json();

        const courseData = data.find(
          (entry) => entry.courseId === Number(courseId)
        );
        if (courseData) {
          setCourseTests(courseData.tests);
        }
      } catch (error) {
        console.error("Error fetching unresolved tests:", error);
      }
    };

    fetchUnresolvedTests();
  }, [accountId, courseId]);

  const handleAnswerChange = (taskId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleTestSubmit = (testIndex: number) => {
    alert(`Submit clicked for Test #${testIndex + 1} (functionality pending...)`);
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1>Account Course Page</h1>
        <p>Account ID: {accountId}</p>
        <p>Course ID: {courseId}</p>

        {courseTests.length === 0 ? (
          <p>No unresolved tests for this course.</p>
        ) : (
          courseTests.map((test, testIndex) => (
            <div key={testIndex} className="card p-3 mb-4">
              <h5 className="mb-3">Test #{testIndex + 1}</h5>

              {test.map((taskItem) => (
                <div key={taskItem.taskId} className="d-flex align-items-center mb-2">
                  <span style={{ minWidth: "80px" }}>{taskItem.task}</span>
                  <input
                    type="text"
                    className="form-control ms-2"
                    style={{ width: "120px" }}
                    placeholder="Your answer"
                    value={answers[taskItem.taskId] || ""}
                    onChange={(e) => handleAnswerChange(taskItem.taskId, e.target.value)}
                  />
                </div>
              ))}

              <div className="text-end mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleTestSubmit(testIndex)}
                >
                  Submit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountCourse;
