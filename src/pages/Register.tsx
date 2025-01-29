import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState<'PARENT' | 'TEACHER'>('PARENT');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://0.0.0.0:8000/api/v1/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    accountType,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful! Redirecting...', { autoClose: 2000 });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            toast.error('Network error. Please try again later.');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <ToastContainer />
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h3 className="text-center">Register</h3>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3 text-center">
                    <span className="me-2">Account Type:</span>
                    <button className={`btn ${accountType === 'PARENT' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAccountType('PARENT')}>Parent</button>
                    <button className={`btn ms-2 ${accountType === 'TEACHER' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAccountType('TEACHER')}>Teacher</button>
                </div>
                <button className="btn btn-success w-100" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
};

export default Register;
