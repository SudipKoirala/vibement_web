'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { postService, Post } from '@/services/post';
import { storyService, StoryGroup } from '@/services/story';
import { socialService, UserSearchResult } from '@/services/social';

// ── Extracted components ──────────────────────────────────────────────────────
import ImageLightbox from '@/components/feed/ImageLightbox';
import StoriesBar from '@/components/feed/StoriesBar';
import PostCard from '@/components/feed/PostCard';
import FriendsSidebar from '@/components/feed/FriendsSidebar';

// ── Feed Page ─────────────────────────────────────────────────────────────────
export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<StoryGroup[]>([]);
    const [friends, setFriends] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState('');
    const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

    useEffect(() => {
        const userCookie = Cookies.get('user');
        const token = Cookies.get('token');
        if (!token || !userCookie) { window.location.href = '/login'; return; }
        try {
            const user = JSON.parse(userCookie);
            setCurrentUserId(user._id || '');
        } catch { window.location.href = '/login'; return; }

        Promise.all([
            postService.getFeed().then(setPosts),
            storyService.getStoryFeed().then(setStories),
            socialService.listFriends().then(setFriends),
        ]).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await postService.deletePost(id);
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } catch { /* ignore */ }
    };

    const handleImageClick = useCallback((url: string) => setLightboxUrl(url), []);
    const handleCloseLightbox = useCallback(() => setLightboxUrl(null), []);

    return (
        <Layout title="Feed - Vibement">
            {/* Full-screen image lightbox */}
            {lightboxUrl && <ImageLightbox url={lightboxUrl} onClose={handleCloseLightbox} />}

            <div className="flex gap-6 w-[90vw] max-w-7xl mx-auto">
                {/* ── Left: Feed ── */}
                <div className="flex-1 min-w-0 space-y-5">
                    {/* Stories */}
                    <div className="bg-white rounded-2xl px-5 py-4" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                        <StoriesBar stories={stories} currentUserId={currentUserId} />
                    </div>

                    {/* Create Post CTA */}
                    <Link
                        href="/feed/create"
                        className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 hover:shadow-md transition-all group cursor-pointer"
                        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div className="flex-1 bg-gray-50 group-hover:bg-emerald-50 transition-colors rounded-2xl px-4 py-2.5 border border-gray-100 group-hover:border-emerald-100">
                            <span className="text-gray-400 text-sm group-hover:text-emerald-600 transition-colors">What&apos;s on your mind?</span>
                        </div>
                    </Link>

                    {/* Posts feed */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 animate-pulse" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                                    <div className="flex gap-3 mb-4"><div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" /><div className="space-y-2 flex-1"><div className="h-3 bg-gray-200 rounded w-1/3" /><div className="h-2 bg-gray-200 rounded w-1/5" /></div></div>
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your feed is empty</h3>
                            <p className="text-sm text-gray-500 mb-4">Add friends and follow their posts to see them here.</p>
                            <Link href="/search" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                                Find Friends
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {posts.filter((p) => p.mediaType !== 'video').map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    currentUserId={currentUserId}
                                    onDelete={handleDelete}
                                    onImageClick={handleImageClick}
                                />
                            ))}
                            {posts.length > 0 && posts.every((p) => p.mediaType === 'video') && (
                                <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
                                    No status or photo posts yet.{' '}
                                    <Link href="/feed/videos" className="text-emerald-600 font-medium">
                                        Check the Videos tab
                                    </Link>.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right: Friends Sidebar ── */}
                <FriendsSidebar friends={friends} />
            </div>
        </Layout>
    );
}
