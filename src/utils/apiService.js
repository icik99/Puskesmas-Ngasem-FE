import axios from 'axios';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_LOCAL,
  timeout: 6000,
  withCredentials: true,
});

export default Api;
