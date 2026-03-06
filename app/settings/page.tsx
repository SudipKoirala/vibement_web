'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Cookies from 'js-cookie';
import { socialService } from '@/services/social';
import { notificationService } from '@/services/notification';
import Link from 'next/link';

export default function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [username, setUsername] = useState('');
    const [restoring, setRestoring] = useState(false);
    const [restoreMsg, setRestoreMsg] = useState('');

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try {
                const user = JSON.parse(userCookie);
                setNotificationsEnabled(user.notificationsEnabled ?? true);
                setUsername(user.username || '');
            } catch { }
        }
        // Also fetch fresh from server
        socialService.getMe().then((user) => {
            setNotificationsEnabled(user.notificationsEnabled ?? true);
            setUsername(user.username || '');
            Cookies.set('user', JSON.stringify(user));
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleToggleNotifications = async () => {
        setToggling(true);
        try {
            const result = await socialService.toggleNotifications();
            setNotificationsEnabled(result.notificationsEnabled);
            // Update cookie
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const user = JSON.parse(userCookie);
                Cookies.set('user', JSON.stringify({ ...user, notificationsEnabled: result.notificationsEnabled }), { expires: 7 });
            }
            // Tell Layout immediately — no refresh needed
            if (result.notificationsEnabled) {
                window.dispatchEvent(new CustomEvent('bell-enabled'));
            } else {
                window.dispatchEvent(new CustomEvent('bell-disabled'));
            }
        } catch { } finally { setToggling(false); }
    };

    const handleRestoreNotifications = async () => {
        setRestoring(true);
        setRestoreMsg('');
        try {
            await notificationService.restore();
            setRestoreMsg('Hidden notifications restored!');
        } catch {
            setRestoreMsg('Failed to restore. Try again.');
        } finally {
            setRestoring(false);
            setTimeout(() => setRestoreMsg(''), 3000);
        }
    };

    return (
        <Layout title="Settings – Vibement">
            <div className="max-w-5xl mx-auto space-y-5">

                {/* ── Profile Hero ── */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 24px rgba(5,150,105,0.3)' }}
                >
                    <div className="px-6 py-6 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                            {username ? username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">{username || 'Your Account'}</h1>
                            <p className="text-emerald-100 text-sm mt-0.5">Manage your preferences</p>
                        </div>
                    </div>
                </div>

                {/* ── Section: Account ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1 mb-2">Account</p>
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                        {/* Profile Row */}
                        <Link
                            href="/user/profile"
                            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Profile</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Username, email & photo</p>
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <div className="h-px bg-gray-100 mx-5" />

                        {/* Security Row */}
                        <Link
                            href="/user/profile"
                            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Security</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Change your password</p>
                                </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* ── Section: Notifications ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1 mb-2">Notifications</p>
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                        {/* Toggle Row */}
                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${notificationsEnabled ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                    <svg className={`w-5 h-5 transition-colors ${notificationsEnabled ? 'text-emerald-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {notificationsEnabled ? 'You will receive notifications' : 'Focus mode — notifications paused'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleToggleNotifications}
                                disabled={toggling || loading}
                                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                aria-label="Toggle notifications"
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100 mx-5" />

                        {/* Restore Row */}
                        <div className="flex items-center justify-between px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Hidden Notifications</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Restore previously hidden alerts</p>
                                    {restoreMsg && (
                                        <p className={`text-xs mt-1 font-medium ${restoreMsg.includes('Failed') ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {restoreMsg}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleRestoreNotifications}
                                disabled={restoring}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
                            >
                                {restoring ? 'Restoring…' : 'Restore'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Section: Danger Zone ── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 px-1 mb-2">Session</p>
                    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                        <button
                            onClick={() => {
                                Cookies.remove('token');
                                Cookies.remove('user');
                                window.location.href = '/login';
                            }}
                            className="flex items-center gap-3 w-full px-5 py-4 hover:bg-red-50 transition-colors group text-left"
                        >
                            <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-red-600">Log Out</p>
                                <p className="text-xs text-gray-400 mt-0.5">Sign out of your account</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Caption */}
                <p className="text-center text-xs text-gray-300 py-1">
                    Vibement · Built with ♥ · v1.0
                </p>
            </div>
        </Layout>
    );
}
