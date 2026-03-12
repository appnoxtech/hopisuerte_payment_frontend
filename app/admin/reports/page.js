'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import {
    BarChart3,
    Download,
    FileText,
    Info,
    Calendar,
    Filter,
    Loader2,
    History,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';

export default function ReportsPage() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [fetching, setFetching] = useState(true);

    const months = [
        { label: 'All Months', value: '' },
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => ({
        label: (currentYear - i).toString(),
        value: (currentYear - i).toString()
    }));

    useEffect(() => {
        fetchRecentActivity();
    }, []);

    const fetchRecentActivity = async () => {
        try {
            const response = await api.get('/admin/payments');
            setPayments(response.data.slice(0, 10)); // Just 10 recent
        } catch (err) {
            console.error('Failed to fetch activity', err);
        } finally {
            setFetching(false);
        }
    };

    const handleDownload = async (format) => {
        setLoading(true);
        try {
            const response = await api.get('/admin/export-report', {
                params: { format, month, year },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const dateLabel = month ? months.find(m => m.value === month)?.label : 'All_Time';
            link.setAttribute('download', `sales_report_${dateLabel}_${year}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Operational Intelligence</h1>
                    <p style={subtitleStyle}>Export sales data and merchant performance metrics</p>
                </div>
            </header>

            <div style={mainGridStyle}>
                {/* Export Controls */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}><Filter size={18} color="#fbbf24" /></div>
                        <div>
                            <h3 style={cardTitleStyle}>Report Generation</h3>
                            <p style={cardDescStyle}>Configure reporting parameters for your data export.</p>
                        </div>
                    </div>

                    <div style={controlsGridStyle}>
                        <div style={inputScopeStyle}>
                            <label style={labelStyle}>Month</label>
                            <CustomDropdown
                                options={months}
                                value={month}
                                onChange={setMonth}
                                placeholder="All Time"
                            />
                        </div>
                        <div style={inputScopeStyle}>
                            <label style={labelStyle}>Year</label>
                            <CustomDropdown
                                options={years}
                                value={year}
                                onChange={setYear}
                            />
                        </div>
                    </div>

                    <div style={btnGroupStyle}>
                        <button
                            onClick={() => handleDownload('csv')}
                            style={{ ...btnStyle, background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={16} className="spin" /> : <FileText size={16} />}
                            Download CSV
                        </button>
                        <button
                            onClick={() => handleDownload('pdf')}
                            style={{ ...btnStyle, background: '#fbbf24', color: '#000' }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Recent Activity Mini-Feed */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}><History size={18} color="#6366f1" /></div>
                        <div>
                            <h3 style={cardTitleStyle}>Recent Transactions</h3>
                            <p style={cardDescStyle}>Snapshot of the latest synchronized transactions.</p>
                        </div>
                    </div>

                    <div style={activityListStyle}>
                        {fetching ? (
                            <div style={loadingWrapStyle}><Loader2 size={24} className="spin" color="#3f3f46" /></div>
                        ) : payments.length === 0 ? (
                            <div style={emptyTextStyle}>No recent activity found.</div>
                        ) : (
                            payments.map((p) => (
                                <div key={p.id} style={activityItemStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {p.status === 'success' ? <CheckCircle2 size={14} color="#10b981" /> : (p.status === 'failed' ? <XCircle size={14} color="#f43f5e" /> : <Clock size={14} color="#fbbf24" />)}
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={primaryTextStyle}>{p.customer_name}</div>
                                            <div style={secondaryTextStyle}>{formatLocalTime(p.created_at)}</div>
                                        </div>
                                    </div>
                                    <div style={amountValueStyle}><span style={{ fontSize: 9, fontWeight: '800', color: '#52525b' }}>{p.currency}</span>{p.amount} </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div style={infoBoxStyle}>
                <Info size={14} color="#71717a" />
                <span>Reports now include all transactions (Success, Pending, and Failed) for complete financial auditing.</span>
            </div>
        </div>
    );
}

const pageStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease' };
const headerStyle = { marginBottom: '8px' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const mainGridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' };

const cardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(32px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const cardHeaderStyle = { display: 'flex', gap: '16px', alignItems: 'center' };
const iconWrapStyle = {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    flexShrink: 0
};

const cardTitleStyle = { fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0 };
const cardDescStyle = { fontSize: '11px', color: '#52525b', margin: '4px 0 0', fontWeight: '800' };

const controlsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const inputScopeStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' };

const btnGroupStyle = { display: 'flex', gap: '12px' };
const btnStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: '900',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const activityListStyle = { display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' };
const activityItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)'
};

const primaryTextStyle = { fontSize: '14px', fontWeight: '800', color: '#fff' };
const secondaryTextStyle = { fontSize: '12px', color: '#7f7f88ff', fontWeight: '600' };
const amountValueStyle = { fontSize: '14px', fontWeight: '900', color: '#fff' };

const loadingWrapStyle = { padding: '40px', display: 'flex', justifyContent: 'center' };
const emptyTextStyle = { padding: '40px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '12px',
    color: '#52525b',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.2)'
};
