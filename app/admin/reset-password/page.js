'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { passwordRules, allPasswordRulesPassed, validatePassword } from '@/utils/validation';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid or expired password reset link.');
        }
    }, [token, email]);

    const allPassed = allPasswordRulesPassed(password);
    const passwordsMatch = password.length > 0 && password === passwordConfirmation;

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password strength
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
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
            const msg = err.response?.data?.message;
            if (msg && msg.toLowerCase().includes('same as')) {
                setError('New password cannot be the same as your previous password.');
            } else {
                setError(msg || 'Failed to reset password. The link may have expired.');
            }
        } finally {
            setLoading(false);
        }
    };

    const EyeIcon = ({ show, onToggle }) => (
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-yellow-500 transition-colors p-1">
            {show ? (
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
    );

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

                <form onSubmit={handleReset} className="space-y-6" noValidate>
                    <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 mb-2">
                        <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-1">Account</p>
                        <p className="text-white font-bold text-sm truncate">{email}</p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="saas-input py-3.5 px-6 pr-14 text-base font-bold"
                                placeholder="••••••••"
                            />
                            <EyeIcon show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                        </div>
                    </div>

                    {/* Password Requirements Checklist */}
                    {password.length > 0 && (
                        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-2.5 animate-fade-in">
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Password Requirements</p>
                            {passwordRules.map((rule, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-300 ${rule.test(password) ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
                                        {rule.test(password) && (
                                            <svg className="w-2.5 h-2.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${rule.test(password) ? 'text-green-400' : 'text-zinc-600'}`}>
                                        {rule.test(password) ? rule.label : rule.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className={`saas-input py-3.5 px-6 pr-14 text-base font-bold ${passwordConfirmation.length > 0 ? (passwordsMatch ? 'border-green-500/30 focus:ring-green-500/20' : 'border-red-500/30 focus:ring-red-500/20') : ''}`}
                                placeholder="••••••••"
                            />
                            <EyeIcon show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                        </div>
                        {passwordConfirmation.length > 0 && (
                            <p className={`text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !token || !allPassed || !passwordsMatch}
                            className="saas-btn-primary w-full py-4 text-[10px] uppercase font-black tracking-[0.2em] disabled:opacity-40 disabled:cursor-not-allowed"
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
