'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { postService } from '@/services/post';

export default function CreatePostPage() {
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextFile = e.target.files?.[0] ?? null;
        setFile(nextFile);

        if (nextFile) {
            setPreview(URL.createObjectURL(nextFile));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !file) {
            setError('Add a caption or media to post.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('visibility', 'public');
            if (file) formData.append('media', file);

            await postService.createPost(formData);
            router.push('/feed');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Create Post - Vibement">
            <div className="mx-auto max-w-5xl space-y-5">
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 24px rgba(5,150,105,0.3)' }}
                >
                    <div className="px-6 py-6 md:px-8 md:py-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/80">Publishing</p>
                        <h1 className="mt-2 text-2xl font-bold text-white">Create a polished post</h1>
                        <p className="mt-2 max-w-2xl text-sm text-emerald-100">
                            Write a strong caption, attach a photo or video, and choose who can see your post.
                        </p>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_320px]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Post content</h2>
                                <p className="mt-1 text-sm text-gray-500">Keep it clear, visual, and ready to share.</p>
                            </div>

                            <div className="space-y-6 p-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Caption</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={7}
                                        placeholder="What's on your mind?"
                                        className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Photo or Video</label>
                                    {preview ? (
                                        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                            {file?.type.startsWith('video/') ? (
                                                <video src={preview} className="max-h-[420px] w-full object-contain" controls />
                                            ) : (
                                                <img src={preview} alt="Preview" className="max-h-[420px] w-full object-contain" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFile(null);
                                                    setPreview(null);
                                                    if (fileRef.current) fileRef.current.value = '';
                                                }}
                                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-sm font-semibold text-white transition hover:bg-black/80"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                                        >
                                            <span className="block text-base font-semibold text-gray-900">Upload a photo or video</span>
                                            <span className="mt-2 block text-sm text-gray-500">Use a clean visual to make the post feel more complete and professional.</span>
                                        </button>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                                </div>


                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Ready to publish</p>
                                    <p className="mt-1 text-sm text-gray-500">Review your content and share when everything looks right.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Posting...' : 'Share Post'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Live preview</h2>
                                <p className="mt-1 text-sm text-gray-500">See how the post will read before you publish it.</p>
                            </div>
                            <div className="p-6">
                                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    {preview ? (
                                        file?.type.startsWith('video/') ? (
                                            <video src={preview} className="mb-4 max-h-52 w-full rounded-xl object-cover" controls />
                                        ) : (
                                            <img src={preview} alt="Preview" className="mb-4 max-h-52 w-full rounded-xl object-cover" />
                                        )
                                    ) : (
                                        <div className="mb-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-sm text-gray-400">
                                            Media preview will appear here
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <p className="text-sm leading-6 text-gray-700">
                                            {content.trim() || 'Your caption preview will appear here once you start writing.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Publishing checklist</h2>
                            </div>
                            <div className="space-y-4 p-6">
                                <ChecklistRow
                                    label="Caption"
                                    value={content.trim() ? 'Added' : 'Optional'}
                                    tone={content.trim() ? 'emerald' : 'gray'}
                                />
                                <ChecklistRow
                                    label="Media"
                                    value={file ? 'Attached' : 'Optional'}
                                    tone={file ? 'emerald' : 'gray'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function ChecklistRow({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: 'emerald' | 'gray';
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">{label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-500 ring-1 ring-gray-200'}`}>
                {value}
            </span>
        </div>
    );
}
