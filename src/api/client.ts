import axios from 'axios';

const API_KEY = import.meta.env.VITE_CAT_API_KEY;

export const catApi = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  headers: {
    'x-api-key': API_KEY,
  },
});
