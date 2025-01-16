import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/styles/AccountGamePage.scss';

interface Task {
    taskId: number;
    task: string;
}

const AccountGamePage: React.FC = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const [numberOneFrom, setFirstNumberFrom] = useState('');
    const [numberOneTo, setFirstNumberTo] = useState('');
    const [numberTwoFrom, setSecondNumberFrom] = useState('');
    const [numberTwoTo, setSecondNumberTo] = useState('');
    const [testType, setTestType] = useState('pdf'); // pdf by default
    const [tasks, setTasks] = useState<Task[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                await fetch('http://0.0.0.0:8000/api/v1/auth/logout', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.clear();
            sessionStorage.clear();
            toast.info('Logged Out');
            navigate('/login');
        }
    };

    const handleGenerateTasks = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken || !accountId) {
                toast.error('Missing account information or access token.');
                return;
            }

            const payload = {
                numberOneFrom,
                numberOneTo,
                numberTwoFrom,
                numberTwoTo,
                testType,
                accountId,
            };

            const response = await fetch('http://0.0.0.0:8000/api/v1/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data.tasks || []);
                toast.success('Tasks generated successfully!');
            } else {
                toast.error('Failed to generate tasks.');
            }
        } catch (error) {
            console.error('Error generating tasks:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleAnswerChange = (taskId: number, value: string) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [taskId]: value,
        }));
    };

    const handleSubmitTest = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken || !accountId) {
                toast.error('Missing account information or access token.');
                return;
            }

            const payload = {
                testAnswers: [
                    Object.entries(answers).reduce<{ [key: string]: string }>((acc, [taskId, answer]) => {
                        acc[taskId] = answer;
                        return acc;
                    }, {}),
                ],
                accountId: parseInt(accountId, 10), // Ensure accountId is a number
            };

            const response = await fetch('http://0.0.0.0:8000/api/v1/task/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Test submitted successfully!');
            } else {
                toast.error('Failed to submit the test.');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleToggleChange = () => {
        setTestType((prev) => (prev === 'pdf' ? 'online' : 'pdf'));
    };

    return (
        <div className="account-game-page">
            <header className="header">
                <h1>Account Game Page</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/')} className="back-button">Back to Accounts</button>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
            </header>

            <div className="content">
                <div className="inputs-section">
                    <div className="input-row">
                        <input
                            type="number"
                            placeholder="First Number From"
                            value={numberOneFrom}
                            onChange={(e) => setFirstNumberFrom(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="First Number To"
                            value={numberOneTo}
                            onChange={(e) => setFirstNumberTo(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <input
                            type="number"
                            placeholder="Second Number From"
                            value={numberTwoFrom}
                            onChange={(e) => setSecondNumberFrom(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Second Number To"
                            value={numberTwoTo}
                            onChange={(e) => setSecondNumberTo(e.target.value)}
                        />
                    </div>
                    <button onClick={handleGenerateTasks} className="generate-button">Generate Tasks</button>

                    <div className="toggle-section">
                        <label className="toggle-label">PDF</label>
                        <input
                            type="checkbox"
                            checked={testType === 'online'}
                            onChange={handleToggleChange}
                            className="toggle-input"
                        />
                        <label className="toggle-label">Online</label>
                    </div>

                    {tasks.length > 0 && (
                        <form className="tasks-form">
                            {tasks.map((task) => (
                                <div key={task.taskId} className="task-item">
                                    <span>{task.task}</span>
                                    <input
                                        type="text"
                                        value={answers[task.taskId] || ''}
                                        onChange={(e) => handleAnswerChange(task.taskId, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleSubmitTest}
                                className="submit-test-button"
                            >
                                Submit Test
                            </button>
                        </form>
                    )}
                </div>

                <div className="rang-list">
                    <h2>Rang List</h2>
                    <ul>
                        <li>1. John Doe - 150 points</li>
                        <li>2. Jane Smith - 120 points</li>
                        <li>3. Alice Johnson - 100 points</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AccountGamePage;