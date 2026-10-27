import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('promptport_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('promptport_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const formatRole = (role) => {
    if (!role) return '';
    return role.replace(/_/g, ' ');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-brand">
        <div className="nav-brand-icon">⚡</div>
        <span>PromptPort</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/library">
          Library
        </NavLink>
        {user && (
          <NavLink to="/collections">
            Collections
          </NavLink>
        )}
        {user?.role === 'TEAM_LEAD' && (
          <NavLink to="/categories">
            Categories
          </NavLink>
        )}
      </div>

      <div className="nav-user">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="nav-user-name">{user.username}</span>
              {user.role && (
                <span className="role-pill">{formatRole(user.role)}</span>
              )}
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Sign out
            </button>
          </>
        ) : (
          <div className="nav-auth-links">
            <NavLink to="/login" className="sign-in-link">
              Sign in
            </NavLink>
            <NavLink to="/register" className="sign-up-link">
              Get Started
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
