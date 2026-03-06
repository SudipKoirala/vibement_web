'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userService } from '@/services/user';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [stats, setStats] = useState<any>(null);
    const limit = 10;

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const [usersData, statsData] = await Promise.all([
                userService.getAllUsers(page, limit),
                userService.getStats()
            ]);
            setUsers(usersData.users);
            setTotalUsers(usersData.total);
            setStats(statsData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await userService.deleteUser(id);
            setUsers(users.filter(user => user._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading users...</div>;

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <Link
                    href="/admin/users/create"
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    Create New User
                </Link>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 font-medium uppercase">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
                        <p className="text-sm text-gray-500 font-medium uppercase">Admins</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.admins}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 font-medium uppercase">Regular Users</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.regularUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-500 font-medium uppercase">New (Last 7 Days)</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.recentUsers}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={user.image ? `http://localhost:5000${user.image}` : 'https://via.placeholder.com/40'}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                    <Link href={`/admin/users/${user._id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                                    <Link href={`/admin/users/${user._id}/edit`} className="text-yellow-600 hover:text-yellow-900">Edit</Link>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> users
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(Math.ceil(totalUsers / limit), p + 1))}
                        disabled={page >= Math.ceil(totalUsers / limit)}
                        className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
