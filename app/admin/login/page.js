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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: 'black',
                position: 'relative',
                overflow: 'hidden'
            }}
        >

            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '32rem',
                    height: '500px',
                    background: 'rgba(234,179,8,0.05)',
                    borderRadius: '9999px',
                    filter: 'blur(120px)',
                    pointerEvents: 'none'
                }}
            />

            <div
                style={{
                    width: '100%',
                    maxWidth: '28rem',
                    padding: '40px',
                    position: 'relative',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}
                    >
                        <svg width="32" height="32" style={{ color: '#eab308' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: 900,
                        color: 'white',
                        marginBottom: '8px',
                        textTransform: 'uppercase'
                    }}>
                        Admin Login
                    </h1>

                    <p style={{
                        color: '#71717a',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em'
                    }}>
                        Sign in to manage your payments
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            marginBottom: '24px',
                            padding: '16px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#ef4444',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '10px',
                            fontWeight: 900,
                            color: '#71717a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '8px'
                        }}>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setFieldErrors(prev => ({ ...prev, email: '' }));
                            }}
                            placeholder="admin@example.com"
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                borderRadius: '12px',
                                background: 'black',
                                border: fieldErrors.email ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '16px'
                            }}
                        />

                        {fieldErrors.email && (
                            <p style={{
                                color: '#f87171',
                                fontSize: '10px',
                                fontWeight: 700,
                                marginTop: '6px'
                            }}>
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '10px',
                            fontWeight: 900,
                            color: '#71717a',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>

                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, password: '' }));
                                }}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '14px 60px 14px 24px',
                                    borderRadius: '12px',
                                    background: 'black',
                                    border: fieldErrors.password ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '16px'
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#71717a'
                                }}
                            >
                                👁
                            </button>
                        </div>

                        {fieldErrors.password && (
                            <p style={{
                                color: '#f87171',
                                fontSize: '10px',
                                fontWeight: 700,
                                marginTop: '6px'
                            }}>
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#eab308',
                            color: 'black',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            letterSpacing: '0.2em'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <Link href="/admin/forgot-password"
                            style={{
                                fontSize: '10px',
                                color: '#71717a',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em'
                            }}>
                            Forgot your password?
                        </Link>
                    </div>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '40px',
                    paddingTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <p style={{
                        fontSize: '10px',
                        color: '#52525b',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase'
                    }}>
                        HopiSuerte Admin Interface
                    </p>
                </div>
            </div>
        </div>
    );
}