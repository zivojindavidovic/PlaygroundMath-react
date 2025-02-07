import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";

interface TaskItem {
  taskId: number;
  task: string;
}

interface TestData {
  testId: number;
  tasks: TaskItem[];
}

interface CourseTestData {
  courseId: number;
  tests: TestData[];
}

const AccountCourse: React.FC = () => {
  const { accountId, courseId } = useParams<{
    accountId: string;
    courseId: string;
  }>();

  const [courseTests, setCourseTests] = useState<TestData[]>([]);
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

  const handleTestSubmit = async (test: TestData) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("No access token found.");
      return;
    }

    try {
      const testAnswersObj: Record<string, string> = {};
      test.tasks.forEach((taskItem) => {
        testAnswersObj[taskItem.taskId] = answers[taskItem.taskId] || "";
      });

      const payload = {
        testId: test.testId,
        testAnswers: [testAnswersObj],
        accountId: Number(accountId),
      };

      const response = await fetch("http://0.0.0.0:8000/api/v1/course/solveTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit test");
      }

      const result = await response.json();
      alert(`Test #${test.testId} submitted successfully! Response: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test. See console for details.");
    }
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
          courseTests.map((testItem, idx) => (
            <div key={testItem.testId} className="card p-3 mb-4">
              <h5 className="mb-3">
                Test #{idx + 1} (ID: {testItem.testId})
              </h5>

              {testItem.tasks.map((task) => (
                <div key={task.taskId} className="d-flex align-items-center mb-2">
                  <span style={{ minWidth: "80px" }}>{task.task}</span>
                  <input
                    type="text"
                    className="form-control ms-2"
                    style={{ width: "120px" }}
                    placeholder="Your answer"
                    value={answers[task.taskId] || ""}
                    onChange={(e) => handleAnswerChange(task.taskId, e.target.value)}
                  />
                </div>
              ))}

              <div className="text-end mt-3">
                <button
                  className="btn btn-primary"
                  onClick={() => handleTestSubmit(testItem)}
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
