'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Link from 'next/link';

export default function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing reset token');
            return;
        }

        setStatus('loading');
        try {
            await authService.resetPassword(token, password);
            setStatus('success');
            setMessage('Your password has been reset successfully.');
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        }
    };

    if (!token && status !== 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-10 bg-white rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h2>
                    <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
                    <Link href="/auth/forgot-password" className="text-green-600 font-bold hover:underline">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Set New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
                        <p className="font-medium">{message}</p>
                        <p className="text-sm mt-2">Redirecting to login page...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm italic">{message}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 shadow-md"
                            >
                                {status === 'loading' ? 'Updating...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
