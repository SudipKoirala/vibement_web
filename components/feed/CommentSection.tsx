'use client';

import { useState } from 'react';
import { Post } from '@/services/post';
import { postService } from '@/services/post';

const API_BASE = 'http://localhost:5000';

interface CommentSectionProps {
    post: Post;
    currentUserId: string;
}

export default function CommentSection({ post, currentUserId }: CommentSectionProps) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [comments, setComments] = useState(post.comments);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const comment = await postService.addComment(post._id, text);
            setComments((prev) => [...prev, comment]);
            setText('');
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-full hover:bg-emerald-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </button>

            {open && (
                <div className="mt-3 space-y-2 px-1">
                    {comments.map((c) => (
                        <div key={c._id} className="flex gap-2 text-sm">
                            {c.author.image ? (
                                <img src={`${API_BASE}${c.author.image}`} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5" />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0 mt-0.5">
                                    {c.author.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-3 py-2 flex-1">
                                <span className="font-semibold text-gray-900 text-xs mr-1.5">{c.author.username}</span>
                                <span className="text-gray-600 text-sm">{c.content}</span>
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-2 pt-1">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                            placeholder="Write a comment…"
                            className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 bg-gray-50"
                        />
                        <button
                            onClick={submit}
                            disabled={loading || !text.trim()}
                            className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-full disabled:opacity-40 transition-colors"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
