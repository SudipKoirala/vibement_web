'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { postService, Post } from '@/services/post';

const API_BASE = 'http://localhost:5000';

function VideoCard({ post, currentUserId, onDelete }: { post: Post; currentUserId: string; onDelete: (id: string) => void }) {
    const isOwner = post.author._id === currentUserId;
    return (
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
                <Link href={`/social/${post.author._id}`} className="flex items-center gap-3 hover:opacity-80 transition">
                    {post.author.image ? (
                        <img src={`${API_BASE}${post.author.image}`} alt={post.author.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                            {post.author.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.author.username}</p>
                        <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </Link>
                {isOwner && (
                    <button onClick={() => onDelete(post._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Video */}
            <div className="w-full bg-black">
                <video src={`${API_BASE}${post.mediaUrl}`} controls className="w-full max-h-[500px] object-contain" />
            </div>

            {post.content && (
                <div className="px-5 py-3">
                    <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
                </div>
            )}
        </article>
    );
}

export default function VideosPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        const userCookie = Cookies.get('user');
        const token = Cookies.get('token');
        if (!token || !userCookie) { window.location.href = '/login'; return; }
        try {
            const user = JSON.parse(userCookie);
            setCurrentUserId(user._id || '');
        } catch { window.location.href = '/login'; return; }

        postService.getFeed()
            .then((all) => setPosts(all.filter((p) => p.mediaType === 'video')))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await postService.deletePost(id);
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } catch { }
    };

    return (
        <Layout title="Videos – Vibement">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Videos</h1>
                    <Link href="/feed/create" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">+ Post Video</Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                                <div className="flex gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-gray-200" /><div className="space-y-2 flex-1"><div className="h-3 bg-gray-200 rounded w-1/3" /></div></div>
                                <div className="h-60 bg-gray-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Be the first to share a video with your friends.</p>
                        <Link href="/feed/create" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                            Share a Video
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {posts.map((post) => (
                            <VideoCard key={post._id} post={post} currentUserId={currentUserId} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
