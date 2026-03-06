# Frontend Architecture

## Directory Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── auth/                # Authentication routes
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── chat/                # Chat page
│   ├── feed/                # Feed pages
│   │   ├── page.tsx         # Main feed
│   │   ├── create/          # Post creation
│   │   ├── create-story/    # Story creation
│   │   └── videos/          # Video feed
│   ├── login/               # Login/Register page
│   ├── search/              # Search page
│   ├── settings/            # Settings page
│   ├── social/              # User profiles
│   └── user/                # User routes
│
├── components/              # Reusable React components
│   ├── Layout.tsx           # Main layout wrapper
│   ├── Navbar.tsx           # Navigation bar
│   ├── LoginForm.tsx        # Login form component
│   └── RegisterForm.tsx     # Registration form component
│
├── lib/                     # Utility functions and configuration
│   ├── axios.ts             # Axios instance with interceptors
│   └── socket.ts            # Socket.IO connection management
│
├── services/                # API service layer (REST calls)
│   ├── auth.ts              # Authentication service
│   ├── chat.ts              # Chat service
│   ├── notification.ts      # Notification service
│   ├── post.ts              # Post service
│   ├── social.ts            # Social/User service
│   └── story.ts             # Story service
│
└── public/                  # Static assets

```

## Key Principles

1. **Services Layer**: All API calls go through the `services/` folder using the axios instance
2. **Components**: Reusable UI components that can be used across pages
3. **Pages**: Each route has its own directory under `app/`
4. **Types**: Service files export TypeScript types alongside service methods
5. **Socket.IO**: Chat uses WebSocket via Socket.IO for real-time messaging

## State Management

- ReactHooks (useState, useEffect, useContext) for component state
- No external state management library (Redux, Zustand, etc.)
- Cookies for auth token and user data persistence

## Form Handling

- react-hook-form for form state management
- Zod for form validation schemas
- Both LoginForm and RegisterForm use this pattern

## Dependencies

**Core:**
- React 19.2.3
- Next.js 16.1.4
- TypeScript 5.9.3

**HTTP & Real-time:**
- axios - HTTP client
- socket.io-client - WebSocket communication

**UI & Styling:**
- Tailwind CSS 4.0.0
- @tailwindcss/postcss for PostCSS integration

**Forms & Validation:**
- react-hook-form - Form state
- @hookform/resolvers - Form validation integration
- Zod - Schema validation

**Utilities:**
- js-cookie - Cookie management

## Removed (Unused)

- ~~clsx~~ - Unused utility library
- ~~tailwind-merge~~ - Unused utility library
- ~~Button.tsx~~ - Empty placeholder component (to be deleted)
- ~~InputField.tsx~~ - Empty placeholder component (to be deleted)
- ~~actions/auth.ts~~ - Unused auth wrapper (to be deleted)

## Best Practices

1. All API calls must go through services
2. Auth token is stored in cookies and sent via axios interceptor
3. Components should be functional and hooks-based
4. Use CSS modules or inline Tailwind classes for styling
5. Keep components focused and single-responsibility
6. Use TypeScript for type safety
