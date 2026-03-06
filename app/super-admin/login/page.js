'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';

export default function SuperAdminLogin() {
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
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                position: 'relative',
                overflow: 'hidden'
            }}
        >

            {/* Background blur circles */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>

                <div
                    style={{
                        position: 'absolute',
                        top: '-160px',
                        left: '-160px',
                        width: '320px',
                        height: '320px',
                        background: 'rgba(234,179,8,0.05)',
                        borderRadius: '50%',
                        filter: 'blur(80px)'
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: '-160px',
                        right: '-160px',
                        width: '380px',
                        height: '380px',
                        background: 'rgba(202,138,4,0.05)',
                        borderRadius: '50%',
                        filter: 'blur(80px)'
                    }}
                />

            </div>

            {/* Grid overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.03,
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div style={{ position: 'relative', width: '100%', maxWidth: 450, margin: '0 16px' }}>

                {/* Secure badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '6px 14px',
                            background: 'rgba(234,179,8,0.1)',
                            border: '1px solid rgba(234,179,8,0.2)',
                            borderRadius: 50
                        }}
                    >
                        <span
                            style={{
                                color: '#facc15',
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 2,
                                textTransform: 'uppercase'
                            }}
                        >
                            Secure Portal
                        </span>
                    </div>

                </div>

                <div
                    style={{
                        background: 'rgba(24,24,27,0.85)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: 40,
                        borderRadius: 16,
                        position: 'relative'
                    }}
                >

                    {/* Accent line */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 96,
                            height: 4,
                            borderBottomLeftRadius: 50,
                            borderBottomRightRadius: 50,
                            background: 'linear-gradient(to right,#facc15,#ca8a04)'
                        }}
                    />

                    {/* Heading */}
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>

                        <h1
                            style={{
                                fontSize: 30,
                                fontWeight: 900,
                                background: 'linear-gradient(to right,#facc15,#ca8a04)',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                textTransform: 'uppercase',
                                fontStyle: 'italic'
                            }}
                        >
                            Super Admin
                        </h1>

                        <p
                            style={{
                                color: '#71717a',
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: 2,
                                textTransform: 'uppercase'
                            }}
                        >
                            Management Portal
                        </p>

                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: 20,
                                padding: 14,
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                color: '#ef4444',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 700
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} noValidate>

                        {/* Email */}
                        <div style={{ marginBottom: 20 }}>

                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: '#71717a',
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: 2
                                }}
                            >
                                Admin Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                placeholder="admin@paysigur.com"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, email: '' }));
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    borderRadius: 10,
                                    border: fieldErrors.email ? '1px solid red' : '1px solid #333',
                                    background: '#111',
                                    color: '#fff'
                                }}
                            />

                            {fieldErrors.email && (
                                <p style={{ color: '#f87171', fontSize: 11, marginTop: 6 }}>
                                    {fieldErrors.email}
                                </p>
                            )}

                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 24 }}>

                            <label
                                style={{
                                    display: 'block',
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: '#71717a',
                                    marginBottom: 6,
                                    textTransform: 'uppercase',
                                    letterSpacing: 2
                                }}
                            >
                                Password
                            </label>

                            <div style={{ position: 'relative' }}>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    placeholder="••••••••"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setFieldErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: 10,
                                        border: fieldErrors.password ? '1px solid red' : '1px solid #333',
                                        background: '#111',
                                        color: '#fff'
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: '#aaa'
                                    }}
                                >
                                    👁
                                </button>

                            </div>

                            {fieldErrors.password && (
                                <p style={{ color: '#f87171', fontSize: 11, marginTop: 6 }}>
                                    {fieldErrors.password}
                                </p>
                            )}

                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 12,
                                border: 'none',
                                fontWeight: 800,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                background: 'linear-gradient(to right,#facc15,#ca8a04)',
                                cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Link
                                href="/super-admin/forgot-password"
                                style={{
                                    fontSize: 11,
                                    color: '#a1a1aa',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    letterSpacing: 1
                                }}
                            >
                                Trouble signing in? Reset Password
                            </Link>
                        </div>

                    </form>

                    <div
                        style={{
                            marginTop: 30,
                            paddingTop: 20,
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            textAlign: 'center',
                            fontSize: 10,
                            color: '#52525b',
                            letterSpacing: 2,
                            fontWeight: 700
                        }}
                    >
                        Access is restricted to authorized platform administrators.
                    </div>

                </div>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <p
                        style={{
                            color: '#444',
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 5,
                            textTransform: 'uppercase'
                        }}
                    >
                        Paysigur Platform
                    </p>
                </div>

            </div>
        </div>
    );
}