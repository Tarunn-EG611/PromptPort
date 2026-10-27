import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import ErrorHandler from './common/ErrorHandler';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PROMPT_ENGINEER',
  });
  const { username, email, password, confirmPassword, role } = formData;
  const [passwordError, setPasswordError] = useState('');

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError('');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    dispatch(register({ username, email, password, role }));
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
          <h2>Create account</h2>
          <p className="login-subtitle">Join PromptPort prompt engineering hub</p>
        </div>

        {isError && <ErrorHandler error={message} />}
        {passwordError && <ErrorHandler error={passwordError} />}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              placeholder="choose a username"
              required
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              placeholder="you@company.com"
              required
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={role} onChange={onChange} required>
              <option value="PROMPT_ENGINEER">Prompt Engineer</option>
              <option value="PROMPT_COLLECTOR">Prompt Collector</option>
              <option value="TEAM_LEAD">Team Lead</option>
            </select>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="••••••••"
              required
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" /> Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <p className="login-footer">
          Already registered? <Link to="/login">Sign in here</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;
