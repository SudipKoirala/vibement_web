'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { userService } from '@/services/user';
import Link from 'next/link';

export default function UserDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const data = await userService.getUserById(id as string);
            setUser(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading user details...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
    if (!user) return <div className="p-10 text-center">User not found</div>;

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                    &larr; Back
                </button>
                <h1 className="text-3xl font-bold">User Information</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
                <div className="w-48 h-48 relative flex-shrink-0 mx-auto md:mx-0">
                    <img
                        src={user.image ? `http://localhost:5000${user.image}` : 'https://via.placeholder.com/200'}
                        alt={user.username}
                        className="w-full h-full rounded-2xl object-cover border-4 border-gray-100"
                    />
                </div>

                <div className="flex-grow space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                            <p className="text-xl font-semibold text-gray-900">{user.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <p className="text-xl font-semibold text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                {user.role}
                            </span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                            <p className="text-sm font-mono text-gray-500">{user._id}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                            <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                            <p className="text-gray-700">{new Date(user.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex space-x-4">
                        <Link
                            href={`/admin/users/${user._id}/edit`}
                            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-md"
                        >
                            Edit User
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
