'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
            localStorage.removeItem('auth_token');
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
            <div style={glowStyle} />

            <div style={containerStyle}>
                {/* Card */}
                <div style={cardStyle}>
                    <h1 style={{ ...titleStyle, fontSize: 26 }}>Super Admin</h1>

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
                                background: loading ? '#d4a017' : '#facc15',
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

                    <div style={{
                        marginTop: 28,
                        paddingTop: 20,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        textAlign: 'center',
                        fontSize: 11,
                        color: '#52525b',
                    }}>
                        Access restricted to authorized super administrators only
                    </div>
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
    background: '#000',
    padding: 20,
    position: 'relative'
};

const glowStyle = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 640,
    height: 340,
    background: 'rgba(250,204,21,0.14)',
    borderRadius: '50%',
    filter: 'blur(130px)'
};

const containerStyle = {
    width: '100%',
    maxWidth: 420,
    zIndex: 2
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 18,
    padding: 32
};

const titleStyle = {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.5
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
    marginTop: 8,
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
    marginBottom: 20,
    padding: 12,
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444',
    borderRadius: 10,
    fontSize: 13,
    textAlign: 'center'
};