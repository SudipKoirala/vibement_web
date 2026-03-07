'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { storyService } from '@/services/story';

export default function CreateStoryPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        setPreview(f ? URL.createObjectURL(f) : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) { setError('Please select a photo or video.'); return; }
        setError('');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('media', file);
            await storyService.createStory(formData);
            router.push('/feed');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add Story – Vibement">
            <div className="max-w-sm mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900">Add to Your Story</h1>
                        <p className="text-sm text-gray-500 mt-1">Disappears after 24 hours</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
                        {preview ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                {file?.type.startsWith('video/') ? (
                                    <video src={preview} className="w-full max-h-96 object-contain" controls />
                                ) : (
                                    <img src={preview} alt="Story preview" className="w-full max-h-96 object-cover" />
                                )}
                                <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 text-sm">
                                    ×
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-12 flex flex-col items-center gap-2 text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">Upload Photo or Video</span>
                            </button>
                        )}
                        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                        <div className="flex gap-3">
                            <button type="button" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button type="submit" disabled={loading || !file} className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                                {loading ? 'Sharing…' : 'Share Story'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
