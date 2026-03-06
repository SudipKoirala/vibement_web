# Frontend Services Architecture

## Overview

The services layer provides a centralized way to communicate with the backend API through typed interfaces. All API calls should go through services, not directly from components.

## Service Structure Pattern

Each service file follows this pattern:

```typescript
import api from '../lib/axios';

// Type definitions
export interface SomeData {
  _id: string;
  // ... other properties
}

// Service object with methods
export const someService = {
  method: async (params) => {
    // Implementation
  }
};
```

## Available Services

### auth.ts - Authentication
**Types:**
- `LoginCredentials` - Email and password for login
- `RegisterData` - Signup form data

**Methods:**
- `login(credentials)` - User login, returns token and user object
- `register(data)` - User registration
- `resetPassword(token, password)` - Reset forgotten password
- `requestPasswordReset(email)` - Request password reset email
- `verifyEmail(token)` - Verify email address

**Usage:**
```typescript
import { authService } from '@/services/auth';
const response = await authService.login({ email, password });
```

### post.ts - Post Management
**Types:**
- `Comment` - Comment on a post
- `Post` - Social media post with media, likes, comments

**Methods:**
- `getFeed()` - Get user's feed posts
- `createPost(formData)` - Create new post with optional media
- `deletePost(id)` - Delete a post
- `likePost(id)` - Like/unlike a post
- `addComment(postId, content)` - Add comment to post

**Usage:**
```typescript
import { postService } from '@/services/post';
const feed = await postService.getFeed();
```

### chat.ts - Messaging
**Types:**
- `FriendPresence` - Friend online/offline status
- `ChatMessage` - Individual message
- `ConversationListItem` - Conversation preview

**Methods:**
- `getFriends()` - Get list of friends with presence
- `getConversations()` - Get all conversations
- `getMessagesWithFriend(friendId)` - Get chat history with friend
- `sendMessageToFriend(friendId, content)` - Send message

**Usage:**
```typescript
import { chatService, ChatMessage } from '@/services/chat';
const conversations = await chatService.getConversations();
```

### notification.ts - Notifications
**Types:**
- `Notification` - Notification object with type and timestamp

**Methods:**
- `getNotifications()` - Fetch all notifications
- `markAsRead(id)` - Mark notification as read
- `deleteNotification(id)` - Delete notification

**Usage:**
```typescript
import { notificationService } from '@/services/notification';
const notifications = await notificationService.getNotifications();
```

### story.ts - Stories (Ephemeral Content)
**Types:**
- `StoryItem` - Single story media item
- `StoryGroup` - Group of stories from one user

**Methods:**
- `createStory(formData)` - Upload new story
- `getStoryFeed()` - Get friends' stories
- `deleteStory(id)` - Delete user's story
- `viewStory(id)` - Mark story as viewed

**Usage:**
```typescript
import { storyService, StoryGroup } from '@/services/story';
const stories = await storyService.getStoryFeed();
```

### social.ts - User Discovery & Profiles
**Types:**
- `UserSearchResult` - Search result with user info and online status
- `PublicProfile` - Full user profile information

**Methods:**
- `searchUsers(query)` - Search for users by username/name
- `getPublicProfile(userId)` - Get user's public profile
- `listFriends()` - Get current user's friends list
- `addFriend(userId)` - Send friend request
- `removeFriend(userId)` - Remove friend
- `acceptFriend(userId)` - Accept friend request
- `rejectFriend(userId)` - Reject friend request

**Usage:**
```typescript
import { socialService, UserSearchResult } from '@/services/social';
const results = await socialService.searchUsers('john');
```

## HTTP Client (axios.ts)

The `axios.ts` file provides a pre-configured axios instance:

**Features:**
- Base URL: `http://localhost:5000`
- Automatic Authorization header injection from cookies
- Request/response interceptors ready for enhancement

**Usage:**
```typescript
import api from '@/lib/axios';
const response = await api.get('/endpoint');
```

## WebSocket (socket.ts)

Real-time communication for chat:

**Methods:**
- `connectChatSocket(token)` - Establish WebSocket connection
- `getChatSocket()` - Get active socket instance
- `disconnectChatSocket()` - Close connection

**Events:**
- `message:new` - New message received
- `presence:update` - Friend online/offline status changed
- `conversation:update` - Conversation list updated

**Usage:**
```typescript
import { connectChatSocket, getChatSocket } from '@/lib/socket';
const socket = connectChatSocket(token);
socket.on('message:new', (data) => {
  // Handle new message
});
```

## Best Practices

1. **Always use services** - Never make API calls directly from components
2. **Handle errors in components** - Services throw errors that should be caught in components
3. **Type everything** - Import types from services for type safety
4. **Cookie management** - Auth token is handled automatically by axios interceptor
5. **Error handling** - Services may throw, always wrap calls in try/catch
6. **FormData for uploads** - Use FormData when uploading files (post, story)

## Example Component Usage

```typescript
import { postService, Post } from '@/services/post';
import { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postService.getFeed();
        setPosts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load feed');
      }
    };
    
    loadPosts();
  }, []);

  if (error) return <div>Error: {error}</div>;
  return <div>{/* Render posts */}</div>;
}
```

## Adding New Services

When adding a new feature:

1. Create a new service file in `services/`
2. Define TypeScript interfaces at the top
3. Export service object with methods
4. Import and use in components with proper error handling
5. Use the axios instance for API calls
6. Document in this file

## Frontend-Backend Contract

Services define the contract between frontend and backend:
- **Input**: Method parameters and types
- **Output**: Return types and interfaces
- **Errors**: HTTP error codes and response structure

Keep this in sync with backend API changes.
