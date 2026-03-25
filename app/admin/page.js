'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';
import {
    CheckCircle2,
    DollarSign,
    Receipt,
    Search,
    Calendar,
    ArrowDown,
    ArrowUp,
    FileText,
    History,
    MessageCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminDashboard() {
    const { showToast } = useToast();
    const statusOptions = [
        { label: 'All Statuses', value: '' },
        { label: 'Success', value: 'success' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' }
    ];
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
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
             });
             
             showToast(response.data.message || 'Receipt shared via WhatsApp!', 'success');
         } catch (err) {
             console.error('WhatsApp Sharing failed', err);
             showToast(err.response?.data?.message || 'Failed to share receipt via WhatsApp.', 'error');
         } finally {
             setSharingId(null);
             setActiveWaMenu(null);
         }
     };

    useEffect(() => {
        fetchPayments();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (err) { }
    };

    const fetchPayments = async () => {
        try {
            const response = await api.get('/admin/payments');
            setPayments(response.data);
        } catch (err) {
            console.error('Failed to fetch payments', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    const successfulPayments = payments.filter(p => p.status === 'success');

    const totals = successfulPayments.reduce((acc, p) => {
        const cur = (p.currency || 'USD').toUpperCase();
        if (acc.hasOwnProperty(cur)) {
            acc[cur] += Number(p.total_paid_amount ?? p.amount);
        }
        return acc;
    }, { USD: 0, EUR: 0, XCG: 0 });

    const filteredPayments = payments.filter(p => {
        const matchesCustomer = (p.customer_name?.toLowerCase().includes(filterCustomer.toLowerCase())) ||
            (p.customer_email?.toLowerCase().includes(filterCustomer.toLowerCase()));
        const matchesStatus = filterStatus === '' || p.status === filterStatus;

        let matchesDate = true;
        if (filterDate) {
            const pDate = new Date(p.created_at).toISOString().split('T')[0];
            matchesDate = pDate === filterDate;
        }

        return matchesCustomer && matchesStatus && matchesDate;
    }).sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        if (dateA === dateB) {
            return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
        }
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div style={pageContainerStyle}>
            {/* Dashboard Header */}
            <div style={dashboardHeaderStyle}>
                <div>
                    <h1 style={titleStyle}>{user?.name || ''}'s Dashboard</h1>
                </div>

            </div>

            {/* Performance Metrics */}
            <div style={statsGridStyle}>
                <StatCard
                    title="Payment Successful"
                    value={successfulPayments.length}
                    color="#10B981"
                    icon={<CheckCircle2 size={18} />}
                />
                <StatCard
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>Total Amount</span>
                            <div style={{ width: 100 }}>
                                <CustomDropdown
                                    options={[
                                        { label: 'USD', value: 'USD' },
                                        { label: 'EUR', value: 'EUR' },
                                        { label: 'XCG', value: 'XCG' }
                                    ]}
                                    value={displayCurrency}
                                    onChange={setDisplayCurrency}
                                    showSearch={false}
                                    placeholder="Cur"
                                />
                            </div>
                        </div>
                    }
                    value={totals[displayCurrency].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    unit={displayCurrency === 'USD' ? '$' : (displayCurrency === 'EUR' ? '€' : 'Cg')}
                    color="#001c64"
                    icon={displayCurrency === 'USD' ? <DollarSign size={18} /> : <div style={{ fontWeight: '900', fontSize: '15px' }}>{displayCurrency === 'EUR' ? '€' : 'Cg'}</div>}
                />
            </div>

            {/* Transaction Ledger */}
            <section style={ledgerSectionStyle}>
                <div style={ledgerHeaderStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <History size={14} color="#71717a" />
                        <h2 style={ledgerTitleStyle}>Payments</h2>
                    </div>

                    <div style={filterGroupStyle}>
                        <div style={searchBoxStyle}>
                            <Search style={searchIconStyle} size={14} />
                            <input
                                placeholder="Search..."
                                value={filterCustomer}
                                onChange={(e) => setFilterCustomer(e.target.value)}
                                style={filterInputStyle}
                            />
                        </div>
                        <div style={{ width: 160 }}>
                            <CustomDropdown
                                options={statusOptions}
                                value={filterStatus}
                                onChange={setFilterStatus}
                                placeholder="Status"
                            />
                        </div>
                        {/* <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} size={12} />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                style={dateInputStyle}
                            />
                        </div> */}
                    </div>
                </div>

                <div style={tableContainerStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={tableHeaderStyle}>
                                <th style={{ ...thStyle, paddingLeft: '16px' }}>Customer</th>
                                <th style={thStyle}>Product</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Currency</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Entered</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Fee</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Total Paid</th>
                                <th style={thCenterStyle}>Status</th>
                                <th
                                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                    style={{ ...thStyle, textAlign: 'right', paddingRight: '16px', cursor: 'pointer' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                        Date
                                        {sortOrder === 'desc' ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={emptyStateStyle}>
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((p) => (
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
                                            <div style={customerCellWrapper}>
                                                <div style={avatarCircleStyle}>{p.customer_name?.[0] || 'C'}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={primaryTextStyle}>{p.customer_name}</div>
                                                    <div style={secondaryTextStyle}>{p.customer_email}</div>
                                                    <div style={{ ...secondaryTextStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {p.customer_phone}
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
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
                                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={productBadgeStyle}>{p.product?.name || 'Quick Link'}</span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <span style={currencyStyle}>{p.currency}</span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <div style={amountWrapperStyle}>
                                                <span style={amountStyle}>{Number(p.entered_amount ?? p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <div style={{ ...amountWrapperStyle, justifyContent: 'center' }}>
                                                <span style={amountStyle}>{Number(p.fee_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                {p.fee_percentage && <span style={{ fontSize: '10px', color: '#6B7C93', marginLeft: '4px' }}>({p.fee_percentage}%)</span>}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <div style={amountWrapperStyle}>
                                                <span style={{ ...currencyStyle, color: '#0070E0' }}>{p.currency === 'EUR' ? '€' : (p.currency === 'XCG' ? 'Cg' : '$')}</span>
                                                <span style={{ ...amountStyle, color: '#0070E0' }}>{Number(p.total_paid_amount ?? p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <div style={{
                                                ...statusLevelStyle,
                                                background: p.status === 'success' ? '#ECFDF5' : p.status === 'failed' ? '#FEF2F2' : '#FFFBEB',
                                                color: p.status === 'success' ? '#10B981' : p.status === 'failed' ? '#EF4444' : '#F59E0B',
                                                borderColor: p.status === 'success' ? '#A7F3D0' : p.status === 'failed' ? '#FECACA' : '#FDE68A',
                                            }}>
                                                {p.status}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                            <div style={timestampStyle}>{formatLocalTime(p.created_at)}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatCard({ title, value, unit, color, icon }) {
    return (
        <div 
            style={statCardStyle}
            className="bg-white border border-[#E3E8EF] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:border-[#0070E0] hover:bg-[#F0F7FF]/50 cursor-default"
        >
            <div style={{ ...statIconScope, background: `${color}10`, borderColor: `${color}20`, color }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <div style={statLabelStyle}>{title}</div>
                <div style={statValueStyle}>
                    {value}
                    {unit && <span style={statUnitStyle}>{unit}</span>}
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES DEFINITION
// ──────────────────────────────────────────────

const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeIn 0.4s ease-out'
};

const dashboardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#001c64',
    letterSpacing: '-0.02em'
};

const statusBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    borderRadius: '20px',
    fontSize: '9px',
    fontWeight: '800',
    color: '#10b981',
    textTransform: 'uppercase'
};

const dotStyle = {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    background: '#10b981'
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px'
};

const statCardStyle = {
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
};

const statIconScope = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    background: '#F0F7FF'
};

const statLabelStyle = {
    fontSize: '13px',
    color: '#6B7C93',
    fontWeight: '600'
};

const statValueStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1A1F36',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
};

const statUnitStyle = {
    fontSize: '9px',
    color: '#52525b',
    fontWeight: '800'
};

const ledgerSectionStyle = { marginTop: '4px' };

const ledgerHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    gap: '10px'
};

const ledgerTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1F36'
};

const filterGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
};

const searchBoxStyle = {
    position: 'relative',
    width: '260px',
};

const searchIconStyle = {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#52525b'
};

const filterInputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '12px',
    padding: '12px 12px 12px 32px',
    color: '#1A1F36',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const dateInputStyle = {
    ...filterInputStyle,
    padding: '6px 8px 6px 26px',
    width: '110px'
};

const tableContainerStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '24px',
    // overflow: 'hidden', // Disabled to prevent clipping of absolute menus like WhatsApp sharing
    position: 'relative',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    textAlign: 'left'
};

const tableHeaderStyle = {
    background: '#F8FAFC',
    borderBottom: '1px solid #E3E8EF'
};

const thStyle = {
    padding: '18px 16px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const thCenterStyle = {
    ...thStyle,
    textAlign: 'center'
};

const trStyle = {
    borderBottom: '1px solid #E3E8EF',
    transition: 'background 0.2s',
    cursor: 'default',
};
const trHoverStyle = { background: '#F8FAFC' };

const tdStyle = {
    padding: '16px'
};

const tdCenterStyle = {
    ...tdStyle,
    textAlign: 'center'
};

const customerCellWrapper = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const avatarCircleStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#F0F7FF',
    border: '1px solid #D0E2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0070E0',
    fontWeight: '700',
    fontSize: '14px'
};

const primaryTextStyle = { fontSize: '15px', fontWeight: '700', color: '#1A1F36' };
const secondaryTextStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };

const productBadgeStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    padding: '4px 8px',
    background: '#F1F5F9',
    borderRadius: '6px'
};

const amountWrapperStyle = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: '3px'
};

const currencyStyle = { fontSize: '11px', fontWeight: '600', color: '#64748B' };
const amountStyle = { fontSize: '16px', fontWeight: '700', color: '#1A1F36' };

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    borderRadius: '100px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600'
};

const timestampStyle = {
    fontSize: '14px',
    color: '#1A1F36',
    fontWeight: '500'
};

const emptyStateStyle = {
    padding: '60px',
    textAlign: 'center',
    color: '#3f3f46',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase'
};

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