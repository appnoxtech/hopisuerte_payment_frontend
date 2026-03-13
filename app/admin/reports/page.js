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
    const [downloadingType, setDownloadingType] = useState(null);
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
        setDownloadingType(format);
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
            setDownloadingType(null);
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
                        <div style={iconWrapStyle}><Filter size={20} color="#0070E0" /></div>
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
                            style={{ ...btnStyle, background: '#F0F7FF', color: '#0070E0', border: '1px solid #0070E0' }}
                            disabled={!!downloadingType}
                        >
                            {downloadingType === 'csv' ? <Loader2 size={18} className="spin" /> : <FileText size={18} />}
                            Download CSV
                        </button>
                        <button
                            onClick={() => handleDownload('pdf')}
                            style={{ ...btnStyle, background: '#0070E0', color: '#FFF' }}
                            disabled={!!downloadingType}
                        >
                            {downloadingType === 'pdf' ? <Loader2 size={18} className="spin" /> : <Download size={18} />}
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        {p.status === 'success' ? <CheckCircle2 size={16} color="#10B981" /> : (p.status === 'failed' ? <XCircle size={16} color="#EF4444" /> : <Clock size={16} color="#F59E0B" />)}
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={primaryTextStyle}>{p.customer_name}</div>
                                            <div style={secondaryTextStyle}>{formatLocalTime(p.created_at)}</div>
                                        </div>
                                    </div>
                                    <div style={amountValueStyle}><span style={{ fontSize: 11, fontWeight: '700', color: '#6B7C93', marginRight: 4 }}>{p.currency}</span>{p.amount} </div>
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
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001c64', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };

const mainGridStyle = { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' };

const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '32px',
    border: '1px solid #E3E8EF',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)'
};

const cardHeaderStyle = { display: 'flex', gap: '20px', alignItems: 'center' };
const iconWrapStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: '#F0F7FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #E3E8EF',
    flexShrink: 0
};

const cardTitleStyle = { fontSize: '18px', fontWeight: '700', color: '#1A1F36', margin: 0 };
const cardDescStyle = { fontSize: '14px', color: '#6B7C93', margin: '4px 0 0', fontWeight: '500' };

const controlsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const inputScopeStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#4A5568' };

const btnGroupStyle = { display: 'flex', gap: '12px' };
const btnStyle = {
    flex: 1,
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.1)'
};

const activityListStyle = { display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' };
const activityItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '1px solid #E3E8EF',
    transition: 'all 0.2s'
};

const primaryTextStyle = { fontSize: '15px', fontWeight: '700', color: '#1A1F36' };
const secondaryTextStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };
const amountValueStyle = { fontSize: '16px', fontWeight: '700', color: '#1A1F36' };

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
