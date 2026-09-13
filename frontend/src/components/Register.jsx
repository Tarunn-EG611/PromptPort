import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import ErrorHandler from './common/ErrorHandler';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'PROMPT_ENGINEER' });
  const { username, email, password, confirmPassword, role } = formData;
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) navigate('/');
    return () => { dispatch(reset()); };
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
    <section className="login-container">
      <h2>Create an Account</h2>

      {isError && <ErrorHandler error={message} />}
      {passwordError && <ErrorHandler error={passwordError} />}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            required
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            required
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <select name="role" value={role} onChange={onChange} required>
            <option value="PROMPT_ENGINEER">Prompt Engineer</option>
            <option value="PROMPT_COLLECTOR">Prompt Collector</option>
            <option value="TEAM_LEAD">Team Lead</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            required
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm Password"
            required
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Register'}
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#64748b' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default Register;
