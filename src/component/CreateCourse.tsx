import React, { useState } from "react";

const CreateCourse: React.FC = () => {
    const [age, setAge] = useState(5);
    const [dueDate, setDueDate] = useState("");
    const userId = localStorage.getItem("userId");

    const handleCreateCourse = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("No access token found");
            return;
        }

        const formattedDueDate = new Date(dueDate).toISOString().split(".")[0];

        try {
            const response = await fetch("http://0.0.0.0:8000/api/v1/course/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ userId, age, dueDate: formattedDueDate }),
            });

            if (!response.ok) {
                throw new Error("Failed to create course");
            }

            alert("Course created successfully!");
            setAge(5);
            setDueDate("");
        } catch (error) {
            console.error("Error creating course", error);
        }
    };

    return (
        <div className="card shadow-sm p-3 mb-4">
            <h3 className="text-center">Create Course</h3>
            <div className="mb-3">
                <label className="form-label">Age</label>
                <select className="form-control" value={age} onChange={(e) => setAge(Number(e.target.value))}>
                    {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <button className="btn btn-primary w-100" onClick={handleCreateCourse}>
                Create Course
            </button>
        </div>
    );
};

export default CreateCourse;
