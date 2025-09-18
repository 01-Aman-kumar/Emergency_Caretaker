import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL || '';
const axiosInstance = axios.create({ baseURL: `${API_URL}/api` });
export default axiosInstance;
