'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { validateEmail } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';

export default function AdminLogin() {
    const { showToast } = useToast();
    const { refreshUser } = useUser();
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

            showToast('Login successfully', 'success');
            await refreshUser();
            router.push('/admin');

        } catch (err) {

            if (err.response?.status === 403) {
                const msg = err.response?.data?.message || 'Your account is disabled.';
                setError(msg);
                showToast(msg, 'error');
            } else {
                const msg = 'Invalid email or password.';
                setError(msg);
                showToast(msg, 'error');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={mainStyle}>

            <div style={glowStyle} />

            <div style={containerStyle}>

                {/* Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <Image
                        src="/paysigur.png"
                        alt="Paysigur"
                        width={300}
                        height={90}
                        priority
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                {/* Card */}
                <div style={cardStyle}>

                    <h1 style={titleStyle}>
                        Admin Login
                    </h1>

                    <p style={subtitleStyle}>
                        Sign in to manage your payments
                    </p>

                    {error && (
                        <div style={errorStyle}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, email: '' }));
                                }}
                                placeholder="admin@paysigur.com"
                                style={{
                                    ...inputStyle,
                                    border: fieldErrors.email ? '1px solid #ef4444' : inputStyle.border
                                }}
                            />

                            {fieldErrors.email && (
                                <p style={fieldErrorStyle}>
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>

                            <label style={labelStyle}>
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
                                        ...inputStyle,
                                        paddingRight: 44,
                                        border: fieldErrors.password ? '1px solid #ef4444' : inputStyle.border
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={toggleBtn}
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>

                            </div>

                            {fieldErrors.password && (
                                <p style={fieldErrorStyle}>
                                    {fieldErrors.password}
                                </p>
                            )}

                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={submitStyle}
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/admin/forgot-password" style={forgotStyle}>
                                Forgot your password?
                            </Link>
                        </div>

                    </form>

                </div>



            </div>

        </div>
    );
}


/* ---------- STYLES ---------- */

const mainStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F7F9FC',
    padding: 24,
    position: 'relative',
    overflow: 'hidden'
};

const containerStyle = {
    width: '100%',
    maxWidth: 440,
    zIndex: 2,
    marginTop: -40
};

const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: 24,
    padding: 48,
    boxShadow: '0 20px 25px -5px rgba(0, 28, 100, 0.05), 0 10px 10px -5px rgba(0, 28, 100, 0.02)'
};

const titleStyle = {
    fontSize: 28,
    fontWeight: 800,
    color: '#001C64',
    textAlign: 'center',
    letterSpacing: '-0.03em',
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

const toggleBtn = {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7C93'
};

const submitStyle = {
    marginTop: 12,
    padding: '16px',
    background: '#0070E0',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    fontSize: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
};

const forgotStyle = {
    fontSize: 14,
    color: '#0070E0',
    textDecoration: 'none',
    fontWeight: 600
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