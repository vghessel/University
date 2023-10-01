import axios from 'axios'

const URL = 'https://localhost:8000/api/'

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const LOGIN = axios.create({
  baseURL: URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
