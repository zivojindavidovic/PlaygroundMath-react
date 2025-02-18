import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './component/AuthGuard';
import GameComponent from './component/GameComponent';
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

const App: React.FC = () => {
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
          <Route path="accounts" element={<AccountList />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="professors" element={<Professors />} />
          <Route path="professors/:teacherId" element={<Professor />} />
          <Route path="rank-list" element={<RankList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="game/:accountId" element={<GameComponent />} />
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
