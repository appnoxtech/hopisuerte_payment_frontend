'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/super-admin/users', getSuperAdminHeaders());
                setUsers(response.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handlePromote = async (userId) => {
        if (!confirm('Are you sure you want to promote this user to Admin?')) return;
        setPromoting(userId);
        try {
            await api.post('/super-admin/promote', { user_id: userId }, getSuperAdminHeaders());
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert('Failed to promote user');
        } finally {
            setPromoting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 italic outfit">Account Audit</h1>
                    <p className="text-neutral-400">Review and manage platform freelancers.</p>
                </div>
            </header>

            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-800 text-neutral-400 text-xs uppercase tracking-widest font-black">
                            <th className="px-6 py-5">Freelancer</th>
                            <th className="px-6 py-5">Public Name</th>
                            <th className="px-6 py-5">Products</th>
                            <th className="px-6 py-5">Volume Generated</th>
                            <th className="px-6 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-neutral-800/50 transition-all group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold mr-3 group-hover:border-yellow-500/50 transition-all">
                                            {user.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white mb-0.5">{user.name}</p>
                                            <p className="text-sm text-neutral-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 font-mono text-sm text-yellow-500 bg-clip-text">
                                    @{user.slug || 'no-slug'}
                                </td>
                                <td className="px-6 py-5">
                                    <span className="bg-neutral-800 px-3 py-1 rounded-full text-xs font-bold text-neutral-300">
                                        {user.products_count || 0} Products
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-white font-black outfit italic">USD {(user.total_earnings || 0).toLocaleString()}</p>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => handlePromote(user.id)}
                                        disabled={promoting === user.id}
                                        className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all font-bold text-xs shadow-lg shadow-yellow-500/10 disabled:opacity-50"
                                    >
                                        {promoting === user.id ? 'Promoting...' : 'Make Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
