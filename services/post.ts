import api from '../lib/axios';

export type Comment = {
    _id: string;
    author: { _id: string; username: string; image?: string };
    content: string;
    createdAt: string;
};

export type Post = {
    _id: string;
    author: { _id: string; username: string; image?: string };
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    visibility: 'public' | 'friends';
    likes: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
};

export const postService = {
    createPost: async (formData: FormData): Promise<Post> => {
        const response = await api.post('/api/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getFeed: async (): Promise<Post[]> => {
        const response = await api.get('/api/posts/feed');
        return response.data;
    },

    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/api/posts/${id}`);
    },

    likePost: async (id: string): Promise<{ liked: boolean; likesCount: number }> => {
        const response = await api.post(`/api/posts/${id}/like`);
        return response.data;
    },

    addComment: async (id: string, content: string): Promise<Comment> => {
        const response = await api.post(`/api/posts/${id}/comments`, { content });
        return response.data;
    },

    getComments: async (id: string): Promise<Comment[]> => {
        const response = await api.get(`/api/posts/${id}/comments`);
        return response.data;
    },
};
