'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import { chatService, ChatMessage, ConversationListItem, FriendPresence } from '@/services/chat';
import { connectChatSocket, disconnectChatSocket, getChatSocket } from '@/lib/socket';

const formatLastSeen = (isOnline: boolean, lastSeenAt: string | null) => {
  if (isOnline) return 'Online';
  if (!lastSeenAt) return 'Offline';

  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  if (diffMs < 60000) return 'Offline';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [friends, setFriends] = useState<FriendPresence[]>([]);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const activeFriendIdRef = useRef('');
  const currentUserIdRef = useRef('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const activeFriend = useMemo(
    () => friends.find((friend) => friend._id === activeFriendId) || null,
    [friends, activeFriendId]
  );

  const upsertMessage = (incoming: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((msg) => msg._id === incoming._id)) return prev;
      return [...prev, incoming];
    });
  };

  useEffect(() => {
    activeFriendIdRef.current = activeFriendId;
  }, [activeFriendId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: hasLoadedRef.current ? 'smooth' : 'auto',
    });

    hasLoadedRef.current = true;
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    const userCookie = Cookies.get('user');

    if (!token || !userCookie) {
      window.location.href = '/login';
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    let userId = '';
    try {
      userId = JSON.parse(userCookie)?._id || '';
      setCurrentUserId(userId);
    } catch {
      window.location.href = '/login';
      return;
    }

    const bootstrap = async () => {
      const [friendList] = await Promise.all([chatService.getFriends(), loadConversations()]);
      setFriends(friendList);
      if (friendList.length > 0) {
        setActiveFriendId(friendList[0]._id);
      }
    };

    bootstrap().catch(() => {});

    const socket = connectChatSocket(token);

    socket.on('presence:update', (payload: { userId: string; isOnline: boolean; lastSeenAt: string | null }) => {
      setFriends((prev) =>
        prev.map((friend) =>
          friend._id === payload.userId
            ? { ...friend, isOnline: payload.isOnline, lastSeenAt: payload.lastSeenAt }
            : friend
        )
      );
    });

    socket.on('message:new', (payload: { conversationId: string; message: ChatMessage }) => {
      const incoming = payload.message;
      if (!incoming) return;

      const senderId = incoming.sender?._id;
      const receiverId = incoming.receiver?._id;
      const activeThreadId = activeFriendIdRef.current;
      const currentUser = currentUserIdRef.current;
      const isCurrentThread =
        activeThreadId.length > 0 &&
        ((senderId === activeThreadId && receiverId === currentUser) ||
          (senderId === currentUser && receiverId === activeThreadId));

      if (isCurrentThread) upsertMessage(incoming);
      loadConversations();
    });

    socket.on('conversation:update', () => {
      loadConversations();
    });

    return () => {
      const activeSocket = getChatSocket();
      activeSocket?.off('presence:update');
      activeSocket?.off('message:new');
      activeSocket?.off('conversation:update');
      disconnectChatSocket();
    };
  }, []);

  useEffect(() => {
    if (!activeFriendId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    hasLoadedRef.current = false;

    chatService
      .getMessagesWithFriend(activeFriendId)
      .then((data) => {
        setMessages(data.messages);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [activeFriendId]);

  const handleSend = async () => {
    const content = newMessage.trim();
    if (!content || !activeFriendId || sending) return;

    setSending(true);
    try {
      const result = await chatService.sendMessageToFriend(activeFriendId, content);
      upsertMessage(result.message);
      setNewMessage('');
      loadConversations();
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const conversationByPeerId = new Map(
    conversations
      .filter((c) => c.peer?._id)
      .map((c) => [c.peer!._id, c])
  );

  return (
    <Layout
      title="Chat - Vibement"
      hideFooter
      mainClassName="flex-1 w-full px-4 pt-20 pb-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto h-full min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-full min-h-0">
          <section
            className="bg-white rounded-2xl overflow-hidden flex flex-col min-h-0"
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
          >
            <div className="px-4 py-3.5 border-b border-gray-100 flex-shrink-0">
              <h1 className="text-base font-semibold text-gray-900">Messages</h1>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-2">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-400">No friends yet</p>
                </div>
              ) : (
                friends.map((friend) => {
                  const isActive = friend._id === activeFriendId;
                  const conversation = conversationByPeerId.get(friend._id);

                  return (
                    <button
                      key={friend._id}
                      onClick={() => setActiveFriendId(friend._id)}
                      className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors ${
                        isActive ? 'bg-emerald-50 border-l-2 border-l-emerald-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          {friend.image ? (
                            <img
                              src={`http://localhost:5000${friend.image}`}
                              alt={friend.username}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-lg">
                              {friend.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span
                            className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              friend.isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`font-medium truncate text-sm ${isActive ? 'text-emerald-700' : 'text-gray-900'}`}>
                              {friend.username}
                            </p>
                            <span className={`text-xs flex-shrink-0 ${friend.isOnline ? 'text-emerald-500' : 'text-gray-400'}`}>
                              {formatLastSeen(friend.isOnline, friend.lastSeenAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {conversation?.lastMessage?.content || 'Start chatting'}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section
            className="bg-white rounded-2xl flex flex-col overflow-hidden min-h-0"
            style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
          >
            {activeFriend ? (
              <>
                <header className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
                  <div className="relative">
                    {activeFriend.image ? (
                      <img
                        src={`http://localhost:5000${activeFriend.image}`}
                        alt={activeFriend.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold">
                        {activeFriend.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span
                      className={`absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        activeFriend.isOnline ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-sm">{activeFriend.username}</h2>
                    <p className={`text-xs ${activeFriend.isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {formatLastSeen(activeFriend.isOnline, activeFriend.lastSeenAt)}
                    </p>
                  </div>
                </header>

                <div ref={messagesContainerRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50/50 min-h-0">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-400">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-400">No messages yet</p>
                      <p className="text-xs text-gray-300">Say hi to {activeFriend.username}!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = message.sender?._id === currentUserId;
                      return (
                        <div key={message._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm ${
                              isMine
                                ? 'bg-emerald-600 text-white rounded-br-sm'
                                : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm'
                            }`}
                            style={isMine ? { boxShadow: '0 2px 8px rgba(5,150,105,0.25)' } : { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                          >
                            <p className="leading-relaxed">{message.content}</p>
                            <p className={`text-[10px] mt-1 ${isMine ? 'text-emerald-200' : 'text-gray-400'}`}>
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <footer className="p-4 border-t border-gray-100 flex-shrink-0 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                      }}
                      placeholder={`Message ${activeFriend.username}...`}
                      className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-gray-50 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !newMessage.trim()}
                      className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm font-medium">Select a conversation</p>
                <p className="text-gray-400 text-xs">Add friends to start chatting in real time.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
