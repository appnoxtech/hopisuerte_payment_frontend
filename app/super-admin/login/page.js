'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';

export default function SuperAdminLogin() {
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
            const response = await api.post('/super-admin/login', { email, password });

            localStorage.setItem('super_admin_token', response.data.access_token);
            showToast('Login successfully', 'success');
            await refreshUser();
            router.push('/super-admin');
        } catch (err) {
            let msg = 'Server error. Please try again later.';
            if (err.response?.status === 403) {
                msg = 'Access denied. Super Admin privileges required.';
            } else if (err.response?.status === 401) {
                msg = 'Invalid email or password.';
            }
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
                    <Image
                        src="/paysigur.png"
                        alt="Paysigur"
                        width={400}
                        height={120}
                        priority
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    />
                </div>
                {/* Card */}
                <div className="login-card">
                    <h1 style={{ ...titleStyle, fontSize: 28 }}>Super Admin</h1>

                    <p style={{ ...subtitleStyle, marginBottom: 28 }}>
                        Restricted management portal
                    </p>

                    {error && (
                        <div style={errorStyle}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

                        {/* Password */}
                        <div>
                            <label style={labelStyle}>Password</label>

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
                                        border: fieldErrors.password ? '1px solid #ef4444' : inputStyle.border,
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

                            {fieldErrors.password && (
                                <p style={fieldErrorStyle}>
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...submitStyle,
                                background: loading ? '#005BBB' : '#0070E0',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link href="/super-admin/forgot-password" style={forgotStyle}>
                                Forgot your password?
                            </Link>
                        </div>
                    </form>

                    {/* <div style={{
                        marginTop: 28,
                        paddingTop: 20,
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#52525b',
                    }}>
                        Access restricted to authorized super administrators only
                    </div> */}
                </div>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────── */
/*          Reused Styles (same as previous pages) */
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
    transition: 'all 0.2s ease'
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