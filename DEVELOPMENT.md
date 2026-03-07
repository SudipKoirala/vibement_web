# Frontend Development Guidelines

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Backend API running at `http://localhost:5000`

### Setup

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router (Route-based pages)
│   ├── globals.css        # Global styles and animations
│   ├── page.tsx           # Home/landing page
│   ├── login/             # Auth pages (login, register)
│   ├── feed/              # Social feed pages
│   ├── chat/              # Messaging feature
│   ├── search/            # User search
│   ├── social/[id]/       # User profile pages
│   └── auth/              # Password reset/recovery
│
├── components/            # Shared UI components
│   ├── Navbar.tsx         # Top navigation with notifications
│   ├── Layout.tsx         # Main layout wrapper with footer
│   ├── LoginForm.tsx      # Login form with validation
│   └── RegisterForm.tsx   # Registration form with validation
│
├── lib/                   # Utility modules
│   ├── axios.ts           # HTTP client with auth interceptor
│   └── socket.ts          # WebSocket connection manager
│
├── services/              # API layer (one per feature)
│   ├── auth.ts            # Login, register, password reset
│   ├── post.ts            # Create, delete, like posts
│   ├── chat.ts            # Messages, conversations
│   ├── notification.ts    # User notifications
│   ├── social.ts          # Friends, search, profiles
│   └── story.ts           # Stories, ephemeral content
│
└── public/                # Static assets (images, icons, etc.)
```

## Code Organization Rules

### Component Placement

- **`components/`** - Large, reusable components used on multiple pages
  - Layout, Navbar, LoginForm, RegisterForm
  - Examples: Modal, Card, Sidebar

- **`app/[route]/`** - Page-specific components live next to their page
  - Keep page-specific components in the same directory
  - Example: `app/feed/page.tsx` can have feed-specific components nearby

### Services Layer

- **All API calls must go through services** - No direct fetch/axios in components
- **One service file per major feature** - auth, post, chat, etc.
- **Export types alongside service methods** - For proper TypeScript support

### State Management

- Use **`useState` and `useEffect`** for local component state
- Use **cookies** for auth persistence (handled automatically)
- No Redux or external state library needed currently

## Creating a New Feature

### 1. Define the Service

Create `services/feature.ts`:

```typescript
import api from '@/lib/axios';

// Types
export interface FeatureItem {
  _id: string;
  name: string;
  // ... other fields
}

// Service methods
export const featureService = {
  getList: async () => {
    const response = await api.get('/api/feature');
    return response.data;
  },

  create: async (data: FeatureItem) => {
    const response = await api.post('/api/feature', data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/api/feature/${id}`);
  }
};
```

### 2. Create the Page

In `app/feature/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { featureService, FeatureItem } from '@/services/feature';

export default function FeaturePage() {
  const [items, setItems] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await featureService.getList();
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Feature – Vibement">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {/* Render items */}
    </Layout>
  );
}
```

### 3. Update Navigation (if needed)

If this is a main feature, add to `NAV_ITEMS` in `components/Navbar.tsx`:

```typescript
const NAV_ITEMS = [
  // ... existing items
  {
    href: '/feature',
    label: 'Feature',
    icon: (active: boolean) => (/* SVG icon */)
  }
];
```

## Styling Guidelines

### Tailwind CSS Usage

```typescript
className="
  // Layout
  flex flex-col items-center justify-between
  // Spacing
  p-4 mb-6 space-y-4
  // Colors
  bg-emerald-50 text-gray-900 border-gray-200
  // Responsive
  w-full md:w-1/2 lg:w-1/3
  // States
  hover:bg-emerald-100 active:scale-95 disabled:opacity-50
  // Transitions
  transition-colors duration-200
"
```

### Color Palette

- **Primary**: Emerald/Green (`emerald-500`, `emerald-600`, etc.)
- **Secondary**: Teal (`teal-500`, `teal-600`, etc.)
- **Neutral**: Gray (`gray-50` to `gray-900`)
- **Feedback**: 
  - Red (`red-50`, `red-500`) - Errors, destructive actions
  - Blue (`blue-50`, `blue-500`) - Info, secondary actions
  - Green (`green-50`, `green-500`) - Success

## Form Handling

Using react-hook-form + Zod:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

## Error Handling

Always wrap service calls in try-catch:

```typescript
try {
  const data = await myService.getData();
  setState(data);
} catch (err: any) {
  // Preferred: Use backend error message
  const message = err.response?.data?.message || 'Something went wrong';
  setError(message);
}
```

## Authentication Flow

1. User submits login form
2. LoginForm calls `authService.login()`
3. Service receives token and user object
4. Login form stores both in cookies (via `Cookies.set()`)
5. axios interceptor automatically adds `Authorization: Bearer {token}` to all requests
6. Redirects to `/feed`

**Protected routes:** Check for token in `Layout.tsx` - if missing, redirect to `/login`

## Real-time Features (Chat)

```typescript
import { connectChatSocket, getChatSocket } from '@/lib/socket';

useEffect(() => {
  const socket = connectChatSocket(token);
  
  socket.on('message:new', (payload) => {
    // Handle new message
  });

  return () => {
    // Clean up if needed
  };
}, [token]);
```

## Performance Tips

1. **Code splitting** - Next.js does this automatically with App Router
2. **Image optimization** - Use Next.js Image component
3. **React.memo** - Memoize large lists or expensive renders
4. **useCallback** - Memoize callbacks passed to child components
5. **useMemo** - Cache expensive computations

## Debugging

### Browser DevTools

1. Open DevTools (F12)
2. **Network tab** - See all API calls and responses
3. **Application tab** - Check cookies (token, user)
4. **Console** - Check for errors (ideally should be empty in production)

### Common Issues

**"Token not found" error:**
- Check Network tab: Is token being sent in requests?
- Check Application → Cookies: Is token stored?
- Clear cookies and re-login

**"Cannot find module" error:**
- Check import path - should start with `@/` for path alias
- Run `npm install` if new packages were added
- Restart dev server

**Socket connection fails:**
- Backend must be running at `http://localhost:5000`
- Check Network tab → WS (WebSocket) tab
- Verify token is valid

## Deployment Checklist

- [ ] Environment variables set for production API URL
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Chat connections work
- [ ] Images/assets load properly
- [ ] Mobile responsive on smaller screens
- [ ] No hardcoded localhost URLs

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Classes](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [react-hook-form Docs](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## Questions or Issues?

Refer to the architecture documentation:
- `ARCHITECTURE.md` - Project structure and principles
- `SERVICES.md` - Service layer with examples
- `CLEANUP_SUMMARY.md` - Recent cleanup changes
