import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './components/common/AuthGuard';
import ProfessorCourseComponent from './components/professor/ProfessorCourseComponent';
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
import AdminAccounts from './components/admin/AdminAccounts';
import AdminUsers from './components/admin/AdminUsers';
import AdminTeacherCourses from './components/admin/AdminTeacherCourses';
import ReviewChildCourses from './components/review-child-courses/ReviewChildCourses';

const App: React.FC = () => {

  const DefaultComponent = () => {
    const isTeacher = localStorage.getItem('isTeacher');
    const isAdmin = localStorage.getItem('isAdmin');

    if (isTeacher === "true") {
      return <Navigate to="/professor-courses" replace />;
    }

    if (isAdmin === "true") {
      return <Navigate to="/admin/users" replace />;
    }
    
    return <Navigate to="/accounts" replace />;
  };

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
          <Route path="review-child-courses" element={<ReviewChildCourses />} />
          <Route path="professor-courses" element={<ProfessorCourses />} />
          <Route path="applications" element={<Applications />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="professor-courses/:courseId" element={<ProfessorCourseComponent />} />
          <Route path="confirm" element={<ConfirmAccount />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/accounts" element={<AdminAccounts />} />
          <Route path="admin-teacher-courses" element={<AdminTeacherCourses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
