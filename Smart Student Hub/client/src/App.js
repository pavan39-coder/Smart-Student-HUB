import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import FacultyDashboardPage from './pages/FacultyDashboardPage';
import NewProjectPage from './pages/NewProjectPage';

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role)) {
      return <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'faculty' ? '/faculty' : '/dashboard'} />;
    }
  }
  return children;
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/projects/new" element={
                <ProtectedRoute requiredRole="student">
                  <NewProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/project/new" element={
                <ProtectedRoute requiredRole="student">
                  <NewProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/portfolio/:portfolioId" element={<PublicPortfolioPage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute requiredRole="student">
                    <ActivitiesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute requiredRole={['student', 'admin', 'faculty']}>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <ProtectedRoute requiredRole="student">
                    <NewProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRole="student">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminApprovalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminStudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Faculty Routes */}
              <Route
                path="/faculty"
                element={
                  <ProtectedRoute requiredRole="faculty">
                    <FacultyDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty/approvals"
                element={
                  <ProtectedRoute requiredRole={[ 'admin', 'faculty' ]}>
                    <AdminApprovalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty/students"
                element={
                  <ProtectedRoute requiredRole={[ 'admin', 'faculty' ]}>
                    <AdminStudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
