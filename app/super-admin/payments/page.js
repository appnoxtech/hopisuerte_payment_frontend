'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    RefreshCcw,
    Search,
    ChevronRight,
    User,
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowLeft
} from 'lucide-react';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function GlobalPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
    const [view, setView] = useState('summary'); // 'summary' or 'detailed'
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/payments', getSuperAdminHeaders());
            setPayments(response.data);
        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const getGroupedData = () => {
        const groups = {};
        payments.forEach(p => {
            const freelancerId = p.product?.user?.id || 'unknown';
            const freelancerName = p.product?.user?.name || 'Unknown Merchant';
            const freelancerEmail = p.product?.user?.email || '';

            if (!groups[freelancerId]) {
                groups[freelancerId] = {
                    id: freelancerId,
                    name: freelancerName,
                    email: freelancerEmail,
                    totalByCurrency: {},
                    totalTransactions: 0,
                    payments: []
                };
            }

            const amount = Number(p.amount) || 0;
            const currency = p.currency || 'USD';

            groups[freelancerId].totalByCurrency[currency] = (Number(groups[freelancerId].totalByCurrency[currency]) || 0) + amount;
            groups[freelancerId].totalTransactions += 1;
            groups[freelancerId].payments.push(p);
        });
        return Object.values(groups);
    };

    const groupedFreelancers = getGroupedData().filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const activeFreelancer = groupedFreelancers.find(f => f.id === selectedFreelancerId);

    if (loading && payments.length === 0) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #fbbf24', borderBottom: '2px solid rgba(251, 191, 36, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Capital Flow</h1>
                    <p style={subtitleStyle}>Global audit of real-time transactional movement</p>
                </div>

                <div style={headerActionsStyle}>
                    <div style={viewToggleStyle}>
                        <button
                            onClick={() => { setView('summary'); setSelectedFreelancerId(null); }}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'summary' ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                                color: view === 'summary' ? '#fbbf24' : '#52525b',
                            }}
                        >
                            Global Summary
                        </button>
                        <button
                            onClick={() => setView('detailed')}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'detailed' ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                                color: view === 'detailed' ? '#fbbf24' : '#52525b',
                            }}
                        >
                            Recent Stream
                        </button>
                    </div>
                    <button onClick={fetchPayments} style={refreshBtnStyle}>
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                {selectedFreelancerId && (
                    <button onClick={() => { setSelectedFreelancerId(null); setView('summary'); }} style={backBtnStyle}>
                        <ArrowLeft size={14} />
                        <span>Back to Summary</span>
                    </button>
                )}
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder={view === 'summary' ? "Search merchant..." : "Quick filter stream..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={countBadgeWrap}>
                    <span>{view === 'summary' ? groupedFreelancers.length : (activeFreelancer ? activeFreelancer.payments.length : payments.length)} Nodes Detected</span>
                </div>
            </div>

            <div style={tableContainerStyle}>
                {view === 'summary' ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderStyle}>
                                <th style={{ ...thStyle, paddingLeft: '24px' }}>Merchant Hub</th>
                                <th style={thCenterStyle}>Flux Count</th>
                                <th style={thCenterStyle}>Gross Volume</th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedFreelancers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={emptyStateStyle}>No active merchant nodes identified.</td>
                                </tr>
                            ) : (
                                groupedFreelancers.map((freelancer) => (
                                    <tr key={freelancer.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={userCellWrapperStyle}>
                                                <div style={tableAvatarStyle}>{freelancer.name?.[0] || 'M'}</div>
                                                <div>
                                                    <div style={userNameTextStyle}>{freelancer.name}</div>
                                                    <div style={userEmailTextStyle}>{freelancer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={countBadgeStyle}>
                                                <CreditCard size={10} />
                                                <span>{freelancer.totalTransactions} Movements</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={currencySymbolStyle}>$</span>
                                                <span style={amountTextStyle}>{(freelancer.totalByCurrency['USD'] || 0).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                            <button
                                                onClick={() => { setSelectedFreelancerId(freelancer.id); setView('detailed'); }}
                                                style={historyBtnStyle}
                                            >
                                                <span>Audit History</span>
                                                <ArrowUpRight size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderStyle}>
                                <th style={{ ...thStyle, paddingLeft: '24px' }}>Nexus ID</th>
                                <th style={thStyle}>Target Hub</th>
                                <th style={thStyle}>Asset</th>
                                <th style={thCenterStyle}>Capital</th>
                                <th style={thCenterStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeFreelancer ? activeFreelancer.payments : payments).length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={emptyStateStyle}>Zero transactions in current cache.</td>
                                </tr>
                            ) : (
                                (activeFreelancer ? activeFreelancer.payments : payments).map((p) => (
                                    <tr key={p.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <span style={idTextStyle}>#{p.id.toString().slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={userEmailTextStyle}>{p.product?.user?.name || 'Direct'}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={productBadgeStyle}>{p.product_name || 'System Link'}</span>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={currencySymbolStyle}>{p.currency === 'USD' ? '$' : p.currency}</span>
                                                <span style={amountTextStyle}>{(p.amount || 0).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={{
                                                ...statusBadgeStyle,
                                                background: p.status === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(251, 191, 36, 0.05)',
                                                color: p.status === 'success' ? '#10b981' : '#fbbf24',
                                                borderColor: p.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)'
                                            }}>
                                                <div style={{ ...dotStyle, background: p.status === 'success' ? '#10b981' : '#fbbf24' }} />
                                                {p.status}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                            <div style={dateTextStyle}>{new Date(p.created_at).toLocaleDateString()}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };
const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '12px' };

const viewToggleStyle = { display: 'flex', background: 'rgba(255, 255, 255, 0.01)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)' };
const toggleBtnStyle = { padding: '6px 14px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' };
const refreshBtnStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', color: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '8px' };
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: '8px', color: '#fbbf24', fontSize: '11px', fontWeight: '800', cursor: 'pointer' };
const searchBoxStyle = { position: 'relative', width: '220px' };
const searchIconStyle = { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' };
const filterInputStyle = { width: '100%', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '8px 12px 8px 30px', color: '#fff', fontSize: '12px', outline: 'none' };
const countBadgeWrap = { fontSize: '10px', fontWeight: '800', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 'auto' };

const tableContainerStyle = { background: 'rgba(15, 15, 20, 0.4)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' };

const thStyle = { padding: '16px', fontSize: '9px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.01)', transition: 'background 0.2s ease' };
const tdStyle = { padding: '16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const userCellWrapperStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const tableAvatarStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fbbf24', fontSize: '12px' };
const userNameTextStyle = { fontSize: '13px', fontWeight: '800', color: '#fff' };
const userEmailTextStyle = { fontSize: '11px', color: '#3f3f46', fontWeight: '600' };

const amountGroupStyle = { display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' };
const currencySymbolStyle = { fontSize: '11px', color: '#3f3f46', fontWeight: '700' };
const amountTextStyle = { fontSize: '14px', fontWeight: '900', color: '#fff' };

const countBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', fontSize: '9px', color: '#71717a', fontWeight: '800' };
const historyBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: '800', cursor: 'pointer' };

const idTextStyle = { fontSize: '9px', fontFamily: 'monospace', color: '#3f3f46', background: 'rgba(255, 255, 255, 0.01)', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' };
const productBadgeStyle = { fontSize: '11px', color: '#52525b', fontWeight: '700' };
const statusBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '20px', border: '1px solid', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' };
const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };
const dateTextStyle = { fontSize: '11px', color: '#3f3f46', fontWeight: '800' };

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };
