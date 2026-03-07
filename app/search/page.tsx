'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { socialService, UserSearchResult } from '@/services/social';

const API_BASE = 'http://localhost:5000';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await socialService.searchUsers(query);
                setResults(data);
            } catch { /* ignore */ }
            finally { setLoading(false); }
        }, 350);
        return () => clearTimeout(timer);
    }, [query]);

    const handleFriendToggle = async (user: UserSearchResult) => {
        if (pendingIds.has(user._id)) return;
        setPendingIds((prev) => new Set(prev).add(user._id));
        try {
            const result = await socialService.toggleFriend(user._id);
            setResults((prev) => prev.map((u) => u._id === user._id ? { ...u, isFriend: result.isFriend } : u));
        } catch { /* ignore */ }
        finally { setPendingIds((prev) => { const s = new Set(prev); s.delete(user._id); return s; }); }
    };

    return (
        <Layout title="Search – Vibement">
            <div className="max-w-xl mx-auto space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Find People</h1>
                    <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username…"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-sm"
                            autoFocus
                        />
                    </div>
                </div>

                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 space-y-2"><div className="h-3 bg-gray-200 rounded w-1/3" /><div className="h-2 bg-gray-200 rounded w-1/2" /></div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <div className="space-y-2">
                        {results.map((user) => (
                            <div key={user._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                                <Link href={`/social/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                                    {user.image ? (
                                        <img src={`${API_BASE}${user.image}`} alt={user.username} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg flex-shrink-0">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{user.username}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                                            <span className="text-xs text-gray-500">{user.isOnline ? 'Online' : 'Offline'}</span>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleFriendToggle(user)}
                                    disabled={pendingIds.has(user._id)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${user.isFriend
                                            ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        }`}
                                >
                                    {pendingIds.has(user._id) ? '…' : user.isFriend ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && query.trim() && results.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-gray-500 text-sm">No users found for <strong>"{query}"</strong></p>
                    </div>
                )}

                {!query.trim() && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">Start typing to find friends</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
