import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<'PARENT' | 'TEACHER'>('PARENT');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        setEmailError('');
        setPasswordError('');

        if (password !== confirmPassword) {
            setPasswordError('Lozinke se ne poklapaju');
            return;
        }

        try {
            const requestBody: {
                email: string;
                password: string;
                accountType?: 'PARENT' | 'TEACHER';
            } = {
                email,
                password,
            };

            requestBody.accountType = accountType;

            const response = await fetch('http://0.0.0.0:8000/api/v1/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Registracija je uspela. Proveri svoju e-adresu kako bi potvrdio kreiranje naloga.', { autoClose: 2000 });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((errObj: Record<string, string>) => {
                        if (errObj.email) {
                            setEmailError(errObj.email);
                        }
                        if (errObj.password) {
                            setPasswordError(errObj.password);
                        }
                    });
                }
            }
        } catch (error) {
            toast.error('Registracija nije uspela. Pokušaj ponovo kasnije.', { autoClose: 2000 });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <ToastContainer />
            <div className="card p-4 shadow" style={{ width: '400px' }}>
                <h3 className="text-center">Registruj se</h3>

                <div className="mb-3">
                    <label className="form-label">E-Adresa</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <div className="text-danger mt-1">{emailError}</div>}
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

                <div className="mb-3">
                    <label className="form-label">Potvrdi Lozinku</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                </div>

                <div className="mb-3 text-center">
                    <span className="me-2">Registrujem se kao:</span>
                    <button
                        className={`btn ${accountType === 'PARENT' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setAccountType('PARENT')}
                    >
                        Roditelj
                    </button>
                    <button
                        className={`btn ms-2 ${accountType === 'TEACHER' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setAccountType('TEACHER')}
                    >
                        Učitelj
                    </button>
                </div>

                <button className="btn btn-success w-100" onClick={handleRegister}>
                    Registruj se
                </button>
            </div>
        </div>
    );
};

export default Register;
