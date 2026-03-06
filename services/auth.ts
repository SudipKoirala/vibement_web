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

    updateProfile: async (id: string, formData: FormData) => {
        const response = await api.put(`/api/auth/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post('/api/auth/reset-password', { token, newPassword });
        return response.data;
    },
};
