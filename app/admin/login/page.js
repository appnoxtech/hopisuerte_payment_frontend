'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import { validateEmail } from '@/utils/validation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
    const router = useRouter();

    const validateFields = () => {
        const errors = { email: '', password: '' };
        errors.email = validateEmail(email);
        if (!password || password.trim() === '') {
            errors.password = 'Please enter your password.';
        }
        setFieldErrors(errors);
        return !errors.email && !errors.password;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateFields()) return;

        setLoading(true);
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('auth_token', response.data.access_token);
            router.push('/admin');
        } catch (err) {
            if (err.response?.status === 403) {
                setError(err.response?.data?.message || 'Your account is disabled. Please contact support.');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 animate-fade-in-up border-white/5">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Admin Login</h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Sign in to manage your payments</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })); }}
                            className={`saas-input py-3.5 px-6 text-base font-bold ${fieldErrors.email ? 'border-red-500/40 focus:ring-red-500/20' : ''}`}
                            placeholder="admin@example.com"
                        />
                        {fieldErrors.email && (
                            <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{fieldErrors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })); }}
                                className={`saas-input py-3.5 px-6 pr-14 text-base font-bold ${fieldErrors.password ? 'border-red-500/40 focus:ring-red-500/20' : ''}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-500 transition-colors p-1"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{fieldErrors.password}</p>
                        )}
                    </div>
                    <div className="pt-4 space-y-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="saas-btn-primary w-full py-4 text-[10px] uppercase font-black tracking-[0.2em]"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <div className="text-center">
                            <Link href="/admin/forgot-password" className="text-[9px] text-zinc-500 hover:text-yellow-500 transition-colors font-black uppercase tracking-[0.2em]">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-10 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
                        HopiSuerte Admin Interface
                    </p>
                </div>
            </div>
        </div>
    );
}
