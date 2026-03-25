'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';
import { useToast } from '@/context/ToastContext';

export default function AdminForgotPassword() {
    const { showToast } = useToast();
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
            await api.post('/password/forgot', { email });
            showToast('A password reset link has been sent to your email.');
            setMessage('A password reset link has been sent to your email.');
            setEmail('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to send reset email. Please check the email address.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={mainStyle}>
            {/* Responsive Styles */}
            <style>{`
                .login-container {
                    width: 100%;
                    max-width: 440px;
                    z-index: 2;
                    padding: 0 16px;
                }
                .login-logo-wrap {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 16px;
                }
                .login-logo-wrap img {
                    width: 100%;
                    max-width: 160px;
                    height: auto !important;
                }
                .login-card {
                    background: #FFFFFF;
                    border: 1px solid #E3E8EF;
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 28, 100, 0.2);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .login-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 40px 80px -20px rgba(0, 28, 100, 0.15);
                }
                @media (max-width: 480px) {
                    .login-card {
                        padding: 28px 20px;
                        border-radius: 20px;
                    }
                    .login-logo-wrap img {
                        max-width: 130px;
                    }
                    .login-logo-wrap {
                        margin-bottom: 12px;
                    }
                }
                @media (min-width: 1200px) {
                    .login-container {
                        max-width: 460px;
                    }
                    .login-logo-wrap img {
                        max-width: 180px;
                    }
                }
            `}</style>

            <div style={glowStyle} />

            <div className="login-container">
                {/* Logo */}
                <div className="login-logo-wrap">
                    <img
                        src="/paysigur.png"
                        alt="Paysigur"
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    />
                </div>

                {/* Card */}
                <div className="login-card">
                    <h1 style={titleStyle}>Forgot Password</h1>

                    <p style={subtitleStyle}>
                        Enter your email to receive a reset link
                    </p>

                    {message && (
                        <div style={{
                            ...messageStyle,
                            color: '#16a34a',
                            borderColor: '#bbf7d0',
                            background: '#f0fdf4'
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
                                placeholder="merchant@paysigur.com"
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
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/admin/login" style={backLinkStyle}>
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
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
    background: '#F7F9FC',
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden'
};

const glowStyle = {
    position: 'absolute',
    top: -150,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 600,
    height: 400,
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.05) 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 0
};

const titleStyle = {
    fontSize: 26,
    fontWeight: 800,
    color: '#001C64',
    textAlign: 'center',
    letterSpacing: '-0.02em',
    fontFamily: "'Outfit', sans-serif"
};

const subtitleStyle = {
    fontSize: 15,
    color: '#6B7C93',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 500,
    lineHeight: 1.6
};

const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#4A5568',
    marginBottom: 8,
    display: 'block',
    marginLeft: 2
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    background: '#F8FAFC',
    border: '1px solid #E3E8EF',
    color: '#1A1F36',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const submitStyle = {
    marginTop: 8,
    padding: '16px',
    background: '#0070E0',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    fontSize: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s ease'
};

const backLinkStyle = {
    fontSize: 14,
    color: '#0070E0',
    textDecoration: 'none',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
};

const fieldErrorStyle = {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    fontWeight: 500,
    marginLeft: 2
};

const errorStyle = {
    marginBottom: 24,
    padding: 14,
    background: '#FEF2F2',
    border: '1px solid #FEE2E2',
    color: '#EF4444',
    borderRadius: 12,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 600
};

const messageStyle = {
    marginBottom: 24,
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    border: '1px solid',
    textAlign: 'center',
    fontWeight: 600
};
