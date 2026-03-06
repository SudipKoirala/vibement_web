import api from '../lib/axios';

export type Notification = {
    _id: string;
    sender: { _id: string; username: string; image?: string };
    type: 'post_text' | 'post_image' | 'post_video';
    message: string;
    postId?: string;
    read: boolean;
    hidden: boolean;
    createdAt: string;
};

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const res = await api.get('/api/notifications');
        return res.data;
    },

    markRead: async (id: string): Promise<Notification> => {
        const res = await api.patch(`/api/notifications/${id}/read`);
        return res.data;
    },

    hide: async (id: string): Promise<Notification> => {
        const res = await api.patch(`/api/notifications/${id}/hide`);
        return res.data;
    },

    restore: async (): Promise<{ restored: boolean }> => {
        const res = await api.post('/api/notifications/restore');
        return res.data;
    },

    markAllRead: async (): Promise<{ success: boolean }> => {
        const res = await api.post('/api/notifications/read-all');
        return res.data;
    },
};
