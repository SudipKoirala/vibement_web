'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { userService } from '@/services/user';

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        role: 'user',
    });
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const user = await userService.getUserById(id as string);
            setFormData({
                username: user.username,
                role: user.role,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('role', formData.role);
            if (image) data.append('image', image);

            await userService.updateUser(id as string, data);
            router.push('/admin/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Edit User</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>
                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
