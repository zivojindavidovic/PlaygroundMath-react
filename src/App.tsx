import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuthGuard from './component/AuthGuard';
import AccountList from './component/AccountList';
import CreateAccount from './component/CreateAccount';
import Profile from './component/Profile';
import ProfessorComponent from './component/ProfessorComponent';
import ProfessorsComponent from './component/ProfessorsComponent';
import GameComponent from './component/GameComponent';
import ProfessorCourses from './component/ProfessorCourses';
import Applications from './component/Applications';
import CreateCourse from './component/CreateCourse';
import ProfessorCourseComponent from './component/ProfessorCourseComponent';
import ConfirmAccount from './pages/ConfirmAccount';
import RankList from './components/ranklist/RankList';

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
          <Route path="professors" element={<ProfessorsComponent />} />
          <Route path="professors/:teacherId" element={<ProfessorComponent />} />
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
