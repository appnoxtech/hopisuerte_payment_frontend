'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/[0.02] rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative max-w-md w-full mx-4">
                {/* Top security badge */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Restricted Access</span>
                    </div>
                </div>

                <div className="p-10 bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-800 relative">
                    {/* Yellow accent line at top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-b-full" />

                    <div className="text-center mb-10">
                        {/* Shield icon */}
                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                            Platform Control
                        </h1>
                        <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Super Admin Access</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Email</label>
                            <input
                                id="super-admin-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all placeholder:text-neutral-700"
                                placeholder="superadmin@hopisuerte.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Password</label>
                            <input
                                id="super-admin-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all placeholder:text-neutral-700"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            id="super-admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-neutral-800 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-900/10 uppercase tracking-widest"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying Access...
                                </span>
                            ) : (
                                'Authenticate'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                        <p className="text-neutral-600 text-xs">
                            This portal is restricted to authorized platform administrators only.
                        </p>
                    </div>
                </div>

                {/* Bottom branding */}
                <div className="text-center mt-6">
                    <p className="text-neutral-700 text-xs font-bold uppercase tracking-widest">HopiSuerte Platform</p>
                </div>
            </div>
        </div>
    );
}
