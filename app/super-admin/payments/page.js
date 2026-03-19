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
    ArrowLeft,
    MessageCircle
} from 'lucide-react';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

import { useToast } from '@/context/ToastContext';

export default function GlobalPayments() {
    const { showToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMerchantId, setSelectedMerchantId] = useState(null);
    const [view, setView] = useState('summary'); // 'summary' or 'detailed'
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCurrency, setDisplayCurrency] = useState('USD');

    const fetchPayments = async (isManual = false) => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/payments', getSuperAdminHeaders());
            setPayments(response.data);
            if (isManual) {
                showToast('Synced Successfully', 'success');
            }
        } catch (err) {
            showToast('Nexus ledger synchronization failed', 'error');
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
            const merchantId = p.product?.user?.id || 'unknown';
            const merchantName = p.product?.user?.name || 'Unknown Merchant';
            const merchantEmail = p.product?.user?.email || '';

            if (!groups[merchantId]) {
                groups[merchantId] = {
                    id: merchantId,
                    name: merchantName,
                    email: merchantEmail,
                    totalByCurrency: {},
                    totalTransactions: 0,
                    payments: []
                };
            }

            const amount = Number(p.total_paid_amount ?? p.amount) || 0;
            const currency = p.currency || 'USD';

            groups[merchantId].totalByCurrency[currency] = (Number(groups[merchantId].totalByCurrency[currency]) || 0) + amount;
            groups[merchantId].totalTransactions += 1;
            groups[merchantId].payments.push(p);
        });
        return Object.values(groups);
    };

    const groupedMerchants = getGroupedData().filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const activeMerchant = groupedMerchants.find(f => f.id === selectedMerchantId);

    if (loading && payments.length === 0) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Total Transactions</h1>
                    <p style={subtitleStyle}>Complete real-time ledger of all merchant activities</p>
                </div>

                <div style={headerActionsStyle}>
                    <div style={viewToggleStyle}>
                        <button
                            onClick={() => { setView('summary'); setSelectedMerchantId(null); }}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'summary' ? '#F0F7FF' : 'transparent',
                                color: view === 'summary' ? '#0070E0' : '#6B7C93',
                            }}
                        >
                            Merchant Summary
                        </button>
                        <button
                            onClick={() => setView('detailed')}
                            style={{
                                ...toggleBtnStyle,
                                background: view === 'detailed' ? '#F0F7FF' : 'transparent',
                                color: view === 'detailed' ? '#0070E0' : '#6B7C93',
                            }}
                        >
                            History
                        </button>
                    </div>
                    <button onClick={() => fetchPayments(true)} style={refreshBtnStyle}>
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                {selectedMerchantId && (
                    <button onClick={() => { setSelectedMerchantId(null); setView('summary'); }} style={backBtnStyle}>
                        <ArrowLeft size={14} />
                        <span>Back to Summary</span>
                    </button>
                )}
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder={view === 'summary' ? "Search merchant..." : "Search..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={countBadgeWrap}>
                    {/* <span>{view === 'summary' ? groupedMerchants.length : (activeMerchant ? activeMerchant.payments.length : payments.length)} Nodes Detected</span> */}
                </div>
            </div>

            <div style={tableContainerStyle}>
                {view === 'summary' ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderStyle}>
                                <th style={{ ...thStyle, paddingLeft: '24px' }}>Merchants</th>
                                <th style={thCenterStyle}>Total Records</th>
                                <th style={thCenterStyle}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center' }}>
                                        <div /> {/* Spacer */}
                                        <span style={{ whiteSpace: 'nowrap' }}>Total Amount</span>
                                        <div style={{ width: 85, marginLeft: 8 }}>
                                            <CustomDropdown
                                                options={[
                                                    { label: 'USD', value: 'USD' },
                                                    { label: 'EUR', value: 'EUR' },
                                                    { label: 'XCG', value: 'XCG' }
                                                ]}
                                                value={displayCurrency}
                                                onChange={setDisplayCurrency}
                                                showSearch={false}
                                                placeholder="CUR"
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedMerchants.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={emptyStateStyle}>No active merchant nodes identified.</td>
                                </tr>
                            ) : (
                                groupedMerchants.map((merchant) => (
                                    <tr key={merchant.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={userCellWrapperStyle}>
                                                <div style={tableAvatarStyle}>{merchant.name?.[0] || 'M'}</div>
                                                <div>
                                                    <div style={userNameTextStyle}>{merchant.name}</div>
                                                    <div style={userEmailTextStyle}>{merchant.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={countBadgeStyle}>
                                                <CreditCard size={10} />
                                                <span>{merchant.totalTransactions} Transactions</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={earningsItemStyle}>
                                                <span style={currencySymbolStyle}>
                                                    {displayCurrency === 'EUR' ? '€' : (displayCurrency === 'XCG' ? 'Cg' : '$')}
                                                </span>
                                                {(merchant.totalByCurrency[displayCurrency] || 0).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                            <button
                                                onClick={() => { setSelectedMerchantId(merchant.id); setView('detailed'); }}
                                                style={historyBtnStyle}
                                            >
                                                <span>Details</span>
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
                                <th style={{ ...thStyle, paddingLeft: '24px' }}>Merchant</th>
                                <th style={thCenterStyle}>Currency</th>
                                <th style={thCenterStyle}>Entered</th>
                                <th style={thCenterStyle}>Fee</th>
                                <th style={thCenterStyle}>Total Paid</th>
                                <th style={thCenterStyle}>Gateway</th>
                                <th style={thCenterStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeMerchant ? activeMerchant.payments : payments).length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={emptyStateStyle}>Zero transactions in current cache.</td>
                                </tr>
                            ) : (
                                (activeMerchant ? activeMerchant.payments : payments).map((p) => (
                                    <tr key={p.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={{ fontSize: '14px', color: '#1a1f36', fontWeight: '600' }}>{p.product?.user?.name || 'Direct'}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7C93', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                Customer: {p.customer_name} ({p.customer_phone})
                                                {p.customer_phone && (
                                                    <a 
                                                        href={`https://wa.me/${p.customer_phone.replace(/\D/g, '')}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ color: '#25D366', display: 'flex', alignItems: 'center' }}
                                                        title="Message on WhatsApp"
                                                    >
                                                        <MessageCircle size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            {p.notes && (
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: '#0070E0', 
                                                    marginTop: '6px', 
                                                    background: '#F0F7FF', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '6px', 
                                                    display: 'inline-block',
                                                    border: '1px solid rgba(0, 112, 224, 0.1)',
                                                    fontWeight: '600'
                                                }}>
                                                    Note: {p.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={amountTextStyle}>{p.currency === 'EUR' ? '€' : (p.currency === 'XCG' ? 'Cg' : '$')}{p.currency}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={amountTextStyle}>{((p.entered_amount ?? p.amount) || 0).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={amountTextStyle}>{(p.fee_amount || 0).toLocaleString()}</span>
                                                {p.fee_percentage && <span style={{ fontSize: '10px', color: '#6B7C93', marginLeft: '4px' }}>({p.fee_percentage}%)</span>}
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={{ ...currencySymbolStyle, color: '#0070E0' }}>
                                                    {p.currency === 'EUR' ? '€' : (p.currency === 'XCG' ? 'Cg' : '$')}
                                                </span>
                                                <span style={{ ...amountTextStyle, color: '#0070E0' }}>{((p.total_paid_amount ?? p.amount) || 0).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={{
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                color: p.stripe_account === 2 ? '#8B5CF6' : '#6B7C93',
                                                background: p.stripe_account === 2 ? '#F5F3FF' : '#F1F5F9',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                display: 'inline-block',
                                                border: '1px solid',
                                                borderColor: p.stripe_account === 2 ? '#DDD6FE' : '#E3E8EF'
                                            }}>
                                                Stripe {p.stripe_account || 1}
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={{
                                                ...statusBadgeStyle,
                                                background: p.status === 'success' ? '#ECFDF5' : p.status === 'failed' ? '#FEF2F2' : '#FFFBEB',
                                                color: p.status === 'success' ? '#10B981' : p.status === 'failed' ? '#EF4444' : '#F59E0B',
                                                borderColor: p.status === 'success' ? '#D1FAE5' : p.status === 'failed' ? '#FEE2E2' : '#FEF3C7'
                                            }}>
                                                <div style={{ ...dotStyle, background: p.status === 'success' ? '#10B981' : p.status === 'failed' ? '#EF4444' : '#F59E0B' }} />
                                                {p.status}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                            <div style={dateTextStyle}>{formatLocalTime(p.created_at)}</div>
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

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' };
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const subtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };
const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '16px' };

const viewToggleStyle = { display: 'flex', background: '#FFFFFF', padding: '4px', borderRadius: '12px', border: '1px solid #E3E8EF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const toggleBtnStyle = { padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' };
const refreshBtnStyle = { width: '36px', height: '36px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E3E8EF', color: '#6B7C93', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' };

const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '4px' };
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid #E3E8EF', padding: '10px 16px', borderRadius: '10px', color: '#0070E0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const searchBoxStyle = { position: 'relative', width: '280px' };
const searchIconStyle = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7C93' };
const filterInputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '10px', padding: '10px 12px 10px 36px', color: '#1A1F36', fontSize: '14px', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const countBadgeWrap = { fontSize: '12px', fontWeight: '600', color: '#6B7C93', marginLeft: 'auto' };

const tableContainerStyle = { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E3E8EF', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' };

const thStyle = { 
    paddingTop: '16px', 
    paddingBottom: '16px', 
    paddingLeft: '16px', 
    paddingRight: '16px', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#6B7C93', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em', 
    textAlign: 'left', 
    borderBottom: '1px solid #E3E8EF' 
};
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid #F7F9FC', transition: 'background 0.2s ease' };
const tdStyle = { 
    paddingTop: '20px', 
    paddingBottom: '20px', 
    paddingLeft: '16px', 
    paddingRight: '16px' 
};
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const userCellWrapperStyle = { display: 'flex', alignItems: 'center', gap: '16px' };
const tableAvatarStyle = { width: '40px', height: '40px', borderRadius: '12px', background: '#F0F7FF', border: '1px solid #E3E8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#0070E0', fontSize: '16px' };
const userNameTextStyle = { fontSize: '15px', fontWeight: '700', color: '#1A1F36' };
const userEmailTextStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };

const amountGroupStyle = { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' };
const earningsItemStyle = { fontSize: '16px', fontWeight: '700', color: '#1A1F36', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' };
const currencySymbolStyle = { color: '#6B7C93', fontSize: '14px', fontWeight: '600' };
const amountTextStyle = { fontSize: '16px', fontWeight: '700', color: '#1A1F36' };

const countBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#F7F9FC', borderRadius: '8px', fontSize: '13px', color: '#4A5568', fontWeight: '600', border: '1px solid #E3E8EF' };
const historyBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '10px', color: '#0070E0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };

const idTextStyle = { fontSize: '9px', fontFamily: 'monospace', color: '#3f3f46', background: 'rgba(255, 255, 255, 0.01)', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' };
const productBadgeStyle = { fontSize: '11px', color: '#52525b', fontWeight: '700' };
const statusBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '20px', border: '1px solid', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };
const dateTextStyle = { fontSize: '11px', color: '#a1a1aa', fontWeight: '800' };

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };
