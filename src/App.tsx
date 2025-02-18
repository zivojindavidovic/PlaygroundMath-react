import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './component/AuthGuard';
import ProfessorCourseComponent from './component/ProfessorCourseComponent';
import ConfirmAccount from './pages/ConfirmAccount';
import RankList from './components/ranklist/RankList';
import Profile from './components/profile/Profile';
import CreateAccount from './components/account/CreateAccount';
import AccountList from './components/account/AccountList';
import Professors from './components/professors/Professors';
import ProfessorCourses from './components/courses/ProfessorCourses';
import Applications from './components/applications/Applications';
import CreateCourse from './components/courses/CreateCourse';
import Professor from './components/professor/Professor';
import Game from './components/game/Game';
import { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTeacher, setIsTeacher] = useState<boolean | null>(null);

  useEffect(() => {
    const teacherStatus = localStorage.getItem('isTeacher');
    setIsTeacher(teacherStatus === 'true');
    setIsInitialized(true);
  }, []);

  const DefaultComponent = () => {
    if (!isInitialized) return null;
    
    if (isTeacher) {
      return <Navigate to="/professor-courses" replace />;
    }
    
    return <Navigate to="/accounts" replace />;
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        >
          <Route index element={<DefaultComponent />} />
          <Route path="accounts" element={<AccountList />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:teacherId" element={<Professor />} />
          <Route path="rank-list" element={<RankList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="game/:accountId" element={<Game />} />
          <Route path="professor-courses" element={<ProfessorCourses />} />
          <Route path="applications" element={<Applications />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="professor-courses/:courseId" element={<ProfessorCourseComponent />} />
          <Route path="confirm" element={<ConfirmAccount />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
