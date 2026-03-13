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
            showToast('Reset password link sent to your email');
            setEmail('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Reset password link not sent', 'error');
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
                            <svg width="24" height="24" fill="none" stroke="#0070E0" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 style={titleStyle}>Secure Recovery</h1>
                        <p style={subtitleStyle}>Submit account email to initialize password reset</p>
                    </div>


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
                                        borderColor: fieldErrors.email ? '#EF4444' : '#E3E8EF'
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
                                Return to Login
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
    background: '#F7F9FC',
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
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.04) 0%, transparent 70%)',
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
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '28px',
    padding: '44px',
    boxShadow: '0 20px 40px rgba(0, 28, 100, 0.08)'
};

const headerScope = {
    marginBottom: '32px',
    textAlign: 'center'
};

const iconWrapper = {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: '#F0F7FF',
    border: '1px solid #D0E2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px auto'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#001c64',
    letterSpacing: '-0.02em',
    marginBottom: '8px'
};

const subtitleStyle = {
    fontSize: '15px',
    color: '#6B7C93',
    lineHeight: '1.6',
    maxWidth: '320px',
    margin: '0 auto'
};

const successBoxStyle = {
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#10B981',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '28px'
};

const errorBoxStyle = {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#EF4444',
    fontSize: '14px',
    fontWeight: '600',
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
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A5568',
    marginLeft: '4px'
};

const fieldWrapper = {
    position: 'relative'
};

const inputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '14px',
    padding: '14px 18px',
    color: '#1A1F36',
    fontSize: '15px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const fieldErrorText = {
    fontSize: '13px',
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: '4px'
};

const submitBtnStyle = {
    marginTop: '8px',
    padding: '16px',
    background: '#0070E0',
    border: 'none',
    borderRadius: '14px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const loadingScope = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px'
};

const miniSpinnerStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderTop: '2px solid #FFFFFF',
    animation: 'spin 0.8s linear infinite'
};

const footerActionScope = {
    textAlign: 'center',
    marginTop: '8px'
};

const backLinkStyle = {
    fontSize: '14px',
    color: '#6B7C93',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.2s ease'
};

const footerCopyright = {
    textAlign: 'center',
    fontSize: '13px',
    color: '#94A3B8',
    fontWeight: '500'
};
