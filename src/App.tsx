import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';
import Home from './pages/Home';
import Account from './pages/Account';

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

const ProtectedHome: React.FC = () => {
  return (
    <AuthGuard>
      <Home />
    </AuthGuard>
  );
};

const ProtectedAccount: React.FC = () => {
  return (
    <AuthGuard>
      <Account />
    </AuthGuard>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/:accountId" element={<ProtectedAccount />} />
      </Routes>
    </Router>
  );
};

export default App;
