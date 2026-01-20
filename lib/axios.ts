import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:5050',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized
                console.error('Unauthorized access - please log in again.');
                // Optional: clear cookies or redirect
                // Cookies.remove('token');
                // window.location.href = '/login';
            } else if (error.response.status === 500) {
                console.error('Server error - please try again later.');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
