import axios from 'axios';

// const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;
// const API_URL = 'http://localhost:3000/api/auth';
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const register = (username: string, password: string) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const login = (username: string, password: string) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export const getMe = (token: string) => {
  return axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCash = (token: string) => {
  return axios.get(`${API_URL}/cash`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};