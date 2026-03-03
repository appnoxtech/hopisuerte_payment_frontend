'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ProfileSettings() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            const user = response.data;
            setName(user.name);
            setEmail(user.email);
            setSlug(user.slug);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/user', { name, email, slug });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Update local state in case user modified slug
            setSlug(response.data.slug);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-slate-400">Loading settings...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/50 text-green-500'
                        : 'bg-red-500/10 border-red-500/50 text-red-500'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-[#1e293b] rounded-2xl p-8 border border-slate-700 shadow-xl">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Personal URL Slug</label>
                        <div className="flex items-center space-x-2">
                            <span className="text-slate-500 text-sm">/u/</span>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                className="flex-1 px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                                placeholder="my-custom-slug"
                            />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 italic">
                            Your payment page will be: {window.location.origin}/u/{slug || '...'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/30"
                    >
                        {saving ? 'Saving Changes...' : 'Save Settings'}
                    </button>
                </form>
            </div>

            <div className="mt-12 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <h3 className="text-slate-300 font-bold mb-2">Developer Note</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Changing your slug will immediately make your old payment links invalid. Be sure to update any saved links you’ve shared with clients.
                </p>
            </div>
        </div>
    );
}
