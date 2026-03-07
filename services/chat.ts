import api from '../lib/axios';

export type FriendPresence = {
  _id: string;
  username: string;
  email: string;
  image?: string;
  isOnline: boolean;
  lastSeenAt: string | null;
};

export type ChatMessage = {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    username: string;
    image?: string;
  };
  receiver: {
    _id: string;
    username: string;
    image?: string;
  };
  content: string;
  createdAt: string;
};

export type ConversationListItem = {
  _id: string;
  peer: {
    _id: string;
    username: string;
    image?: string;
    isOnline: boolean;
    lastSeenAt: string | null;
  } | null;
  lastMessage: {
    sender: string;
    content: string;
    createdAt: string;
  } | null;
  updatedAt: string;
};

export const chatService = {
  getFriends: async (): Promise<FriendPresence[]> => {
    const response = await api.get('/api/chat/friends');
    return response.data;
  },

  getConversations: async (): Promise<ConversationListItem[]> => {
    const response = await api.get('/api/chat/conversations');
    return response.data;
  },

  getMessagesWithFriend: async (friendId: string): Promise<{ conversationId: string; messages: ChatMessage[] }> => {
    const response = await api.get(`/api/chat/messages/${friendId}`);
    return response.data;
  },

  sendMessageToFriend: async (friendId: string, content: string): Promise<{ conversationId: string; message: ChatMessage }> => {
    const response = await api.post(`/api/chat/messages/${friendId}`, { content });
    return response.data;
  },
};
