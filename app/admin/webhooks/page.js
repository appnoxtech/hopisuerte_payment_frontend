'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, RotateCw, Eye, EyeOff, CheckCircle2, XCircle, RefreshCw, Webhook, Copy } from 'lucide-react';

const AVAILABLE_EVENTS = [
    { value: 'payment.succeeded', label: 'Payment Success' },
    { value: 'payment.failed', label: 'Payment Failed' },
    { value: 'payment.refunded', label: 'Refund' },
    { value: 'chargeback', label: 'Chargeback' },
    { value: 'subscription.renewed', label: 'Subscription Renewed' },
    { value: 'subscription.renewal_failed', label: 'Subscription Renewal Failed' },
    { value: 'subscription.cancelled', label: 'Subscription Cancelled' },
    { value: 'subscription.expired', label: 'Subscription Expired' },
];

export default function WebhooksPage() {
    const { showToast } = useToast();
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ url: '', events: [] });
    const [newSecret, setNewSecret] = useState(null);
    const [deliveries, setDeliveries] = useState({});
    const [showDeliveries, setShowDeliveries] = useState(null);

    const fetchEndpoints = async () => {
        try {
            const res = await api.get('/admin/webhook-endpoints');
            setEndpoints(res.data);
        } catch {
            showToast('Failed to load webhook endpoints', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEndpoints(); }, []);

    const toggleEvent = (event) => {
        setForm(prev => ({
            ...prev,
            events: prev.events.includes(event)
                ? prev.events.filter(e => e !== event)
                : [...prev.events, event]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.url || form.events.length === 0) {
            showToast('Please fill in URL and select at least one event', 'warning');
            return;
        }
        try {
            if (editing) {
                const res = await api.put(`/admin/webhook-endpoints/${editing}`, form);
                if (res.data.secret) {
                    setNewSecret(res.data.secret);
                }
                showToast('Webhook endpoint updated', 'success');
            } else {
                const res = await api.post('/admin/webhook-endpoints', form);
                setNewSecret(res.data.secret);
                showToast('Webhook endpoint created', 'success');
            }
            setShowForm(false);
            setEditing(null);
            setForm({ url: '', events: [] });
            fetchEndpoints();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to save', 'error');
        }
    };

    const handleEdit = (endpoint) => {
        setEditing(endpoint.id);
        setForm({ url: endpoint.url, events: endpoint.events });
        setShowForm(true);
        setNewSecret(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this webhook endpoint?')) return;
        try {
            await api.delete(`/admin/webhook-endpoints/${id}`);
            showToast('Webhook endpoint deleted', 'success');
            fetchEndpoints();
        } catch {
            showToast('Failed to delete', 'error');
        }
    };

    const toggleActive = async (endpoint) => {
        try {
            await api.put(`/admin/webhook-endpoints/${endpoint.id}`, {
                is_active: !endpoint.is_active,
                url: endpoint.url,
                events: endpoint.events,
            });
            fetchEndpoints();
        } catch {
            showToast('Failed to toggle status', 'error');
        }
    };

    const fetchDeliveries = async (id) => {
        if (showDeliveries === id) {
            setShowDeliveries(null);
            return;
        }
        try {
            const res = await api.get(`/admin/webhook-endpoints/${id}/deliveries`);
            setDeliveries(prev => ({ ...prev, [id]: res.data.data || res.data }));
            setShowDeliveries(id);
        } catch {
            showToast('Failed to load deliveries', 'error');
        }
    };

    const handleReplay = async (deliveryId) => {
        try {
            await api.post(`/admin/webhook-deliveries/${deliveryId}/replay`);
            showToast('Webhook replayed', 'success');
        } catch {
            showToast('Failed to replay', 'error');
        }
    };

    const handleRotateSecret = async (id) => {
        try {
            const res = await api.post(`/admin/webhook-endpoints/${id}/rotate-secret`);
            setNewSecret(res.data.secret);
            showToast('New secret generated', 'success');
        } catch {
            showToast('Failed to rotate secret', 'error');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showToast('Copied to clipboard', 'success');
    };

    if (loading) {
        return <div style={msgStyle}>Loading webhook configuration...</div>;
    }

    return (
        <div>
            <div style={headerRowStyle}>
                <div>
                    <h2 style={pageTitleStyle}>Webhook Endpoints</h2>
                    <p style={pageSubStyle}>Configure outbound webhooks for payment events</p>
                </div>
                <button style={addBtnStyle} onClick={() => { setShowForm(true); setEditing(null); setForm({ url: '', events: [] }); setNewSecret(null); }}>
                    <Plus size={16} />
                    Add Endpoint
                </button>
            </div>

            {newSecret && (
                <div style={secretBannerStyle}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#001C64' }}>Webhook Secret</div>
                    <p style={{ fontSize: 13, margin: '0 0 8px 0', color: '#6B7C93' }}>
                        This secret will only be shown once. Store it securely.
                    </p>
                    <div style={secretBoxStyle}>
                        <code style={{ fontSize: 12, wordBreak: 'break-all' }}>{newSecret}</code>
                        <button onClick={() => copyToClipboard(newSecret)} style={copyBtnStyle}>
                            <Copy size={14} />
                        </button>
                    </div>
                    <button onClick={() => setNewSecret(null)} style={dismissBtnStyle}>Dismiss</button>
                </div>
            )}

            {showForm && (
                <div style={formCardStyle}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#001C64' }}>
                        {editing ? 'Edit Endpoint' : 'New Endpoint'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Webhook URL</label>
                            <input
                                style={inputStyle}
                                type="url"
                                placeholder="https://your-merchant-site.com/webhook"
                                value={form.url}
                                onChange={(e) => setForm({ ...form, url: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Events to Send</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                {AVAILABLE_EVENTS.map(ev => (
                                    <label
                                        key={ev.value}
                                        style={{
                                            ...eventChipStyle,
                                            background: form.events.includes(ev.value) ? '#0070E0' : '#F0F7FF',
                                            color: form.events.includes(ev.value) ? '#FFF' : '#1A1F36',
                                            borderColor: form.events.includes(ev.value) ? '#0070E0' : '#E3E8EF',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={form.events.includes(ev.value)}
                                            onChange={() => toggleEvent(ev.value)}
                                            style={{ display: 'none' }}
                                        />
                                        {ev.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="submit" style={saveBtnStyle}>
                                {editing ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setNewSecret(null); }} style={cancelBtnStyle}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {endpoints.length === 0 ? (
                <div style={emptyStyle}>
                    <Webhook size={48} color="#94A3B8" />
                    <p>No webhook endpoints configured.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {endpoints.map(ep => (
                        <div key={ep.id} style={endpointCardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: ep.is_active ? '#10B981' : '#EF4444',
                                        }} />
                                        <span style={{ fontWeight: 700, fontSize: 15, color: '#001C64', wordBreak: 'break-all' }}>
                                            {ep.url}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                                        {(ep.events || []).map(ev => (
                                            <span key={ev} style={eventBadgeStyle}>
                                                {AVAILABLE_EVENTS.find(e => e.value === ev)?.label || ev}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                                        {ep.deliveries_count || 0} deliveries · Created {new Date(ep.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
                                    <button onClick={() => toggleActive(ep)} style={iconBtnStyle} title={ep.is_active ? 'Deactivate' : 'Activate'}>
                                        {ep.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button onClick={() => handleEdit(ep)} style={iconBtnStyle} title="Edit">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button onClick={() => handleRotateSecret(ep.id)} style={iconBtnStyle} title="Rotate Secret">
                                        <RefreshCw size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(ep.id)} style={{ ...iconBtnStyle, color: '#EF4444' }} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: 12 }}>
                                <button
                                    onClick={() => fetchDeliveries(ep.id)}
                                    style={deliveryToggleStyle}
                                >
                                    {showDeliveries === ep.id ? 'Hide' : 'Show'} Deliveries ({ep.deliveries_count || 0})
                                </button>
                            </div>

                            {showDeliveries === ep.id && deliveries[ep.id] && (
                                <div style={{ marginTop: 12 }}>
                                    {deliveries[ep.id].length === 0 ? (
                                        <div style={{ fontSize: 13, color: '#94A3B8', padding: 16, textAlign: 'center' }}>
                                            No deliveries yet.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {deliveries[ep.id].map(del => (
                                                <div key={del.id} style={deliveryRowStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                                        {del.status === 'success' ? (
                                                            <CheckCircle2 size={14} color="#10B981" />
                                                        ) : (
                                                            <XCircle size={14} color="#EF4444" />
                                                        )}
                                                        <span style={eventLabelStyle}>{del.event}</span>
                                                        <span style={{ fontSize: 12, color: '#6B7C93' }}>
                                                            Attempts: {del.attempts}
                                                        </span>
                                                        {del.response_code && (
                                                            <span style={{
                                                                fontSize: 12,
                                                                fontWeight: 600,
                                                                color: del.response_code >= 200 && del.response_code < 300 ? '#10B981' : '#EF4444'
                                                            }}>
                                                                HTTP {del.response_code}
                                                            </span>
                                                        )}
                                                        <span style={{ fontSize: 11, color: '#94A3B8' }}>
                                                            {new Date(del.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {del.status === 'failed' && (
                                                        <button onClick={() => handleReplay(del.id)} style={replayBtnStyle}>
                                                            <RotateCw size={12} />
                                                            Replay
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const headerRowStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 24,
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

const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 700, color: '#001C64', marginBottom: 6,
};

const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1px solid #E3E8EF',
    borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box',
};

const eventChipStyle = {
    display: 'inline-flex', alignItems: 'center', padding: '8px 16px',
    borderRadius: 20, border: '1px solid', fontSize: 13, fontWeight: 600,
    transition: 'all 0.2s ease', userSelect: 'none',
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

const endpointCardStyle = {
    background: '#FFF', border: '1px solid #E3E8EF', borderRadius: 16,
    padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const eventBadgeStyle = {
    padding: '4px 10px', background: '#F0F7FF', borderRadius: 12,
    fontSize: 11, fontWeight: 600, color: '#0070E0',
};

const iconBtnStyle = {
    width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#F7F9FC', border: '1px solid #E3E8EF', borderRadius: 10,
    cursor: 'pointer', color: '#6B7C93', transition: 'all 0.2s ease',
};

const deliveryToggleStyle = {
    background: 'none', border: 'none', color: '#0070E0', fontWeight: 600,
    fontSize: 12, cursor: 'pointer', padding: 0,
};

const deliveryRowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', background: '#F8FAFC', borderRadius: 10,
    border: '1px solid #E2E8F0',
};

const eventLabelStyle = {
    fontSize: 12, fontWeight: 600, color: '#1A1F36',
};

const replayBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '6px 12px', background: '#FFF', border: '1px solid #E3E8EF',
    borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#0070E0',
    cursor: 'pointer',
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
