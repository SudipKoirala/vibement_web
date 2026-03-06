'use client';

import Link from 'next/link';
import { UserSearchResult } from '@/services/social';

interface FriendsSidebarProps {
    friends: UserSearchResult[];
}

export default function FriendsSidebar({ friends }: FriendsSidebarProps) {
    const online = friends.filter((f) => f.isOnline);
    const offline = friends.filter((f) => !f.isOnline);

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Friends</h3>
                </div>

                {friends.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                        <p className="text-xs text-gray-400">No friends yet</p>
                        <Link href="/search" className="text-xs text-emerald-600 font-medium mt-1 inline-block">Find people</Link>
                    </div>
                ) : (
                    <div className="py-2">
                        {/* Online */}
                        {online.length > 0 && (
                            <>
                                <p className="px-4 pt-1 pb-1 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Online — {online.length}</p>
                                {online.map((f) => (
                                    <Link key={f._id} href={`/social/${f._id}`} className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors group">
                                        <div className="relative flex-shrink-0">
                                            {f.image ? (
                                                <img src={`http://localhost:5000${f.image}`} alt={f.username} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                                                    {f.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                                        </div>
                                        <span className="text-sm text-gray-800 group-hover:text-emerald-700 font-medium truncate">{f.username}</span>
                                    </Link>
                                ))}
                            </>
                        )}

                        {/* Offline */}
                        {offline.length > 0 && (
                            <>
                                {online.length > 0 && <div className="my-1 mx-4 border-t border-gray-100" />}
                                <p className="px-4 pt-1 pb-1 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Offline</p>
                                {offline.map((f) => (
                                    <Link key={f._id} href={`/social/${f._id}`} className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors group">
                                        <div className="relative flex-shrink-0">
                                            {f.image ? (
                                                <img src={`http://localhost:5000${f.image}`} alt={f.username} className="w-8 h-8 rounded-full object-cover opacity-60" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                                                    {f.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-400 truncate">{f.username}</span>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
}
