'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    borderTop: '2px solid #fbbf24',
                    borderBottom: '2px solid #fbbf24',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    const successfulPayments = payments.filter(p => p.status === 'success');
    const totalVolume = successfulPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const avgTicket = successfulPayments.length > 0 ? totalVolume / successfulPayments.length : 0;

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
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div style={pageContainerStyle}>
            {/* Dashboard Header */}
            <div style={dashboardHeaderStyle}>
                <div>
                    <h1 style={titleStyle}>{user?.name || 'Admin'}'s Dashboard</h1>
                </div>
                
            </div>

            {/* Performance Metrics */}
            <div style={statsGridStyle}>
                <StatCard
                    title="Successful"
                    value={successfulPayments.length}
                    color="#10b981"
                    icon={<CheckCircle2 size={16} />}
                />
                <StatCard
                    title="Volume"
                    value={totalVolume.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    unit="USD"
                    color="#fbbf24"
                    icon={<DollarSign size={16} />}
                />
                <StatCard
                    title="Avg Receipt"
                    value={avgTicket.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    unit="USD"
                    color="#6366f1"
                    icon={<Receipt size={16} />}
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
                        <div style={{ width: 110 }}>
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
                                        <td style={{ ...tdStyle, paddingLeft: '16px' }}>
                                            <div style={customerCellWrapper}>
                                                <div style={avatarCircleStyle}>{p.customer_name?.[0] || 'C'}</div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={primaryTextStyle}>{p.customer_name}</div>
                                                    <div style={secondaryTextStyle}>{p.customer_email}</div>
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
                                                background: p.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : p.status === 'failed' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(251, 191, 36, 0.08)',
                                                color: p.status === 'success' ? '#10b981' : p.status === 'failed' ? '#f43f5e' : '#fbbf24',
                                                borderColor: p.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : p.status === 'failed' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                            }}>
                                                {p.status}
                                            </div>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '16px' }}>
                                            <div style={timestampStyle}>{new Date(p.created_at).toLocaleDateString()}</div>
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
                <p style={statLabelStyle}>{title}</p>
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
    fontSize: '20px',
    fontWeight: '900',
    color: '#fff',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px'
};

const statCardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden'
};

const statIconScope = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid'
};

const statLabelStyle = {
    fontSize: '9px',
    color: '#71717a',
    fontWeight: '700',
    textTransform: 'uppercase'
};

const statValueStyle = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#fff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px'
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
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff'
};

const filterGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const searchBoxStyle = {
    position: 'relative',
    width: '140px',
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
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '10px 8px 10px 26px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
};

const dateInputStyle = {
    ...filterInputStyle,
    padding: '6px 8px 6px 26px',
    width: '110px'
};

const tableContainerStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const tableHeaderStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
};

const thStyle = {
    padding: '10px 12px',
    fontSize: '9px',
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase'
};

const thCenterStyle = {
    ...thStyle,
    textAlign: 'center'
};

const trStyle = {
    borderBottom: '1px solid rgba(255, 255, 255, 0.01)'
};

const tdStyle = {
    padding: '10px 12px'
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
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: '10px'
};

const primaryTextStyle = { fontSize: '12px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const secondaryTextStyle = { fontSize: '9px', color: '#52525b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

const productBadgeStyle = {
    fontSize: '9px',
    fontWeight: '700',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    padding: '2px 5px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '4px'
};

const amountWrapperStyle = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: '3px'
};

const currencyStyle = { fontSize: '9px', fontWeight: '800', color: '#52525b' };
const amountStyle = { fontSize: '13px', fontWeight: '900', color: '#fff' };

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '8px',
    fontWeight: '800',
    textTransform: 'uppercase'
};

const timestampStyle = {
    fontSize: '10px',
    color: '#52525b',
    fontWeight: '600'
};

const emptyStateStyle = {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#52525b',
    fontSize: '11px'
};