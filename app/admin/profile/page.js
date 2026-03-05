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
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
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
            setSlug(response.data.slug);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20 px-4 sm:px-0">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Profile Settings</h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        Manage your account and public visibility
                    </p>
                </div>
            </header>

            {message.text && (
                <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-3 animate-fade-in ${message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    <span className="tracking-tight">{message.text}</span>
                </div>
            )}

            {/* Profile Form */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-yellow-500 rounded-full"></div>
                    <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Account Details</h2>
                </div>

                <div className="glass-card p-10 relative overflow-hidden group border-white/5">
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="saas-input py-3.5 px-6 text-base font-bold"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="saas-input py-3.5 px-6 text-base font-bold"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <div>
                                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Public URL Slug</label>
                                <div className="flex items-stretch bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all max-w-xl">
                                    <div className="flex items-center px-6 bg-white/5 border-r border-white/5 text-zinc-600 text-sm font-black italic select-none">
                                        /u/
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="flex-1 px-6 py-4 bg-transparent text-white focus:outline-none font-mono text-sm font-bold"
                                        placeholder="username"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 max-w-xl">
                                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                                    Your Public Link
                                </p>
                                <code className="text-yellow-500/80 font-mono text-[11px] break-all">
                                    {typeof window !== 'undefined' ? `${window.location.origin}/u/${slug || '...'}` : ''}
                                </code>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center gap-8">
                            <button
                                type="submit"
                                disabled={saving}
                                className="saas-btn-primary w-full md:w-auto px-16 py-4 uppercase tracking-[0.2em] text-[10px] whitespace-nowrap"
                            >
                                {saving ? 'Saving...' : 'Save Profile Changes'}
                            </button>

                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                Updating your slug will change your public profile address.
                            </p>
                        </div>
                    </form>
                </div>
            </section>

            {/* Warning Section */}
            <div className="glass-card p-6 bg-red-500/[0.02] border-red-500/10 flex flex-col md:flex-row gap-5 items-center md:items-start text-center md:text-left">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                    <h3 className="text-red-500 font-black mb-1.5 text-[10px] uppercase tracking-widest">Important Note</h3>
                    <p className="text-zinc-600 text-[13px] font-medium leading-relaxed max-w-2xl">
                        If you change your URL slug, any old links you have shared will stop working.
                        Make sure to update them to prevent payment issues.
                    </p>
                </div>
            </div>
        </div>
    );
}
