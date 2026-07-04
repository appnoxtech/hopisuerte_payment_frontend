'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { validateEmail } from '@/utils/validation';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';
import { Eye, EyeOff } from 'lucide-react';
import './UnifiedLogin.css';

export default function UnifiedLogin({ initialMode = 'merchant' }) {
    const { showToast } = useToast();
    const { refreshUser } = useUser();
    const router = useRouter();

    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

    const handleModeSwitch = (newMode) => {
        if (newMode === mode) return;
        setMode(newMode);
        setError('');
        setFieldErrors({ email: '', password: '' });

        // Update URL without remounting the component
        const newUrl = newMode === 'super' ? '/super-admin/login' : '/merchant/login';
        window.history.replaceState(null, '', newUrl);
    };

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
            const endpoint = mode === 'super' ? '/super-admin/login' : '/login';
            const response = await api.post(endpoint, { email, password });

            if (mode === 'merchant') {
                const userRole = response.data.user?.role;
                if (userRole === 'admin') {
                    showToast('Super Admin accounts must use the Super Admin portal.', 'error');
                    setError('Super Admin accounts must use the Super Admin portal.');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('auth_token', response.data.access_token);
                showToast('Login successfully', 'success');
                await refreshUser();
                router.push('/merchant');
            } else {
                const userRole = response.data.user?.role;
                if (userRole !== 'admin') {
                    showToast('Unauthorized. Super Admin access required.', 'error');
                    setError('Unauthorized. Super Admin access required.');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('super_admin_token', response.data.access_token);
                showToast('Super Admin Login successful', 'success');
                await refreshUser();
                router.push('/super-admin');
            }
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                const msg = err.response?.data?.message || 'Invalid email or password.';
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
        <div className="unified-login-page">
            {/* LEFT: brand panel */}
            <div className="brand-side">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>

                <div className="logo-lockup">
                    <Image src="/logo-full.jpg" alt="Paysigur" width={160} height={40} style={{ objectFit: 'contain' }} />
                </div>

                <div className="brand-copy">
                    <div className="kicker">
                        <span className="dot"></span> Revenue Intelligence
                    </div>
                    <h1>
                        The infrastructure for <br />
                        global commerce.
                    </h1>
                    <p>
                        Manage payments, analyze revenue streams, and automate your financial operations from one powerful command center.
                    </p>

                    <div className="feature-row">
                        <div className="feature-pill">
                            <div className="ic">
                                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <b>Real-time Sync</b>
                                <span>Zero-latency payment updates</span>
                            </div>
                        </div>
                        <div className="feature-pill">
                            <div className="ic" style={{ background: 'linear-gradient(135deg, var(--teal), var(--green))' }}>
                                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <div>
                                <b>Bank-grade Security</b>
                                <span>End-to-end encrypted flows</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="wave-wrap">
                    <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="rgba(20,119,198,0.05)" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* RIGHT: auth card */}
            <div className="auth-side">
                <div className="card">
                    <div className="switcher" data-mode={mode}>
                        <div className="thumb"></div>
                        <button
                            className={mode === 'merchant' ? 'active' : ''}
                            onClick={() => handleModeSwitch('merchant')}
                            type="button"
                        >
                            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Admin
                        </button>
                        <button
                            className={mode === 'super' ? 'active' : ''}
                            onClick={() => handleModeSwitch('super')}
                            type="button"
                        >
                            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            Super Admin
                        </button>
                    </div>

                    {/* {mode === 'super' && (
                        <div className="clearance">
                            <span className="dot"></span> Level 5 Clearance
                        </div>
                    )} */}

                    <h2>{mode === 'super' ? 'System access' : 'Welcome back'}</h2>
                    <p className="sub">
                        {mode === 'super'
                            ? 'Please authenticate to access the core.'
                            : 'Sign in to your merchant dashboard.'}
                    </p>

                    {error && (
                        <div style={{ padding: 12, background: '#FEF2F2', color: '#EF4444', borderRadius: 8, fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="field">
                            <label>Email Address</label>
                            <div className="input-shell">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <input
                                    type="email"
                                    placeholder={mode === 'super' ? 'system@paysigur.com' : 'admin@paysigur.com'}
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: '' })) }}
                                    style={{ borderColor: fieldErrors.email ? '#EF4444' : undefined }}
                                />
                            </div>
                            {fieldErrors.email && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{fieldErrors.email}</div>}
                        </div>

                        <div className="field">
                            <label>Password</label>
                            <div className="input-shell">
                                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: '' })) }}
                                    style={{ paddingRight: 44, borderColor: fieldErrors.password ? '#EF4444' : undefined }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#9aa8bd', padding: 0 }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {fieldErrors.password && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{fieldErrors.password}</div>}
                        </div>

                        <div className="row-between">
                            <label className="remember">
                                <input type="checkbox" /> Remember me
                            </label>
                            <Link href={mode === 'super' ? '/super-admin/forgot-password' : '/merchant/forgot-password'}>
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="submit" disabled={loading}>
                            {loading ? 'Authenticating...' : (mode === 'super' ? 'Get Access' : 'Log In')}
                            {!loading && <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                        </button>
                    </form>

                    <div className="footnote">
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Protected by AES-256 Encryption
                    </div>
                </div>
            </div>
        </div>
    );
}
