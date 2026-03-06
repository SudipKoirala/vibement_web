'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { notificationService, Notification } from '@/services/notification';
import { socialService } from '@/services/social';
import appLogo from '@/app/logo.png';

const API_BASE = 'http://localhost:5000';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['600', '700'],
});

const NAV_ITEMS = [
    {
        href: '/feed', label: 'Feed', icon: (active: boolean) => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h7" />
            </svg>
        )
    },
    {
        href: '/search', label: 'Search', icon: (active: boolean) => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
    },
    {
        href: '/feed/create', label: 'Post', icon: (active: boolean) => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        )
    },
    {
        href: '/feed/videos', label: 'Videos', icon: (active: boolean) => (
            <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        href: '/chat', label: 'Chat', icon: (active: boolean) => (
            <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        )
    },
];

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [navVisible, setNavVisible] = useState(true);
    const lastScrollY = useRef(0);

    // ── Notifications ──────────────────────────────────────────
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [bellOpen, setBellOpen] = useState(false);
    const [bellHidden, setBellHidden] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    // ── Profile dropdown ───────────────────────────────────────
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Load user from cookie
    useEffect(() => {
        try {
            const u = JSON.parse(Cookies.get('user') || '{}');
            setUser(u);
            if (u.notificationsEnabled === false) setBellHidden(true);
        } catch { }
    }, []);

    // Poll notifications
    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch { }
    }, []);

    useEffect(() => {
        if (bellHidden) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications, bellHidden]);

    // Close dropdowns
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Listen for bell enable/disable
    useEffect(() => {
        const onEnable = () => setBellHidden(false);
        const onDisable = () => setBellHidden(true);
        window.addEventListener('bell-enabled', onEnable);
        window.addEventListener('bell-disabled', onDisable);
        return () => {
            window.removeEventListener('bell-enabled', onEnable);
            window.removeEventListener('bell-disabled', onDisable);
        };
    }, []);

    // navbar slides back in with animation
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current + 4) setNavVisible(false);
            else if (currentY < lastScrollY.current - 4) setNavVisible(true);
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href === '/feed') return pathname === '/feed';
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch { }
    };

    const handleHideBell = async () => {
        try {
            await socialService.toggleNotifications();
            setBellHidden(true);
            setBellOpen(false);
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const u = JSON.parse(userCookie);
                Cookies.set('user', JSON.stringify({ ...u, notificationsEnabled: false }), { expires: 7 });
            }
        } catch { }
    };

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/login';
    };

    return (
        <>
         
            <header
                className="w-full fixed top-0 left-0 right-0 z-50"
                style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: navVisible ? '0 2px 20px rgba(5,150,105,0.35)' : 'none',
                    // Only animate when reappearing (scroll-up); instant hide feels like it scrolled away naturally
                    transition: navVisible ? 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
                }}
            >
                {/* Logo — left side*/}
                <div className="flex h-16 w-full items-center pl-6 pr-28">
                    <Link href="/feed" className="flex items-center gap-3 text-white">
                       <img
    src={appLogo.src}
    alt="Vibement logo"
    className="h-14 w-14 ml-20 object-contain"
/>
                        <span className={`${poppins.className} text-[18px] font-semibold tracking-[0.04em] text-white`}>Vibement</span>
                    </Link>
                </div>

              
                <div className="absolute right-6 inset-y-0 flex items-center gap-3">
                        {/* Notification Bell */}
                        {!bellHidden && (
                            <div ref={bellRef} className="relative">
                                <button
                                    onClick={() => { setBellOpen((o) => !o); setProfileOpen(false); }}
                                    className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                                    aria-label="Notifications"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {bellOpen && (
                                    <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]">
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                                                {unreadCount > 0 && (
                                                    <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <button onClick={handleMarkAllRead} title="Mark all as read" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap">
                                                        Read all
                                                    </button>
                                                )}
                                                <button onClick={handleHideBell} title="Hide notifications bell" className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* List */}
                                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                            {notifications.length === 0 ? (
                                                <div className="flex flex-col items-center py-10 gap-2">
                                                    <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                    </svg>
                                                    <p className="text-sm text-gray-400">No notifications yet</p>
                                                    <p className="text-xs text-gray-300">You&apos;ll see posts from friends here</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div key={n._id} className={`px-4 py-3 flex gap-3 ${!n.read ? 'bg-emerald-50/40' : ''}`}>
                                                        <div className="flex-shrink-0">
                                                            {n.sender?.image ? (
                                                                <img src={`${API_BASE}${n.sender.image}`} alt="" className="w-9 h-9 rounded-full object-cover" />
                                                            ) : (
                                                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                                                                    {n.sender?.username?.charAt(0).toUpperCase() || '?'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-gray-800 leading-snug">{n.message}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                                                            {!n.read && (
                                                                <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full">New</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Avatar*/}
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() => { setProfileOpen((o) => !o); setBellOpen(false); }}
                                className="w-9 h-9 rounded-full bg-white/20 overflow-hidden ring-2 ring-white/30 hover:ring-white/60 transition-all"
                                aria-label="Profile menu"
                            >
                                {user?.image ? (
                                    <img src={`${API_BASE}${user.image}`} alt="profile" className="object-cover w-full h-full" />
                                ) : (
                                    <span className="text-white font-bold text-sm flex items-center justify-center w-full h-full">
                                        {user?.username?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                )}
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || 'User'}</p>
                                        <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/user/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                        <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link>
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
            </header>

            {/* ── BOTTOM FLOATING NAV ── */}
            <div
                className="fixed left-0 right-0 z-[100] flex justify-center px-5 pointer-events-none"
                style={{
                    bottom: '1.5rem',
                    transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: navVisible ? 'translateY(0)' : 'translateY(calc(100% + 1.5rem))',
                }}
            >
                <nav
                    className="pointer-events-auto w-full max-w-sm flex items-center justify-around px-3 py-2 rounded-2xl"
                    style={{
                        background: 'rgba(209,250,229,0.88)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '0 8px 32px rgba(5,150,105,0.18), 0 1px 0 rgba(255,255,255,0.6) inset',
                        border: '1px solid rgba(16,185,129,0.25)',
                    }}
                >
                    {NAV_ITEMS.map(({ href, label, icon }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 select-none ${active ? 'text-emerald-900' : 'text-emerald-700 hover:text-emerald-900'}`}
                                style={active ? {
                                    background: 'rgba(255,255,255,0.85)',
                                    boxShadow: '0 2px 10px rgba(5,150,105,0.2)',
                                } : {}}
                            >
                                <span className={`transition-transform duration-300 ${active ? 'scale-105' : ''}`}>
                                    {icon(active)}
                                </span>
                                {active && (
                                    <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap pr-0.5">
                                        {label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
