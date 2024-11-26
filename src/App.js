import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionMatrix from './components/PermissionMatrix';
import Login from './components/Login';

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');
  return token ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
  const { darkMode } = useTheme();

  return (
    <ThemeProvider>
      <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
        <Router>
          <Navbar />
          <div className="container mx-auto mt-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
              <Route path="/users" element={<ProtectedRoute element={UserManagement} />} />
              <Route path="/roles" element={<ProtectedRoute element={RoleManagement} />} />
              <Route path="/permissions" element={<ProtectedRoute element={PermissionMatrix} />} />
            </Routes>
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
