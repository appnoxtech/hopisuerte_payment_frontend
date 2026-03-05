'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Get token and email from URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid or expired password reset link.');
        }
    }, [token, email]);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await api.post('/password/reset', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="w-full max-w-md glass-card p-10 relative z-10 text-center animate-fade-in border-white/5">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Password Reset</h1>
                    <p className="text-zinc-500 text-sm mb-8 font-medium">Your password has been updated. Redirecting to login...</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full animate-[progress_3s_linear_forwards]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 animate-fade-in-up border-white/5">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Reset Password</h1>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">Create a new secure password</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold flex items-center gap-3">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 mb-2">
                        <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Account</p>
                        <p className="text-white font-bold text-sm truncate">{email}</p>
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="saas-input py-3.5 px-6 text-base font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="saas-input py-3.5 px-6 text-base font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="saas-btn-primary w-full py-4 text-[10px] uppercase font-black tracking-[0.2em]"
                        >
                            {loading ? 'Resetting Password...' : 'Save New Password'}
                        </button>
                    </div>

                    <div className="text-center mt-10 pt-8 border-t border-white/5">
                        <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">
                            Secure Account Recovery
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
