'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { socialService, PublicProfile } from '@/services/social';
import { postService, Post } from '@/services/post';
import Cookies from 'js-cookie';
import Link from 'next/link';

const API_BASE = 'http://localhost:5000';

function formatPresence(isOnline: boolean, lastSeenAt: string | null) {
    if (isOnline) return { label: 'Online', color: 'bg-emerald-400' };
    if (!lastSeenAt) return { label: 'Offline', color: 'bg-gray-300' };
    const mins = Math.floor((Date.now() - new Date(lastSeenAt).getTime()) / 60000);
    if (mins < 2) return { label: '1m ago', color: 'bg-yellow-400' };
    if (mins < 60) return { label: `${mins}m ago`, color: 'bg-gray-400' };
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return { label: `${hrs}h ago`, color: 'bg-gray-300' };
    return { label: 'Long ago', color: 'bg-gray-300' };
}

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState('');
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            try { setCurrentUserId(JSON.parse(userCookie)._id || ''); } catch { }
        }
        if (!id) return;
        Promise.all([
            socialService.getUserProfile(id),
            postService.getFeed(),
        ]).then(([prof, feedPosts]) => {
            setProfile(prof);
            setIsFriend(prof.isFriend);
            // Only show their posts visible in my feed
            setPosts(feedPosts.filter((p) => p.author._id === id));
        }).catch(() => router.push('/search')).finally(() => setLoading(false));
    }, [id]);

    const handleFriendToggle = async () => {
        if (!profile || pending) return;
        setPending(true);
        try {
            const result = await socialService.toggleFriend(id);
            setIsFriend(result.isFriend);
            setProfile((prev) => prev ? { ...prev, friendsCount: prev.friendsCount + (result.isFriend ? 1 : -1), isFriend: result.isFriend } : prev);
        } catch { } finally { setPending(false); }
    };

    const presence = profile ? formatPresence(profile.isOnline, profile.lastSeenAt) : null;

    if (loading) {
        return (
            <Layout title="Profile – Vibement">
                <div className="max-w-2xl mx-auto animate-pulse space-y-4">
                    <div className="bg-white rounded-2xl p-8 flex gap-6 items-center border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-3"><div className="h-5 bg-gray-200 rounded w-1/3" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-2xl" />)}
                    </div>
                </div>
            </Layout>
        );
    }

    if (!profile) return null;
    const isOwnProfile = currentUserId === id;

    return (
        <Layout title={`${profile.username} – Vibement`}>
            <div className="max-w-2xl mx-auto space-y-5">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        {/* Avatar */}
                        {profile.image ? (
                            <img src={`${API_BASE}${profile.image}`} alt={profile.username} className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100 flex-shrink-0" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-4xl flex-shrink-0">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                                {presence && (
                                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                                        <div className={`w-2.5 h-2.5 rounded-full ${presence.color}`} />
                                        <span className="text-xs text-gray-500">{presence.label}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 justify-center sm:justify-start mb-4">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">{profile.postCount}</p>
                                    <p className="text-xs text-gray-500">Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">{profile.friendsCount}</p>
                                    <p className="text-xs text-gray-500">Friends</p>
                                </div>
                            </div>

                            {/* Actions */}
                            {!isOwnProfile && (
                                <div className="flex gap-3 justify-center sm:justify-start">
                                    <button
                                        onClick={handleFriendToggle}
                                        disabled={pending}
                                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${isFriend ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            }`}
                                    >
                                        {pending ? '…' : isFriend ? 'Unfollow' : 'Follow'}
                                    </button>
                                    {isFriend && (
                                        <Link href="/chat" className="px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                            Message
                                        </Link>
                                    )}
                                </div>
                            )}
                            {isOwnProfile && (
                                <Link href="/user/profile" className="inline-flex px-5 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Posts grid */}
                {posts.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Posts</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {posts.map((post) => (
                                <div key={post._id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group relative">
                                    {post.mediaUrl ? (
                                        post.mediaType === 'video' ? (
                                            <video src={`${API_BASE}${post.mediaUrl}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={`${API_BASE}${post.mediaUrl}`} alt="Post" className="w-full h-full object-cover" />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-4 bg-emerald-50">
                                            <p className="text-xs text-gray-600 text-center line-clamp-4">{post.content}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 text-white text-sm">
                                            <span>❤️ {post.likes.length}</span>
                                            <span>💬 {post.comments.length}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {posts.length === 0 && !loading && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-gray-400 text-sm">{isOwnProfile ? "You haven't posted yet." : `${profile.username} hasn't shared any posts.`}</p>
                        {isOwnProfile && (
                            <Link href="/feed/create" className="mt-3 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                                Create Post
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
