import axios from 'axios'

const URL = '/django'

export const API = axios.create({
  baseURL: URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
