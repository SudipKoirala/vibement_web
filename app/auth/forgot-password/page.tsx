'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await authService.forgotPassword(email);
            setStatus('success');
            setMessage('If an account exists with this email, you will receive a password reset link shortly.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
                        <p className="font-medium">{message}</p>
                        <div className="mt-4">
                            <Link href="/login" className="text-sm font-bold text-green-600 hover:text-green-500">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm italic">{message}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all shadow-md"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 text-sm">
                                Remember your password? Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
