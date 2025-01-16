import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AccountGamePage from './pages/AccountGamePage';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account/:accountId" element={<AuthGuard><AccountGamePage /></AuthGuard>} />
        </Routes>
      </Router>
    </>
  );
};

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default App;
