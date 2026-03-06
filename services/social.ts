import api from '../lib/axios';

export type UserSearchResult = {
    _id: string;
    username: string;
    email: string;
    image?: string;
    isOnline: boolean;
    isFriend: boolean;
};

export type PublicProfile = {
    _id: string;
    username: string;
    email: string;
    image?: string;
    isOnline: boolean;
    lastSeenAt: string | null;
    friendsCount: number;
    postCount: number;
    isFriend: boolean;
};

export const socialService = {
    searchUsers: async (q: string): Promise<UserSearchResult[]> => {
        const response = await api.get(`/api/social/search?q=${encodeURIComponent(q)}`);
        return response.data;
    },

    getUserProfile: async (id: string): Promise<PublicProfile> => {
        const response = await api.get(`/api/social/users/${id}`);
        return response.data;
    },

    toggleFriend: async (id: string): Promise<{ isFriend: boolean; friendsCount: number }> => {
        const response = await api.post(`/api/social/friends/${id}`);
        return response.data;
    },

    listFriends: async () => {
        const response = await api.get('/api/social/friends');
        return response.data;
    },

    toggleNotifications: async (): Promise<{ notificationsEnabled: boolean }> => {
        const response = await api.post('/api/social/notifications/toggle');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },
};
