'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { passwordRules, allPasswordRulesPassed, validatePassword } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
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

    const allRulesPassed = allPasswordRulesPassed(password);
    const passwordsMatch = password.length > 0 && password === passwordConfirmation;

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

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
                password_confirmation: passwordConfirmation,
            });

            setSuccess(true);

            setTimeout(() => {
                router.push('/admin/login');
            }, 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            setError(msg.includes('same as') ? 'New password cannot be the same as your previous password.' : msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={mainStyle}>
                <div style={{ ...glowStyle, background: 'rgba(74,222,128,0.12)' }} />

                <div style={containerStyle}>
                    <div style={cardStyle}>
                        <h1 style={{ ...titleStyle, color: '#4ade80' }}>Password Reset</h1>

                        <p style={{ ...subtitleStyle, color: '#4ade80', opacity: 0.9 }}>
                            Your password has been updated successfully.
                        </p>

                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <p style={{ color: '#71717a', fontSize: 14 }}>
                                Redirecting to login in 3 seconds...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={mainStyle}>
            <div style={glowStyle} />

            <div style={containerStyle}>
                <div style={cardStyle}>
                    <h1 style={titleStyle}>Reset Password</h1>

                    <p style={subtitleStyle}>
                        Create a new secure password for your account
                    </p>

                    {error && (
                        <div style={errorStyle}>
                            {error}
                        </div>
                    )}

                    {email && (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10,
                            padding: 12,
                            marginBottom: 16,
                        }}>
                            <label style={{ ...labelStyle, marginBottom: 4 }}>Account</label>
                            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>
                                {email}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* New Password */}
                        <div>
                            <label style={labelStyle}>New Password</label>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        ...inputStyle,
                                        paddingRight: 44,
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={toggleBtn}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        {password.length > 0 && (
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 10,
                                padding: 12,
                            }}>
                                <p style={{ fontSize: 11, color: '#71717a', marginBottom: 8 }}>Password must contain:</p>
                                {passwordRules.map((rule, index) => {
                                    const passed = rule.test(password);
                                    return (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginBottom: 4,
                                        }}>
                                            <div style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: 4,
                                                background: passed ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${passed ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                {passed && <div style={{ width: 6, height: 6, background: '#4ade80', borderRadius: 2 }} />}
                                            </div>
                                            <span style={{
                                                fontSize: 12,
                                                color: passed ? '#4ade80' : '#71717a',
                                            }}>
                                                {rule.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div>
                            <label style={labelStyle}>Confirm Password</label>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        ...inputStyle,
                                        paddingRight: 44,
                                        border: passwordConfirmation.length > 0
                                            ? (passwordsMatch ? '1px solid rgba(74,222,128,0.4)' : '1px solid #ef4444')
                                            : inputStyle.border,
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={toggleBtn}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {passwordConfirmation.length > 0 && (
                                <p style={{
                                    ...fieldErrorStyle,
                                    color: passwordsMatch ? '#4ade80' : '#f87171',
                                    marginTop: 6,
                                }}>
                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !token || !allRulesPassed || !passwordsMatch}
                            style={{
                                ...submitStyle,
                                opacity: (loading || !allRulesPassed || !passwordsMatch) ? 0.6 : 1,
                                cursor: (loading || !allRulesPassed || !passwordsMatch) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <a
                                href="/admin/login"
                                style={{
                                    ...forgotStyle,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                ← Back to Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────── */
/*          Reused Styles (same as Login page)     */
/* ────────────────────────────────────────────── */

const mainStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    padding: 20,
    position: 'relative'
};

const glowStyle = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 600,
    height: 300,
    background: 'rgba(250,204,21,0.12)',
    borderRadius: '50%',
    filter: 'blur(120px)'
};

const containerStyle = {
    width: '100%',
    maxWidth: 420,
    zIndex: 2
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 28
};

const titleStyle = {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    textAlign: 'center'
};

const subtitleStyle = {
    fontSize: 12,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 20
};

const labelStyle = {
    fontSize: 12,
    color: '#cbd5f5',
    marginBottom: 6,
    display: 'block'
};

const inputStyle = {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: 14,
    outline: 'none'
};

const toggleBtn = {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#71717a'
};

const submitStyle = {
    marginTop: 6,
    padding: 14,
    background: '#facc15',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    color: '#000',
    fontSize: 14
};

const forgotStyle = {
    fontSize: 12,
    color: '#71717a',
    textDecoration: 'none'
};

const fieldErrorStyle = {
    color: '#f87171',
    fontSize: 11,
    marginTop: 4
};

const errorStyle = {
    marginBottom: 16,
    padding: 10,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444',
    borderRadius: 8,
    fontSize: 12
};