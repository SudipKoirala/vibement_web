import { authService, LoginCredentials, RegisterData } from '../services/auth';
import Cookies from 'js-cookie';

export const authActions = {
    login: async (credentials: LoginCredentials) => {
        try {
            const data = await authService.login(credentials);

            if (data.token) {
                Cookies.set('token', data.token, { expires: 7 }); // 7 days
            }
            if (data.user) {
                Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
            }

            return { success: true, data };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, error: message };
        }
    },

    register: async (data: RegisterData) => {
        try {
            const result = await authService.register(data);
            console.log('Registration response:', result);

            if (result.token) {
                Cookies.set('token', result.token, { expires: 7 });
            }
            if (result.user) {
                Cookies.set('user', JSON.stringify(result.user), { expires: 7 });
            }
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return { success: false, error: message };
        }
    },

    logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
    }
};
