'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { passwordRules, allPasswordRulesPassed, validatePassword } from '@/utils/validation';
import { Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid or expired password reset link.');
        }
    }, [token, email]);

    const allRulesPassed = allPasswordRulesPassed(password);
    const passwordsMatch = password.length > 0 && password === passwordConfirmation;

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/password/reset', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setSuccess(true);

            setTimeout(() => {
                router.push('/admin/login');
            }, 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            setError(msg.includes('same as') ? 'New password cannot be the same as your previous password.' : msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={mainStyle}>
                <div style={glowTopStyle} />
                <div style={containerStyle}>
                    <div style={cardStyle}>
                        <div style={headerScope}>
                            <div style={{ ...iconWrapper, background: '#ECFDF5', borderColor: '#A7F3D0' }}>
                                <svg width="24" height="24" fill="none" stroke="#10B981" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 style={{ ...titleStyle, color: '#10B981' }}>Reset Complete</h1>
                            <p style={subtitleStyle}>Your credentials have been successfully updated</p>
                        </div>

                        <div style={successFooter}>
                            <div style={miniSpinnerStyle} />
                            <span>Redirecting to Access Terminal...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={mainStyle}>
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
                        <h1 style={titleStyle}>Reset Password</h1>
                        <p style={subtitleStyle}>Initialize new secure password for your merchant account</p>
                    </div>

                    {error && (
                        <div style={errorBoxStyle}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {email && (
                        <div style={accountBatchStyle}>
                            <label style={labelSmallStyle}>Target Account</label>
                            <div style={emailValueStyle}>{email}</div>
                        </div>
                    )}

                    <form onSubmit={handleReset} style={formStyle}>
                        <div style={inputScope}>
                            <label style={labelStyle}>New Secure Password</label>
                            <div style={fieldWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={visibilityToggle}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {password.length > 0 && (
                            <div style={rulesCardStyle}>
                                <p style={rulesTitleStyle}>Passcode Complexity Matrix</p>
                                <div style={rulesGridStyle}>
                                    {passwordRules.map((rule, index) => {
                                        const passed = rule.test(password);
                                        return (
                                            <div key={index} style={ruleItemStyle}>
                                                <div style={{
                                                    ...ruleIndicatorStyle,
                                                    background: passed ? '#10B981' : '#E2E8F0',
                                                    borderColor: passed ? '#10B981' : '#CBD5E1'
                                                }} />
                                                <span style={{ color: passed ? '#059669' : '#64748B', fontSize: '12px', fontWeight: '500' }}>
                                                    {rule.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div style={inputScope}>
                            <label style={labelStyle}>Confirm Password</label>
                            <div style={fieldWrapper}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        ...inputStyle,
                                        borderColor: passwordConfirmation.length > 0
                                            ? (passwordsMatch ? '#10B981' : '#EF4444')
                                            : '#E3E8EF'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={visibilityToggle}
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {passwordConfirmation.length > 0 && (
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    marginTop: '6px',
                                    color: passwordsMatch ? '#10B981' : '#EF4444'
                                }}>
                                    {passwordsMatch ? 'PASSWORDS MATCH' : 'PASSWORDS MISMATCH'}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token || !allRulesPassed || !passwordsMatch}
                            style={{
                                ...submitBtnStyle,
                                opacity: (loading || !allRulesPassed || !passwordsMatch) ? 0.6 : 1
                            }}
                        >
                            {loading ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "20px" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', borderTop: '2px solid #FFFFFF', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', animation: 'spin 1s linear infinite' }} />
                                </div>
                            ) : 'Finalize Password Reset'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F7F9FC" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
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
    maxWidth: '460px',
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

const successFooter = {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #E3E8EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#10B981',
    fontWeight: '600'
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

const accountBatchStyle = {
    padding: '16px',
    borderRadius: '16px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    marginBottom: '28px'
};

const labelSmallStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px'
};

const emailValueStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0070E0'
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
    padding: '14px 44px 14px 18px',
    color: '#1A1F36',
    fontSize: '15px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const visibilityToggle = {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94A3B8',
    display: 'flex'
};

const rulesCardStyle = {
    padding: '16px',
    borderRadius: '16px',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0'
};

const rulesTitleStyle = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
};

const rulesGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px 20px'
};

const ruleItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const ruleIndicatorStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    border: '1px solid'
};

const submitBtnStyle = {
    marginTop: '12px',
    padding: '16px',
    background: '#0070E0',
    border: 'none',
    borderRadius: '14px',
    color: '#FFFFFF',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s ease'
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
