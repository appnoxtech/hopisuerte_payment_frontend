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
    History
} from 'lucide-react';

export default function AdminDashboard() {
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
            acc[cur] += Number(p.amount);
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
                                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
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
                                    <tr key={p.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={customerCellWrapper}>
                                                <div style={avatarCircleStyle}>{p.customer_name?.[0] || 'C'}</div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={primaryTextStyle}>{p.customer_name}</div>
                                                    <div style={secondaryTextStyle}>{p.customer_email}</div>
                                                    <div style={secondaryTextStyle}>{p.customer_phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={productBadgeStyle}>{p.product?.name || 'Quick Link'}</span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                            <div style={amountWrapperStyle}>
                                                <span style={currencyStyle}>{p.currency}</span>
                                                <span style={amountStyle}>{Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
        <div style={statCardStyle}>
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
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)'
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
    overflow: 'hidden',
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
    transition: 'background 0.2s'
};

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