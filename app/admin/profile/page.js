'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ProfileSettings() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [slug, setSlug] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalSlug, setOriginalSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
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
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        const isSlugChanged = slug !== originalSlug;
        const isProfileChanged = name !== originalName || email !== originalEmail;

        if (isSlugChanged || isProfileChanged) {
            const warningMessage = isSlugChanged
                ? 'Are you sure you wanted to save these changes? This will change your public URL and make old links stop working.'
                : 'Are you sure you want to save these profile changes?';

            const confirmed = window.confirm(warningMessage);
            if (!confirmed) {
                setSaving(false);
                return;
            }
        }

        try {
            const response = await api.put('/user', { name, email, slug });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setSlug(response.data.slug);
            setOriginalName(response.data.name);
            setOriginalEmail(response.data.email);
            setOriginalSlug(response.data.slug);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                borderTop: '3px solid #facc15',
                borderBottom: '3px solid #facc15',
                animation: 'spin 1s linear infinite'
            }} />
        </div>
    );

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 16px',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
        }}>

            {/* Header */}
            <header style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: '900',
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em'
                    }}>
                        Profile Settings
                    </h1>

                    <p style={{
                        color: '#71717a',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#eab308'
                        }}></span>
                        Manage your account and public visibility
                    </p>
                </div>
            </header>

            {message.text && (
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: message.type === 'success' ? '1px solid #16a34a40' : '1px solid #dc262640',
                    color: message.type === 'success' ? '#4ade80' : '#f87171',
                    background: message.type === 'success' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)'
                }}>
                    {message.text}
                </div>
            )}

            {/* Account Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '4px',
                        height: '20px',
                        background: '#eab308',
                        borderRadius: '4px'
                    }}></div>

                    <h2 style={{
                        fontSize: '12px',
                        fontWeight: '900',
                        color: '#a1a1aa',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em'
                    }}>
                        Account Details
                    </h2>
                </div>

                <div style={{
                    padding: '40px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>

                    <form onSubmit={handleUpdate} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px'
                    }}>

                        {/* Name & Email */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '32px'
                        }}>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '9px',
                                    fontWeight: '900',
                                    color: '#71717a',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    marginBottom: '6px'
                                }}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.4)',
                                        color: '#fff',
                                        fontWeight: '600'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '9px',
                                    fontWeight: '900',
                                    color: '#71717a',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    marginBottom: '6px'
                                }}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={{
                                        width: '100%',
                                        padding: '14px 20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.4)',
                                        color: '#fff',
                                        fontWeight: '600'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Slug */}
                        <div style={{
                            paddingTop: '30px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>

                            <div>
                                <label style={{
                                    fontSize: '9px',
                                    fontWeight: '900',
                                    color: '#71717a',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em'
                                }}>
                                    Public URL Slug
                                </label>

                                <div style={{
                                    display: 'flex',
                                    marginTop: '8px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    overflow: 'hidden',
                                    maxWidth: '500px'
                                }}>
                                    <div style={{
                                        padding: '12px 18px',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: '#71717a',
                                        fontWeight: '700'
                                    }}>
                                        /u/
                                    </div>

                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        style={{
                                            flex: 1,
                                            padding: '12px 18px',
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            color: '#fff'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                padding: '14px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                maxWidth: '500px'
                            }}>
                                <p style={{
                                    fontSize: '9px',
                                    color: '#71717a',
                                    fontWeight: '900',
                                    textTransform: 'uppercase'
                                }}>
                                    Your Public Link
                                </p>

                                <code style={{
                                    color: '#eab308',
                                    fontFamily: 'monospace',
                                    fontSize: '12px'
                                }}>
                                    {typeof window !== 'undefined'
                                        ? `${window.location.origin}/u/${slug || '...'}`
                                        : ''}
                                </code>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div style={{
                            paddingTop: '30px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            gap: '20px',
                            alignItems: 'center'
                        }}>

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '14px 50px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: '#eab308',
                                    color: '#000',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Profile Changes'}
                            </button>

                            <p style={{
                                fontSize: '10px',
                                color: '#71717a',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                Updating your slug will change your public profile address.
                            </p>
                        </div>

                    </form>
                </div>
            </section>

            {/* Warning */}
            <div style={{
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.05)',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
            }}>
                <div style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444'
                }}>
                    ⚠
                </div>

                <div>
                    <h3 style={{
                        color: '#ef4444',
                        fontWeight: '900',
                        fontSize: '11px',
                        textTransform: 'uppercase'
                    }}>
                        Important Note
                    </h3>

                    <p style={{
                        color: '#71717a',
                        fontSize: '13px'
                    }}>
                        If you change your URL slug, any old links you have shared will stop working.
                        Make sure to update them to prevent payment issues.
                    </p>
                </div>
            </div>
        </div>
    );
}