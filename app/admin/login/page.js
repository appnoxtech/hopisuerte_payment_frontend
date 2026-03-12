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
                        width={180}
                        height={54}
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
    background: '#000',
    padding: 20,
    position: 'relative'
};

const containerStyle = {
    width: '100%',
    maxWidth: 420,
    zIndex: 2
};

const logoWrap = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.2)',
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
    border: '1px solid rgba(255,255,255,0.2)',
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
    cursor: 'pointer'
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

const footerStyle = {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 10,
    color: '#52525b'
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