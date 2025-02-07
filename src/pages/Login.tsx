import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const response = await fetch('http://0.0.0.0:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessages = data.errors && data.errors.length > 0
          ? data.errors.map((errObj: Record<string, string>) => {
              return Object.values(errObj)[0];
            }).join(', ')
          : 'Login failed';

        throw new Error(errorMessages);
      }

      const result = data.results[0];
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('email', result.email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isTeacher', result.isTeacher);

      toast.success('Prijavio si se uspešno');
      setTimeout(() => navigate('/'), 2000);

    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h3 className="text-center">Prijavi se</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">E-adresa</label>
          <input 
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Lozinka</label>
          <input 
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Prijavi se
        </button>

        <p className="mt-3 text-center">
          Nemaš registrovan nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
