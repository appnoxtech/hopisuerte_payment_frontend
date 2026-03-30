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
    MessageCircle,
    Receipt,
    FileText,
    Edit2
} from 'lucide-react';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

import { useToast } from '@/context/ToastContext';

const AssignmentField = ({ payment, onAssign }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(payment.assigned_admin || '');

    useEffect(() => {
        setValue(payment.assigned_admin || '');
    }, [payment.assigned_admin]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== (payment.assigned_admin || '')) {
            onAssign(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={assignmentInputStyle}
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            style={assignmentDisplayWrapStyle}
        >
            {payment.assigned_admin ? (
                <div style={assigneeBadgeStyle}>
                    <span>{payment.assigned_admin}</span>
                    <Edit2 size={10} style={{ marginLeft: '4px', opacity: 0.6 }} />
                </div>
            ) : (
                <span style={addInitialsStyle}>+ Add note</span>
            )}
        </div>
    );
};

export default function GlobalPayments() {
    const { showToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMerchantId, setSelectedMerchantId] = useState(null);
    const [view, setView] = useState('summary'); // 'summary' or 'detailed'
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCurrency, setDisplayCurrency] = useState('USD');
    const [activeWaMenu, setActiveWaMenu] = useState(null);
    const [sharingId, setSharingId] = useState(null);

    const handleDownloadReceipt = (p) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/payments/receipt-download?payment_id=${p.stripe_payment_intent_id}`;
        window.open(url, '_blank');
    };

    const handleShareReceipt = async (p) => {
        setSharingId(p.id);
        try {
            const response = await api.post('/payments/share-whatsapp', {
                payment_id: p.stripe_payment_intent_id
            }, getSuperAdminHeaders());

            showToast(response.data.message || 'Receipt shared via WhatsApp!', 'success');
        } catch (err) {
            console.error('WhatsApp Sharing failed', err);
            showToast(err.response?.data?.message || 'Failed to share receipt via WhatsApp.', 'error');
        } finally {
            setSharingId(null);
            setActiveWaMenu(null);
        }
    };

    const handleAssignPayment = async (paymentId, adminName) => {
        try {
            const response = await api.post(`/super-admin/payments/${paymentId}/assign`, {
                assigned_admin: adminName
            }, getSuperAdminHeaders());

            setPayments(prev => prev.map(p => p.id === paymentId ? response.data.payment : p));
            showToast(response.data.message || 'Transaction assigned!', 'success');
        } catch (err) {
            console.error('Assignment failed', err);
            showToast('Failed to assign transaction.', 'error');
        }
    };

    const fetchPayments = async (isManual = false) => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/payments', getSuperAdminHeaders());
            setPayments(response.data);
            if (isManual) {
                showToast('Synced Successfully', 'success');
            }
        } catch (err) {
            showToast('Synchronization failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();

        // Real-time polling (every 30 seconds)
        const interval = setInterval(() => {
            fetchPayments();
        }, 30000);

        return () => clearInterval(interval);
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
                    <button
                        onClick={() => fetchPayments(true)}
                        style={refreshBtnStyle}
                        onMouseEnter={refreshBtnHoverStyle}
                        onMouseLeave={refreshBtnLeaveStyle}
                    >
                        <RefreshCcw size={14} />
                    </button>
                </div>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                {selectedMerchantId && (
                    <button
                        onClick={() => { setSelectedMerchantId(null); setView('summary'); }}
                        style={backBtnStyle}
                        className="transition-all duration-200 hover:bg-[#F0F7FF] hover:border-[#0070E0] hover:shadow-md active:scale-95"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Summary</span>
                    </button>
                )}
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder={view === 'summary' ? "Search Merchant..." : "Search..."}
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
                                                className="transition-all duration-200 hover:bg-[#F0F7FF] hover:border-[#0070E0] hover:shadow-md active:scale-95"
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
                                <th style={thCenterStyle}>Handler Note</th>
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
                                    <tr
                                        key={p.id}
                                        style={{
                                            ...trStyle,
                                            position: activeWaMenu === p.id ? 'relative' : 'static',
                                            zIndex: activeWaMenu === p.id ? 50 : 1
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={{ fontSize: '14px', color: '#1a1f36', fontWeight: '600' }}>{p.product?.user?.name || 'Direct'}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7C93', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                Customer: {p.customer_name} ({p.customer_phone})
                                                {p.customer_phone && (
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveWaMenu(activeWaMenu === p.id ? null : p.id)
                                                            }}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                                cursor: 'pointer',
                                                                color: '#25D366',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                transition: 'transform 0.2s ease-in-out'
                                                            }}
                                                            title="WhatsApp Receipt Sharing"
                                                            onMouseEnter={(e) => e.target.closest('button').style.transform = 'scale(1.1)'}
                                                            onMouseLeave={(e) => e.target.closest('button').style.transform = 'scale(1)'}
                                                        >
                                                            <MessageCircle size={15} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDownloadReceipt(p)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                                cursor: 'pointer',
                                                                color: '#6B7C93',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                transition: 'transform 0.2s ease-in-out'
                                                            }}
                                                            title="Download Receipt PDF"
                                                            onMouseEnter={(e) => e.target.closest('button').style.transform = 'scale(1.1)'}
                                                            onMouseLeave={(e) => e.target.closest('button').style.transform = 'scale(1)'}
                                                        >
                                                            <FileText size={15} />
                                                        </button>

                                                        {activeWaMenu === p.id && (
                                                            <div style={waMenuStyle} className="transition-all duration-300 hover:shadow-2xl hover:border-blue-500/30">
                                                                <a
                                                                    href={typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                                                                        ? `https://wa.me/${p.customer_phone.replace(/\D/g, '')}`
                                                                        : `https://web.whatsapp.com/send?phone=${p.customer_phone.replace(/\D/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F7FF'; e.currentTarget.style.color = '#0070E0'; }}
                                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1A1F36'; }}
                                                                    style={waMenuItemStyle}
                                                                >
                                                                    <MessageCircle size={14} />
                                                                    <span>Chat on WhatsApp</span>
                                                                </a>
                                                                {/* Temporarily disabled: Twilio WhatsApp PDF Sharing */}
                                                                {/* 
                                                                <button
                                                                    onClick={() => handleShareReceipt(p)}
                                                                    disabled={sharingId === p.id}
                                                                    style={{ ...waMenuItemStyle, border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}
                                                                >
                                                                    <Receipt size={14} />
                                                                    <span>{sharingId === p.id ? 'Attaching PDF...' : 'Share PDF Receipt'}</span>
                                                                </button>
                                                                */}
                                                            </div>
                                                        )}
                                                    </div>
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
                                            <AssignmentField
                                                payment={p}
                                                onAssign={(val) => handleAssignPayment(p.id, val)}
                                            />
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={amountGroupStyle}>
                                                <span style={amountTextStyle}>{((p.entered_amount ?? p.amount) || 0).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={{ ...amountGroupStyle, flexDirection: 'column', gap: '2px' }}>
                                                <span style={amountTextStyle}>{(p.fee_amount || 0).toLocaleString()}</span>
                                                {p.fee_percentage && <span style={{ fontSize: '10px', color: '#6B7C93' }}>({p.fee_percentage}%)</span>}
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
const refreshBtnHoverStyle = (e) => { e.currentTarget.style.borderColor = '#0070E0'; e.currentTarget.style.color = '#0070E0'; e.currentTarget.style.background = '#F0F7FF'; };
const refreshBtnLeaveStyle = (e) => { e.currentTarget.style.borderColor = '#E3E8EF'; e.currentTarget.style.color = '#6B7C93'; e.currentTarget.style.background = '#FFFFFF'; };


const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '4px' };
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1px solid #E3E8EF', padding: '10px 16px', borderRadius: '10px', color: '#0070E0', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const searchBoxStyle = { position: 'relative', width: '280px' };
const searchIconStyle = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7C93' };
const filterInputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '10px', padding: '10px 12px 10px 36px', color: '#1A1F36', fontSize: '14px', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const countBadgeWrap = { fontSize: '12px', fontWeight: '600', color: '#6B7C93', marginLeft: 'auto' };

const tableContainerStyle = { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E3E8EF', /* overflow: 'hidden', */ position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
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
const btnGlowHoverStyle = (e) => { e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0, 112, 224, 0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = '#0070E0'; };
const btnGlowLeaveStyle = (e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E3E8EF'; };


const idTextStyle = { fontSize: '9px', fontFamily: 'monospace', color: '#3f3f46', background: 'rgba(255, 255, 255, 0.01)', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' };
const productBadgeStyle = { fontSize: '11px', color: '#52525b', fontWeight: '700' };
const statusBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '20px', border: '1px solid', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };
const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };
const dateTextStyle = { fontSize: '11px', color: '#a1a1aa', fontWeight: '800' };

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const waMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: 10,
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '12px',
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    boxShadow: '0 8px 32px rgba(0, 20, 100, 0.12)',
    minWidth: '180px',
    marginTop: '6px'
};

const waMenuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1A1F36',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
};

const assignmentInputStyle = {
    width: '100px',
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '6px',
    border: '1px solid #0070E0',
    outline: 'none',
    textAlign: 'center',
    background: '#F0F7FF'
};

const assignmentDisplayWrapStyle = {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '30px'
};

const assigneeBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#F0F7FF',
    color: '#0070E0',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    border: '1px solid rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s'
};

const addInitialsStyle = {
    fontSize: '11px',
    color: '#6B7C93',
    fontWeight: '600',
    background: '#F8FAFC',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px dashed #E3E8EF'
};
