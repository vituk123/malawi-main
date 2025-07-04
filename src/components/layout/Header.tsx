import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { logout } from '../../services/api';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isLoggedIn, roles, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        <Link to="/">Job Portal</Link>
      </h1>
      <nav>
        <ul className="flex space-x-4 items-center">
          <li>
            <Link to="/jobs" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
 Jobs
            </Link>
          </li>
          <li>
            <Link to="/companies" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
 Companies
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              {roles.includes('ROLE_JOB_SEEKER') && (
                <li>
                  <Link to="/my-applications" className="text-gray-300 hover:text-blue-400">
 My Applications
                  </Link>
                </li>
              )}
              {(roles.includes('ROLE_EMPLOYER') || roles.includes('ROLE_ADMIN')) && (
                <li>
                  <Link to="/jobs/create" className="text-gray-300 hover:text-blue-400">
 Create Job
                  </Link>
                </li>
              )}
              {(roles.includes('ROLE_EMPLOYER') || roles.includes('ROLE_ADMIN')) && (
                <li>
                  <Link to="/companies/register" className="text-gray-300 hover:text-blue-400">
 Register Company
                  </Link>
                </li>
              )}
              {roles.includes('ROLE_ADMIN') && (
                <li>
                  <Link to="/test" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    Admin Board
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Sign Up
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
