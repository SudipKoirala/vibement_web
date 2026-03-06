'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';
import { authService } from '@/services/auth';

const API_BASE = 'http://localhost:5000';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userData = Cookies.get('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setUsername(parsed.username || '');
            setEmail(parsed.email || '');
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setPassword('');
        setImage(null);
        setPreview(null);
        setUsername(user?.username || '');
        setEmail(user?.email || '');
        setMessage('');
    };

    const openImagePicker = () => {
        if (!editing) setEditing(true);
        fileRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            if (password) formData.append('password', password);
            if (image) formData.append('image', image);

            const response = await authService.updateProfile(user._id, formData);
            setSuccess(true);
            setMessage('Profile updated successfully!');

            const updatedUser = {
                ...response.user,
                image: response.user.image ? `${response.user.image}?v=${Date.now()}` : response.user.image,
            };

            Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 });
            setUser(updatedUser);
            setPassword('');
            setEditing(false);
            setImage(null);
            setPreview(null);
        } catch (error: any) {
            setSuccess(false);
            setMessage(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const avatarSrc = preview
        ? preview
        : user?.image
            ? `${API_BASE}${user.image}`
            : null;

    const initials = user?.username?.charAt(0).toUpperCase() || '?';
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Not available';
    const draftChanges = Boolean(
        image ||
        password ||
        username !== (user?.username || '') ||
        email !== (user?.email || '')
    );

    if (!user) {
        return (
            <Layout title="Profile - Vibement">
                <div className="mx-auto mt-10 max-w-5xl">
                    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-emerald-100" />
                        <div className="mx-auto h-3 w-1/3 rounded bg-gray-100" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Profile - Vibement">
            <div className="mx-auto max-w-5xl space-y-5">
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 24px rgba(5,150,105,0.3)' }}
                >
                    <div className="px-6 py-6 md:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white/15 text-3xl font-bold text-white shadow-lg">
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <span>{initials}</span>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/80">Account</p>
                                    <h1 className="mt-2 text-2xl font-bold text-white">{user.username}</h1>
                                    <p className="mt-1 text-sm text-emerald-100">{user.email}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={openImagePicker}
                                            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
                                        >
                                            Change photo
                                        </button>
                                        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
                                            Member since {memberSince}
                                        </span>
                                        {image && (
                                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                                                New photo selected
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {editing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            form="profile-form"
                                            type="submit"
                                            disabled={loading}
                                            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                                        >
                                            {loading ? 'Saving...' : 'Save changes'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                    >
                                        Edit profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_320px]">
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">{editing ? 'Edit profile details' : 'Profile details'}</h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    {editing
                                        ? 'Update your basic account information and save when ready.'
                                        : 'This is the information currently attached to your account.'}
                                </p>
                            </div>

                            {editing ? (
                                <form id="profile-form" onSubmit={handleSubmit} className="space-y-5 p-6">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                                placeholder="Your username"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            New Password <span className="text-gray-400">(leave blank to keep current)</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                                placeholder="New password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                                ) : (
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {image && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                            Photo ready to save: {image.name}
                                        </div>
                                    )}
                                </form>
                            ) : (
                                <div className="grid gap-4 p-6 md:grid-cols-2">
                                    <DetailCard label="Username" value={user.username} />
                                    <DetailCard label="Email" value={user.email} />
                                    <DetailCard label="Member since" value={memberSince} />
                                    <DetailCard label="Security" value="Password protected" />
                                </div>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Account summary</h2>
                            </div>
                            <div className="grid gap-4 p-6 md:grid-cols-3">
                                <SummaryBlock label="Status" value={editing ? 'Editing' : 'Ready'} />
                                <SummaryBlock label="Photo" value={avatarSrc ? 'Uploaded' : 'Initials'} />
                                <SummaryBlock label="Draft changes" value={draftChanges ? 'Yes' : 'No'} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                            <div className="border-b border-gray-100 px-6 py-5">
                                <h2 className="text-base font-semibold text-gray-900">Profile snapshot</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                                        {avatarSrc ? (
                                            <img src={avatarSrc} alt="Current avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-semibold text-gray-900">{user.username}</p>
                                        <p className="truncate text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="mt-4 divide-y divide-gray-100">
                                    <InfoRow label="Visibility" value="Visible across your account" />
                                    <InfoRow label="Photo state" value={avatarSrc ? 'Custom profile photo' : 'Initials avatar'} />
                                    <InfoRow label="Editing mode" value={editing ? 'Enabled' : 'Off'} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-slate-900 p-6 text-white" style={{ boxShadow: '0 12px 30px rgba(15,23,42,0.24)' }}>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/70">Professional note</p>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                                <p>Use a clear profile image and updated contact details to keep your account looking complete.</p>
                                <p>Changes here will also reflect in the navbar avatar once saved.</p>
                                <p>Leave the password field empty when you only want to update profile information.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
            <p className="mt-2 break-words text-sm font-medium text-gray-900">{value}</p>
        </div>
    );
}

function SummaryBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-right text-sm font-semibold text-gray-900">{value}</span>
        </div>
    );
}
