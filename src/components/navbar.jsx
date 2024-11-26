import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

const Navbar = () => {
  const { toggleTheme, darkMode } = useTheme();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className={`py-4 px-6 shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">RBAC Dashboard</Link>
        </h1>
        <div className="space-x-4">
          {token && (
            <>
              <Link to="/" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/users" className="hover:underline">
                Users
              </Link>
              <Link to="/roles" className="hover:underline">
                Roles
              </Link>
              <Link to="/permissions" className="hover:underline">
                Permissions
              </Link>
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}
              >
                Toggle Theme
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          )}
          {!token && (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
