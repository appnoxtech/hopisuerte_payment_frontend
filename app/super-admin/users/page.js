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

    // New User Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/users', getSuperAdminHeaders());
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            const response = await api.post('/super-admin/register-freelancer', formData, getSuperAdminHeaders());
            setFormSuccess(response.data.message);
            setFormData({ name: '', email: '' });
            fetchUsers(); // Refresh the list
            setTimeout(() => {
                setShowForm(false);
                setFormSuccess('');
            }, 5000);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create user account');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await api.patch(`/super-admin/users/${id}/status`, {}, getSuperAdminHeaders());
            // Update local state
            setUsers(users.map(u => u.id === id ? { ...u, status: response.data.status } : u));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete user '${name}'? All their products and data will be permanently removed.`)) {
            return;
        }

        try {
            await api.delete(`/super-admin/users/${id}`, getSuperAdminHeaders());
            // Update local state
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">User Management</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        Platform User Directory
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="saas-btn-primary gap-3 px-8 py-4 text-[10px] uppercase tracking-widest font-black h-fit"
                >
                    <svg className={`w-4 h-4 transition-transform duration-500 ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Cancel Registration' : 'Add New User'}
                </button>
            </section>

            {/* Registration Form */}
            {showForm && (
                <section className="px-2">
                    <div className="glass-card p-10 animate-fade-in relative overflow-hidden group border-white/5">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700">
                            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-1.5 h-8 bg-yellow-500 rounded-full"></div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Create New User</h2>
                        </div>

                        {formError && (
                            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in shadow-inner">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {formError}
                            </div>
                        )}

                        {formSuccess && (
                            <div className="mb-8 p-5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in shadow-inner">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                {formSuccess}
                            </div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-10 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="saas-input py-4 px-6 text-lg font-bold"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="saas-input py-4 px-6 text-lg font-bold"
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-5 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="saas-btn-secondary px-8 py-4 text-[10px] font-black uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="saas-btn-primary px-12 py-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    {formLoading ? 'Creating...' : 'Register User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}

            {/* User Table */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">User Directory</h2>
                </div>

                <div className="glass-card overflow-hidden border-white/5 group shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-10 py-6 border-b border-white/5">User Profile</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-center">Status</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-center">Products</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-right">Total Earnings</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 opacity-40 group-hover:rotate-12 transition-transform duration-700">
                                                    <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-zinc-600 font-black uppercase tracking-widest mb-2">No Users Found</h3>
                                                <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest">No users have been registered on the platform yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="group/row hover:bg-white/[0.04] transition-all duration-300">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-[1px] shadow-lg group-hover/row:scale-105 transition-transform duration-500">
                                                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-yellow-500 font-black text-xl italic uppercase">
                                                            {user.name?.[0]}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-white mb-1 uppercase tracking-tighter italic group-hover/row:text-yellow-400 transition-colors duration-300">{user.name}</p>
                                                        <div className="flex items-center gap-2 text-zinc-600">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                            <span className="text-[10px] font-black font-mono tracking-widest uppercase">{user.slug || 'no-slug'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    className={`badge ${(user.status || 'active') === 'active' ? 'badge-success' : 'bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'} uppercase tracking-tighter px-4 py-1 font-black italic hover:scale-105 transition-all text-[10px]`}
                                                    title="Toggle Status"
                                                >
                                                    {user.status || 'active'}
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-sm font-black text-zinc-400 group-hover/row:border-blue-500/30 group-hover/row:text-white transition-all duration-500 shadow-inner">
                                                    {user.products_count || 0}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xl font-black text-white tracking-tighter italic group-hover/row:text-green-400 transition-colors duration-500">
                                                        {(user.total_earnings || 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Total Volume (USD)</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 transition-all duration-500">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 shadow-xl"
                                                        title="Delete User"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Note */}
            <section className="px-2">
                <div className="flex items-center gap-4 p-8 glass-card bg-blue-500/5 border-blue-500/10 border-dashed">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-relaxed">
                        Administrator Note: Status toggles and user deletions are immediate. Deleting a user is irreversible and will permanently remove all associated products and payment data.
                    </p>
                </div>
            </section>
        </div>
    );
}
