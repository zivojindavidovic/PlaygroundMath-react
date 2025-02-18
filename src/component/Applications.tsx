import React, { useEffect, useState } from "react";

interface Application {
  courseId: number;
  courseAge: number;
  accountId: number;
  accountAge: number;
  accountUsername: string;
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(
        `http://0.0.0.0:8000/api/v1/course/applications?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data: Application[] = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApplicationDecision = async (
    application: Application,
    decision: boolean
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await fetch(
        "http://0.0.0.0:8000/api/v1/course/resolveApplication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            courseId: application.courseId,
            accountId: application.accountId,
            decision: decision,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to resolve application");
      }
      await fetchApplications();
    } catch (error) {
      console.error("Error resolving application:", error);
    }
  };

  return (
    <div>
      {applications.length === 0 && (
        <h5 className="alert alert-danger">
          Trenutno nemaš zahteva za pristup tvojim zadacima
        </h5>
      )}
      {applications.map((app, index) => (
        <div key={index} className="card mb-3 shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h5 className="card-title">Korisničko ime: {app.accountUsername}</h5>
              <p className="card-text mb-1">
                ID kursa za koji je roditelj aplicirao: {app.courseId} (Godine za koje je kurs namenjen: {app.courseAge})
              </p>
              <p className="card-text mb-1">
                ID naloga deteta: {app.accountId} (Godine deteta: {app.accountAge})
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <button
                className="btn btn-success me-2"
                onClick={() => handleApplicationDecision(app, true)}
              >
                Odobri
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleApplicationDecision(app, false)}
              >
                Odbij
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Applications;
