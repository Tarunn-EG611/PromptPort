import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, username, role } = response.data;
  const user = { username, role };

  if (token) {
    localStorage.setItem('promptport_token', token);
  }
  localStorage.setItem('promptport_user', JSON.stringify(user));

  response.data.user = user;
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  const { token, username, role } = response.data;
  const user = { username, role };

  if (token) {
    localStorage.setItem('promptport_token', token);
  }
  localStorage.setItem('promptport_user', JSON.stringify(user));

  response.data.user = user;
  return response.data;
};

const logout = () => {
  localStorage.removeItem('promptport_token');
  localStorage.removeItem('promptport_user');
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('promptport_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const authService = { login, register, logout, getCurrentUser };

export default authService;