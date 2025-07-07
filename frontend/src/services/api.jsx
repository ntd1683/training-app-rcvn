import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:80',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getCsrfToken = async () => {
  await api.get('/sanctum/csrf-cookie');
};

export const login = async (email, password, remember) => {
  await getCsrfToken();
  return api.post('/api/login', { email, password, remember });
};

export const logout = async (token) => {
  await getCsrfToken();
  return api.post('/api/logout', {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUser = async (token) => {
  return api.get('/api/user', {
    headers: { Authorization: `Bearer ${token}` },
  });
};