'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';

export default function SuperAdminForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ email: '' });

    const router = useRouter();

    const validateFields = () => {
        const errors = { email: '' };
        errors.email = validateEmail(email);
        setFieldErrors(errors);
        return !errors.email;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setFieldErrors({ email: '' });

        if (!validateFields()) return;

        setLoading(true);

        try {
            // Note: using the same /password/forgot endpoint – adjust if super-admin has separate route
            await api.post('/password/forgot', { email });
            setMessage('A password reset link has been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to send reset email. Please check the email address.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={mainStyle}>
            <div style={glowStyle} />

            <div style={containerStyle}>
                {/* Card */}
                <div style={cardStyle}>
                    <h1 style={{ ...titleStyle, fontSize: 24 }}>Forgot Password</h1>

                    <p style={subtitleStyle}>
                        Enter your email to receive a reset link
                    </p>

                    {message && (
                        <div style={{
                            ...messageStyle,
                            color: '#4ade80',
                            borderColor: 'rgba(74,222,128,0.2)',
                            background: 'rgba(74,222,128,0.08)'
                        }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={errorStyle}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email Address</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, email: '' }));
                                }}
                                placeholder="superadmin@paysigur.com"
                                style={{
                                    ...inputStyle,
                                    border: fieldErrors.email ? '1px solid #ef4444' : inputStyle.border,
                                }}
                            />

                            {fieldErrors.email && (
                                <p style={fieldErrorStyle}>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...submitStyle,
                                background: loading ? '#d4a017' : '#facc15',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/super-admin/login" style={backLinkStyle}>
                                ← Back to Login
                            </Link>
                        </div>
                    </form>

                    <div style={{
                        marginTop: 28,
                        paddingTop: 20,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#52525b',
                    }}>
                        Access restricted to authorized super administrators
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────── */
/*          Reused Styles (same as other pages)    */
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

const backLinkStyle = {
    fontSize: 12,
    color: '#71717a',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6
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
    fontSize: 12,
    textAlign: 'center'
};

const messageStyle = {
    marginBottom: 16,
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
    border: '1px solid',
    textAlign: 'center'
};