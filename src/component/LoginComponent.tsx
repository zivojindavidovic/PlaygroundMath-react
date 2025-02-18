import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import userImage from "../assets/profile.png"

import "../styles/LoginComponent.scss"
import { toast } from "react-toastify"

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
    }
    
    return (
        <div className="login">
            <img src={userImage} alt="Logo img" className="login-user-image"/>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
                type="email"
                placeholder="E-Adresa"
                className="login-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                placeholder="Šifra"
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className="no-account-text">
                Nemaš registrovan nalog? <Link to={'/register'}>Registruj se</Link>
            </p>
            <button 
                className="login-button"
                onClick={handleLogin}
            >
                Prijavi se
            </button>
        </div>
    )
}

export default LoginComponent;