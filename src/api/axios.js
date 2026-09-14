import axios from 'axios';

// Render'da VITE_API_URL environment variable bo'ladi
// Lokalda — http://127.0.0.1:8000/api
const API_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Har bir so'rovga token qo'shish
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 401 xatolikda tokenni tozalash
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error && error.response && error.response.status;
        if (status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default API;