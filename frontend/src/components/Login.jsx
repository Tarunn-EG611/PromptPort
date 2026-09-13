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
    <section className="login-container">
      <h2>Login to PromptPort</h2>

      {isError && <ErrorHandler error={message} />}

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
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            required
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
};

export default Login;