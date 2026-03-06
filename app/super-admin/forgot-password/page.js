'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';

export default function SuperAdminForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const emailError = validateEmail(email);
        if (emailError) {
            setFieldError(emailError);
            return;
        }
        setFieldError('');

        setLoading(true);
        try {
            await api.post('/password/forgot', { email });
            setMessage('A password reset link has been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please ensure the email is correct.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 animate-fade-in-up border-white/5 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Reset Password</h1>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Secure Reset Portal</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-fade-in">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 pl-1">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
                            className={`saas-input text-base ${fieldError ? 'border-red-500/40 focus:ring-red-500/20' : ''}`}
                            placeholder="admin@paysigur.com"
                        />
                        {fieldError && (
                            <p className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{fieldError}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="saas-btn-primary w-full py-4 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : 'Send Reset Link'}
                        </button>
                    </div>

                    <div className="text-center mt-8 pt-8 border-t border-white/5">
                        <Link href="/super-admin/login" className="text-[10px] text-zinc-500 hover:text-yellow-400 font-bold transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Login
                        </Link>
                    </div>
                </form>

                <p className="text-center text-[10px] text-zinc-600 px-4 mt-8 uppercase tracking-[0.2em] leading-relaxed font-bold">
                    Return to the secure login portal to manage your administrative account.
                </p>
            </div>
            {/* Bottom branding */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.3em]">Paysigur Platform</p>
            </div>
        </div>
    );
}
