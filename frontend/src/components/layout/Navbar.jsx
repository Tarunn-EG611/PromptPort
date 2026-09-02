import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">PromptPort</div>

      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/library">Library</Link>
        {user && <Link to="/collections">My Collections</Link>}
        {user && user.role === 'TEAM_LEAD' && (
          <Link to="/categories">Categories</Link>
        )}
      </div>

      {user ? (
        <div className="nav-user">
          <span>Welcome, {user.username}!</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-user">
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;