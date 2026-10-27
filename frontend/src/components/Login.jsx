import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/slices/authSlice';
import ErrorHandler from './common/ErrorHandler';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="auth-page-wrapper">
      <section className="login-container">
        <div className="login-header">
          <div
            className="nav-brand-icon"
            style={{ width: '40px', height: '40px', fontSize: '1.25rem', margin: '0 auto 14px' }}
          >
            ⚡
          </div>
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to your PromptPort workspace</p>
        </div>

        {isError && <ErrorHandler error={message} />}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              required
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              placeholder="••••••••"
              required
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <p className="login-footer">
          Don't have an account yet? <Link to="/register">Create one here</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;