'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    RefreshCcw,
    Search,
    ChevronRight,
    User,
    History,
    DollarSign,
    CheckCircle2,
    Clock,
    ShieldCheck,
    CreditCard
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
            const freelancerName = p.product?.user?.name || 'Unknown Freelancer';
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
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", borderTop: "2px solid #fbbf24", borderBottom: "2px solid #fbbf24", animation: "spin 1s linear infinite" }} />
            </div>
        );
    }

    return (
        <div style={pageContainerStyle}>
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Payment Monitoring</h1>
                    <p style={subtitleStyle}>Overview of all transactions across the platform</p>
                </div>

                <div style={headerActionsStyle}>
                    <div style={viewToggleStyle}>
                        <button
                            onClick={() => { setView('summary'); setSelectedFreelancerId(null); }}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'summary' ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                                color: view === 'summary' ? '#fbbf24' : '#71717a',
                                border: `1px solid ${view === 'summary' ? 'rgba(251, 191, 36, 0.2)' : 'transparent'}`
                            }}
                        >
                            Global Summary
                        </button>
                        <button
                            onClick={() => setView('detailed')}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'detailed' ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                                color: view === 'detailed' ? '#fbbf24' : '#71717a',
                                border: `1px solid ${view === 'detailed' ? 'rgba(251, 191, 36, 0.2)' : 'transparent'}`
                            }}
                        >
                            Recent Transactions
                        </button>
                    </div>
                    <button onClick={fetchPayments} style={refreshBtnStyle} title="Reload Data">
                        <RefreshCcw size={18} />
                    </button>
                </div>
            </header>

            {/* Search Bar */}
            <section style={searchContainerStyle}>
                <div style={searchIconStyle}>
                    <Search size={18} color="#52525b" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={searchInputStyle}
                />
            </section>

            <div style={tableContainerStyle}>
                {view === 'summary' ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderRowStyle}>
                                <th style={{ ...thStyle, paddingLeft: '32px' }}>User Profile</th>
                                <th style={thCenterStyle}>Total Payments</th>
                                <th style={thCenterStyle}>Total Volume</th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '32px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedFreelancers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={emptyStateStyle}>No active users found.</td>
                                </tr>
                            ) : (
                                groupedFreelancers.map((freelancer) => (
                                    <tr key={freelancer.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '32px' }}>
                                            <div style={userCellWrapperStyle}>
                                                <div style={tableAvatarStyle}>{freelancer.name[0]}</div>
                                                <div>
                                                    <div style={userNameTextStyle}>{freelancer.name}</div>
                                                    <div style={userEmailTextStyle}>{freelancer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={countBadgeStyle}>
                                                <CreditCard size={12} />
                                                <span>{freelancer.totalTransactions} Payments</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <DollarSign size={14} color="#71717a" />
                                                <span style={amountTextStyle}>{(freelancer.totalByCurrency['USD'] || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '32px' }}>
                                            <button
                                                onClick={() => { setSelectedFreelancerId(freelancer.id); setView('detailed'); }}
                                                style={historyBtnStyle}
                                            >
                                                <span>View History</span>
                                                <ChevronRight size={14} />
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
                            <tr style={tableHeaderRowStyle}>
                                <th style={{ ...thStyle, paddingLeft: '32px' }}>ID</th>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Product</th>
                                <th style={thCenterStyle}>Amount</th>
                                <th style={thCenterStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '32px' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={emptyStateStyle}>No transactions recorded.</td>
                                </tr>
                            ) : (
                                (activeFreelancer ? activeFreelancer.payments : payments).map((p) => (
                                    <tr key={p.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '32px' }}>
                                            <span style={idTextStyle}>#{p.id.toString().slice(-6)}</span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={userEmailTextStyle}>{p.user_email || 'System'}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={productBadgeStyle}>{p.product_name || 'Direct Payment'}</span>
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
                                                background: p.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(251, 191, 36, 0.08)',
                                                color: p.status === 'success' ? '#10b981' : '#fbbf24',
                                                borderColor: p.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)'
                                            }}>
                                                <div style={{ ...dotStyle, background: p.status === 'success' ? '#10b981' : '#fbbf24' }} />
                                                {p.status}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '32px' }}>
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

const pageContainerStyle = {
    animation: 'fadeIn 0.5s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 0'
};

const headerWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
};

const titleStyle = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: '4px'
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#71717a',
    fontWeight: '500'
};

const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
};

const viewToggleStyle = {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)'
};

const toggleBtnStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid transparent',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const refreshBtnStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#71717a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const searchContainerStyle = {
    position: 'relative',
    maxWidth: '400px'
};

const searchIconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)'
};

const searchInputStyle = {
    width: '100%',
    padding: '12px 16px 12px 48px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const tableContainerStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '24px',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const tableHeaderRowStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
};

const thStyle = {
    padding: '20px 16px',
    fontSize: '10px',
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const thCenterStyle = { ...thStyle, textAlign: 'center' };

const trStyle = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.01)',
    transition: 'background 0.2s ease'
};

const tdStyle = { padding: '24px 16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const userCellWrapperStyle = { display: 'flex', alignItems: 'center', gap: '16px' };

const tableAvatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: '#fbbf24'
};

const userNameTextStyle = { fontSize: '14px', fontWeight: '800', color: '#fff' };
const userEmailTextStyle = { fontSize: '12px', color: '#52525b', fontWeight: '500' };

const amountGroupStyle = { display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' };
const currencySymbolStyle = { fontSize: '12px', color: '#52525b', fontWeight: '700' };
const amountTextStyle = { fontSize: '16px', fontWeight: '900', color: '#fff' };

const countBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 12px',
    background: 'rgba(59, 130, 246, 0.06)',
    borderRadius: '8px',
    fontSize: '11px',
    color: '#3b82f6',
    fontWeight: '800'
};

const historyBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const idTextStyle = {
    fontSize: '10px',
    fontFamily: 'monospace',
    color: '#52525b',
    background: 'rgba(255,255,255,0.02)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: '700'
};

const productBadgeStyle = { fontSize: '12px', color: '#a1a1aa', fontWeight: '700' };

const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };
const dateTextStyle = { fontSize: '12px', color: '#52525b', fontWeight: '700' };

const emptyStateStyle = { padding: '100px 40px', textAlign: 'center', color: '#52525b', fontSize: '14px', fontWeight: '600' };
