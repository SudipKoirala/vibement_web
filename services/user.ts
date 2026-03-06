import api from '../lib/axios';

export const userService = {
    getAllUsers: async (page: number = 1, limit: number = 10) => {
        const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await api.get(`/api/admin/users/${id}`);
        return response.data;
    },

    createUser: async (formData: FormData) => {
        const response = await api.post('/api/admin/users', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateUser: async (id: string, formData: FormData) => {
        const response = await api.put(`/api/admin/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/api/admin/users/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/api/admin/users/stats');
        return response.data;
    },
};
