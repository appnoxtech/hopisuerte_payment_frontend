'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

export default function SuperAdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/super-admin/login', { email, password });
            localStorage.setItem('super_admin_token', response.data.access_token);
            router.push('/super-admin');
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Access denied. Super Admin privileges required.');
            } else if (err.response?.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError('Server error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative max-w-md w-full mx-4">
                {/* Secure Badge */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Secure Portal</span>
                    </div>
                </div>

                <div className="glass-card p-10 relative overflow-hidden border-white/5">
                    {/* Yellow accent line at top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-b-full" />

                    <div className="text-center mb-10">
                        {/* Shield icon */}
                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-inner">
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2 tracking-tight uppercase italic">
                            Super Admin
                        </h1>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Management Portal</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold flex items-center gap-3">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1">Admin Email</label>
                            <input
                                id="super-admin-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="saas-input text-base"
                                placeholder="admin@hopisuerte.com"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2 pl-1">
                                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                                <Link href="/super-admin/forgot-password" size="sm" className="text-[10px] text-yellow-500/80 hover:text-yellow-400 transition-colors font-bold uppercase tracking-wider">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                id="super-admin-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="saas-input text-base"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                id="super-admin-login-btn"
                                type="submit"
                                disabled={loading}
                                className="saas-btn-primary w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase leading-relaxed">
                            Access is restricted to authorized<br />platform administrators.
                        </p>
                    </div>
                </div>

                {/* Bottom branding */}
                <div className="text-center mt-6">
                    <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.3em]">HopiSuerte Platform</p>
                </div>
            </div>
        </div>
    );
}
