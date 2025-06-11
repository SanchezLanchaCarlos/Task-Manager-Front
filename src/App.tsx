import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks'; 
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import ProjectDetails from './pages/ProjectDetails';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas privadas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
        </Routes>
    </Router>
  );
}

export default App;
