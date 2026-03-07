import api from '../lib/axios';

export type StoryItem = {
    _id: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    createdAt: string;
    expiresAt: string;
};

export type StoryGroup = {
    author: { _id: string; username: string; image?: string };
    stories: StoryItem[];
};

export const storyService = {
    getStoryFeed: async (): Promise<StoryGroup[]> => {
        const response = await api.get('/api/stories/feed');
        return response.data;
    },

    createStory: async (formData: FormData): Promise<StoryItem> => {
        const response = await api.post('/api/stories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteStory: async (id: string): Promise<void> => {
        await api.delete(`/api/stories/${id}`);
    },
};
