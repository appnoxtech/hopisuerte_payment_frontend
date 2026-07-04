'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Copy, KeyRound } from 'lucide-react';

export default function ApiKeysPage() {
    const { showToast } = useToast();
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [newKey, setNewKey] = useState(null);

    const fetchKeys = async () => {
        try {
            const res = await api.get('/admin/api-keys');
            setKeys(res.data);
        } catch {
            showToast('Failed to load API keys', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchKeys(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            const res = await api.post('/admin/api-keys', { name });
            setNewKey(res.data.key);
            setName('');
            setShowForm(false);
            fetchKeys();
        } catch {
            showToast('Failed to create API key', 'error');
        }
    };

    const handleRevoke = async (id, keyName) => {
        if (!confirm(`Revoke API key "${keyName}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/admin/api-keys/${id}`);
            showToast('API key revoked', 'success');
            fetchKeys();
        } catch {
            showToast('Failed to revoke key', 'error');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard', 'success');
    };

    if (loading) {
        return <div style={msgStyle}>Loading API keys...</div>;
    }

    return (
        <div>
            <div style={headerRowStyle}>
                <div>
                    <h2 style={pageTitleStyle}>API Keys</h2>
                    <p style={pageSubStyle}>Manage API keys for payment verification</p>
                </div>
                <button style={addBtnStyle} onClick={() => { setShowForm(true); setNewKey(null); }}>
                    <Plus size={16} />
                    Create Key
                </button>
            </div>

            {newKey && (
                <div style={secretBannerStyle}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#001C64' }}>API Key Created</div>
                    <p style={{ fontSize: 13, margin: '0 0 8px 0', color: '#6B7C93' }}>
                        This key will only be shown once. Store it securely.
                    </p>
                    <div style={secretBoxStyle}>
                        <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{newKey}</code>
                        <button onClick={() => copyToClipboard(newKey)} style={copyBtnStyle}>
                            <Copy size={14} />
                        </button>
                    </div>
                    <button onClick={() => setNewKey(null)} style={dismissBtnStyle}>Dismiss</button>
                </div>
            )}

            {showForm && (
                <div style={formCardStyle}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#001C64' }}>New API Key</h3>
                    <form onSubmit={handleCreate}>
                        <input
                            style={inputStyle}
                            placeholder="e.g. Production Key, Test Key"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <button type="submit" style={saveBtnStyle}>Generate</button>
                            <button type="button" onClick={() => setShowForm(false)} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {keys.length === 0 ? (
                <div style={emptyStyle}>
                    <KeyRound size={48} color="#94A3B8" />
                    <p>No API keys created yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {keys.map(k => (
                        <div key={k.id} style={keyCardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#001C64', marginBottom: 4 }}>{k.name}</div>
                                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                                        Created {new Date(k.created_at).toLocaleDateString()}
                                        {k.last_used_at && ` · Last used ${new Date(k.last_used_at).toLocaleDateString()}`}
                                    </div>
                                </div>
                                <button onClick={() => handleRevoke(k.id, k.name)} style={revokeBtnStyle}>
                                    <Trash2 size={14} />
                                    Revoke
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={infoBoxStyle}>
                <strong>How to use:</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: 13, lineHeight: 1.6 }}>
                    Pass the API key in the <code style={codeStyle}>X-API-Key</code> header when calling:
                </p>
                <ul style={{ fontSize: 13, lineHeight: 2, marginTop: 8, paddingLeft: 20 }}>
                    <li><code style={codeStyle}>GET /api/v1/payments</code> — List payments</li>
                    <li><code style={codeStyle}>GET /api/v1/payments/{'{transactionId}'}</code> — Get payment details</li>
                </ul>
            </div>
        </div>
    );
}

const headerRowStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24,
};
const pageTitleStyle = {
    fontSize: 22, fontWeight: 800, color: '#001C64', margin: 0, letterSpacing: '-0.02em',
};
const pageSubStyle = {
    fontSize: 13, color: '#6B7C93', margin: '4px 0 0 0',
};
const addBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 20px', background: '#0070E0', color: '#FFF',
    border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14,
    cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
};
const formCardStyle = {
    background: '#FFF', border: '1px solid #E3E8EF', borderRadius: 16,
    padding: 24, marginBottom: 24,
};
const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1px solid #E3E8EF',
    borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box',
};
const saveBtnStyle = {
    padding: '12px 24px', background: '#0070E0', color: '#FFF',
    border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer',
};
const cancelBtnStyle = {
    padding: '12px 24px', background: '#FFF', color: '#6B7C93',
    border: '1px solid #E3E8EF', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer',
};
const emptyStyle = {
    textAlign: 'center', padding: '60px 20px', color: '#94A3B8', fontSize: 15,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
};
const keyCardStyle = {
    background: '#FFF', border: '1px solid #E3E8EF', borderRadius: 12,
    padding: '16px 20px',
};
const revokeBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
    borderRadius: 8, color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
};
const infoBoxStyle = {
    marginTop: 24, padding: 20, background: '#F0F7FF', borderRadius: 12,
    border: '1px solid #BFDBFE', fontSize: 13, color: '#1E293B',
};
const codeStyle = {
    background: '#E2E8F0', padding: '2px 6px', borderRadius: 4, fontSize: 12,
};
const secretBannerStyle = {
    background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 16,
    padding: 20, marginBottom: 24,
};
const secretBoxStyle = {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#FFF', border: '1px solid #FFE082', borderRadius: 8,
    padding: '12px 16px', fontFamily: 'monospace',
};
const copyBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer', color: '#0070E0', flexShrink: 0,
};
const dismissBtnStyle = {
    marginTop: 8, background: 'none', border: 'none',
    color: '#6B7C93', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
const msgStyle = {
    textAlign: 'center', padding: '60px 20px', color: '#6B7C93', fontSize: 15,
};
