'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/services/post';
import { postService } from '@/services/post';
import CommentSection from './CommentSection';

const API_BASE = 'http://localhost:5000';

interface PostCardProps {
    post: Post;
    currentUserId: string;
    onDelete: (id: string) => void;
    onImageClick: (url: string) => void;
}

export default function PostCard({ post, currentUserId, onDelete, onImageClick }: PostCardProps) {
    const [liked, setLiked] = useState(post.likes.includes(currentUserId));
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [likePending, setLikePending] = useState(false);

    const isOwner = post.author._id === currentUserId;

    const handleLike = async () => {
        if (likePending) return;
        setLikePending(true);
        const prev = { liked, likesCount };
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        try {
            const result = await postService.likePost(post._id);
            setLiked(result.liked);
            setLikesCount(result.likesCount);
        } catch {
            setLiked(prev.liked);
            setLikesCount(prev.likesCount);
        } finally { setLikePending(false); }
    };

    return (
        <article className="bg-white rounded-3xl overflow-hidden transition-shadow hover:shadow-lg" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <Link href={`/social/${post.author._id}`} className="flex items-center gap-3 hover:opacity-80 transition flex-1 min-w-0">
                    {post.author.image ? (
                        <img
                            src={`${API_BASE}${post.author.image}`}
                            alt={post.author.username}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-200 shadow-sm flex-shrink-0"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                            {post.author.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm truncate">{post.author.username}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isOwner ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                                {isOwner ? 'You' : 'Friend'}
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </Link>
                {isOwner && (
                    <button
                        onClick={() => onDelete(post._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 flex-shrink-0"
                        title="Delete post"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Caption */}
            {post.content && (
                <p className="px-5 pb-3 text-gray-800 text-sm leading-relaxed">{post.content}</p>
            )}

            {/* Media */}
            {post.mediaUrl && (
                <div className="w-full bg-gray-50 mx-3 rounded-2xl overflow-hidden" style={{ width: 'calc(100% - 24px)' }}>
                    {post.mediaType === 'video' ? (
                        <video src={`${API_BASE}${post.mediaUrl}`} controls className="w-full max-h-[500px] object-contain rounded-2xl" />
                    ) : (
                        <img
                            src={`${API_BASE}${post.mediaUrl}`}
                            alt="Post"
                            className="w-full max-h-[500px] object-cover cursor-zoom-in rounded-2xl"
                            onClick={() => onImageClick(`${API_BASE}${post.mediaUrl}`)}
                            title="Click to view full screen"
                        />
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="px-5 py-3 flex items-center gap-2">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-all px-4 py-2 rounded-xl ${
                        liked
                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                        : 'text-gray-500 hover:text-red-400 hover:bg-red-50'
                    }`}
                >
                    <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>
                <div className="w-px h-4 bg-gray-100" />
                <CommentSection post={post} currentUserId={currentUserId} />
            </div>
        </article>
    );
}
