import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

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