import api from '../lib/axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/api/auth/register', data);
        return response.data;
    },
};
