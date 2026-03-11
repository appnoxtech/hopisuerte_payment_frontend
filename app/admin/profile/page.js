'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    User,
    Mail,
    ShieldCheck,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Fingerprint
} from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export default function ProfileSettings() {
    const { refreshUser } = useUser();
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [slug, setSlug] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalSlug, setOriginalSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get('/user');
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setSlug(user.slug);
                setOriginalName(user.name);
                setOriginalEmail(user.email);
                setOriginalSlug(user.slug);
            } catch (err) {
                showToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [showToast]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await api.put('/user', { name, email, slug });
            showToast('Profile security updated', 'success');

            setSlug(response.data.slug);
            setOriginalName(response.data.name);
            setOriginalEmail(response.data.email);
            setOriginalSlug(response.data.slug);

            // Sync with sidebar
            await refreshUser();
        } catch (err) {
            showToast(err.response?.data?.message || 'Update synchronization failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #fbbf24', borderBottom: '2px solid rgba(251, 191, 36, 0.1)', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={pageContainerStyle}>
            {/* Header Section */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Profile Settings</h1>
                    <p style={subtitleStyle}>Manage your personal account details</p>
                </div>
            </header>

            {/* Profile Form */}
            <section style={formSectionStyle}>
                <div style={formCardStyle}>
                    <div style={formHeaderStyle}>
                        <div style={avatarCircleStyle}>{name?.[0]?.toUpperCase() || 'A'}</div>
                        <div>
                            <h2 style={formTitleStyle}>Account Information</h2>
                            <p style={formSubStyle}>These details are visible to customers on link pages</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} style={formStyle}>
                        <div style={inputGridStyle}>
                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputWrapperStyle}>
                                    <User size={14} style={inputIconStyle} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Email Address</label>
                                <div style={inputWrapperStyle}>
                                    <Mail size={14} style={inputIconStyle} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Freelancer Slug (Public URL)</label>
                                <div style={inputWrapperStyle}>
                                    <Fingerprint size={14} style={inputIconStyle} />
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="merchant-slug"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={actionScopeStyle}>
                            {/* <div style={disclaimerStyle}>
                                <AlertCircle size={12} style={{ marginTop: '2px' }} />
                                <span>Slug changes will break any previous payment links you have shared.</span>
                            </div> */}

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    ...submitButtonStyle,
                                    opacity: saving ? 0.7 : 1,
                                    cursor: saving ? 'wait' : 'pointer'
                                }}
                            >
                                {saving ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Save size={16} />
                                        <span>Save Changes</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div >
            </section >
        </div >
    );
}

// ──────────────────────────────────────────────
// STYLES DEFINITION
// ──────────────────────────────────────────────

const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.4s ease-out'
};

const headerWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
};

const titleStyle = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
};

const subtitleStyle = {
    fontSize: '11px',
    color: '#52525b',
    marginTop: '2px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const idBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#10b981',
    textTransform: 'uppercase'
};

const messageBoxStyle = {
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backdropFilter: 'blur(20px)'
};

const formSectionStyle = { marginTop: '4px' };

const formCardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(32px)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '16px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden'
};

const formHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '24px'
};

const avatarCircleStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.02))',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '900'
};

const formTitleStyle = {
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff',
    margin: 0
};

const formSubStyle = {
    fontSize: '11px',
    color: '#52525b',
    marginTop: '2px',
    fontWeight: '800'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const inputGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
};

const inputScopeStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const labelStyle = {
    fontSize: '10px',
    fontWeight: '900',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
};

const inputIconStyle = {
    position: 'absolute',
    left: '12px',
    color: '#52525b'
};

const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '10px 12px 10px 36px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const actionScopeStyle = {
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
};

const disclaimerStyle = {
    fontSize: '12px',
    color: '#52525b',
    maxWidth: '320px',
    lineHeight: '1.5',
    display: 'flex',
    gap: '8px'
};

const submitButtonStyle = {
    background: '#fbbf24',
    color: '#000',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.15)',
    transition: 'transform 0.2s ease',
};