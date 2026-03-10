'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import { validateEmail } from '@/utils/validation';
import { Eye, ArrowLeft } from 'lucide-react'; // ArrowLeft optional – can remove if not wanted

import { useToast } from '@/context/ToastContext';

export default function ForgotPassword() {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
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
        setFieldErrors({ email: '' });

        if (!validateFields()) return;

        setLoading(true);

        try {
            await api.post('/password/forgot', { email });
            showToast('Recovery link dispatched to primary node');
            setEmail('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Signal failure: recovery sequence aborted', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={mainStyle}>
            {/* Ambient Background Effects */}
            <div style={glowTopStyle} />
            <div style={glowBottomStyle} />

            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={headerScope}>
                        <div style={iconWrapper}>
                            <svg width="24" height="24" fill="none" stroke="#fbbf24" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 style={titleStyle}>Secure Recovery</h1>
                        <p style={subtitleStyle}>Submit account identifier to initialize credential override</p>
                    </div>

                    {message && (
                        <div style={successBoxStyle}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={errorBoxStyle}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputScope}>
                            <label style={labelStyle}>Merchant Email Address</label>
                            <div style={fieldWrapper}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFieldErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    placeholder="your@email.com"
                                    style={{
                                        ...inputStyle,
                                        borderColor: fieldErrors.email ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.08)'
                                    }}
                                />
                            </div>
                            {fieldErrors.email && <p style={fieldErrorText}>{fieldErrors.email}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...submitBtnStyle,
                                opacity: loading ? 0.7 : 1,
                                transform: loading ? 'scale(0.98)' : 'scale(1)'
                            }}
                        >
                            {loading ? (
                                <div style={loadingScope}>
                                    <div style={miniSpinnerStyle} />
                                    <span>Processing...</span>
                                </div>
                            ) : 'Request Access Link'}
                        </button>

                        <div style={footerActionScope}>
                            <Link href="/admin/login" style={backLinkStyle}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Return to Access Terminal
                            </Link>
                        </div>
                    </form>
                </div>

                <p style={footerCopyright}>
                    &copy; {new Date().getFullYear()} Paysigur Protocol. Recovery Division.
                </p>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────── */
/*                  PREMIUM STYLES                  */
/* ────────────────────────────────────────────── */

const mainStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050506',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif"
};

const glowTopStyle = {
    position: 'absolute',
    top: '-150px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 1
};

const glowBottomStyle = {
    position: 'absolute',
    bottom: '-250px',
    right: '-100px',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.02) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 1
};

const containerStyle = {
    width: '100%',
    maxWidth: '440px',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const cardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(32px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '28px',
    padding: '44px',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)'
};

const headerScope = {
    marginBottom: '32px',
    textAlign: 'center'
};

const iconWrapper = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
};

const titleStyle = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: '8px'
};

const subtitleStyle = {
    fontSize: '13px',
    color: '#71717a',
    lineHeight: '1.5',
    maxWidth: '280px',
    margin: '0 auto'
};

const successBoxStyle = {
    background: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#10b981',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
    textAlign: 'center'
};

const errorBoxStyle = {
    background: 'rgba(244, 63, 94, 0.06)',
    border: '1px solid rgba(244, 63, 94, 0.2)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#f43f5e',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const inputScope = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const labelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginLeft: '4px'
};

const fieldWrapper = {
    position: 'relative'
};

const inputStyle = {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid',
    borderRadius: '14px',
    padding: '14px 18px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const fieldErrorText = {
    fontSize: '11px',
    color: '#f43f5e',
    fontWeight: '700',
    marginLeft: '4px'
};

const submitBtnStyle = {
    marginTop: '8px',
    padding: '16px',
    background: '#fbbf24',
    border: 'none',
    borderRadius: '14px',
    color: '#000',
    fontSize: '14px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(251, 191, 36, 0.2)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const loadingScope = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
};

const miniSpinnerStyle = {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid rgba(0, 0, 0, 0.1)',
    borderTop: '2px solid #000',
    animation: 'spin 0.8s linear infinite'
};

const footerActionScope = {
    textAlign: 'center',
    marginTop: '8px'
};

const backLinkStyle = {
    fontSize: '12px',
    color: '#52525b',
    textDecoration: 'none',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.2s ease'
};

const footerCopyright = {
    textAlign: 'center',
    fontSize: '11px',
    color: '#3f3f46',
    fontWeight: '600',
    letterSpacing: '0.02em'
};
