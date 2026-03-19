'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import {
    Download,
    Globe,
    Zap,
    ShieldCheck,
    Search,
    Calendar,
    Users,
    ChevronDown,
    FileText,
    Check,
    Activity,
    History,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';

import { useToast } from '@/context/ToastContext';

export default function SuperAdminReportsPage() {
    const { showToast } = useToast();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [merchantId, setMerchantId] = useState('');
    const [merchants, setMerchants] = useState([]);
    const [downloadingType, setDownloadingType] = useState(null);
    const [recentPayments, setRecentPayments] = useState([]);
    const [fetchingRecent, setFetchingRecent] = useState(true);

    const years = Array.from({ length: 5 }, (_, i) => {
        const y = (new Date().getFullYear() - i).toString();
        return { label: y, value: y };
    });
    const months = [
        { label: 'Full Year', value: '' },
        { label: 'January', value: '01' },
        { label: 'February', value: '02' },
        { label: 'March', value: '03' },
        { label: 'April', value: '04' },
        { label: 'May', value: '05' },
        { label: 'June', value: '06' },
        { label: 'July', value: '07' },
        { label: 'August', value: '08' },
        { label: 'September', value: '09' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' },
    ];

    useEffect(() => {
        const fetchMerchants = async () => {
            try {
                const response = await api.get('/super-admin/users');
                setMerchants(response.data);
            } catch (error) {
                showToast('Registry sync failed', 'error');
            }
        };
        fetchMerchants();

        const fetchRecent = async () => {
             try {
                 const token = typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : '';
                 const response = await api.get('/super-admin/payments', {
                     headers: { Authorization: `Bearer ${token}` }
                 });
                 setRecentPayments(response.data.slice(0, 10));
             } catch(e) {
                 console.error(e);
             } finally {
                 setFetchingRecent(false);
             }
        };
        fetchRecent();
    }, [showToast]);

    const handleDownload = async (format = 'csv') => {
        setDownloadingType(format);
        showToast('Report downloading...', 'info');
        try {
            const params = new URLSearchParams();
            params.append('format', format);
            if (month) params.append('month', month);
            if (year) params.append('year', year);
            if (merchantId) params.append('merchant_id', merchantId);

            const token = typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : '';
            const response = await api.get(`/super-admin/export-report?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const selectedMerchant = merchants.find(f => f.id.toString() === merchantId);
            const nameSuf = selectedMerchant ? `_${selectedMerchant.name.replace(/\s+/g, '_')}` : '';
            const dateStr = month ? `${month}-${year}` : year;
            const extension = format === 'csv' ? 'csv' : 'pdf';
            link.setAttribute('download', `platform_report${nameSuf}_${dateStr}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            showToast('Report downloaded successfully', 'success');
        } catch (err) {
            showToast('Download failed', 'error');
        } finally {
            setDownloadingType(null);
        }
    };



    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Reports & Insights</h1>
                    <p style={subtitleStyle}>Analyze platform performance and export financial ledgers</p>
                </div>
            </header>

            <div style={gridStyle}>
                {/* Global Audit & Control Card */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}>
                            <Globe size={20} color="#0070E0" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={cardTitleStyle}>Full System Review</h3>
                            <p style={cardDescStyle}>Generate and download filtered transaction records for all platform activities.</p>
                        </div>
                    </div>

                    <div style={formGridStyle}>
                        {/* Merchant Search Dropdown */}
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Select Merchant</label>
                            <CustomDropdown
                                options={[
                                    { label: 'All Merchant Accounts', value: '' },
                                    ...merchants.map(f => ({ label: `${f.name} (${f.email})`, value: f.id.toString() }))
                                ]}
                                value={merchantId}
                                onChange={(val) => setMerchantId(val)}
                                showSearch={true}
                                placeholder="Search IDs..."
                            />
                        </div>

                        {/* Date Parameters */}
                        <div style={rowStyle}>
                            <div style={{ ...fieldStyle, flex: 1 }}>
                                <label style={labelStyle}>Year</label>
                                <CustomDropdown
                                    options={years}
                                    value={year}
                                    onChange={(val) => setYear(val)}
                                    showSearch={false}
                                    placeholder="Select Year"
                                />
                            </div>
                            <div style={{ ...fieldStyle, flex: 1 }}>
                                <label style={labelStyle}>Month (optional)</label>
                                <CustomDropdown
                                    options={months}
                                    value={month}
                                    onChange={(val) => setMonth(val)}
                                    showSearch={false}
                                    placeholder="Select Month"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={footerActionStyle}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => handleDownload('csv')} style={{ ...btnStyle, flex: 1, background: '#F0F7FF', color: '#0070E0', border: '1px solid #0070E0' }} disabled={!!downloadingType}>
                                {downloadingType === 'csv' ? (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        <div style={{ ...spinnerStyle, borderTopColor: '#0070E0', width: 14, height: 14 }} />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                        <FileText size={16} />
                                        <span>Download CSV</span>
                                    </div>
                                )}
                            </button>
                            <button onClick={() => handleDownload('pdf')} style={{ ...btnStyle, flex: 1, background: '#0070E0', color: '#FFF' }} disabled={!!downloadingType}>
                                {downloadingType === 'pdf' ? (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        <div style={{ ...spinnerStyle, borderTopColor: '#FFF', width: 14, height: 14 }} />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                        <Download size={16} />
                                        <span>Export PDF</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}><History size={18} color="#6366f1" /></div>
                        <div>
                            <h3 style={cardTitleStyle}>Recent Transactions</h3>
                            <p style={cardDescStyle}>Snapshot of the latest globally synchronized transactions.</p>
                        </div>
                    </div>

                    <div style={activityListStyle}>
                        {fetchingRecent ? (
                            <div style={loadingWrapStyle}><Loader2 size={24} className="spin" color="#3f3f46" /></div>
                        ) : recentPayments.length === 0 ? (
                            <div style={emptyTextStyle}>No recent activity found.</div>
                        ) : (
                            recentPayments.map((p) => (
                                <div key={p.id} style={activityItemStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        {p.status === 'success' ? <CheckCircle2 size={16} color="#10B981" /> : (p.status === 'failed' ? <XCircle size={16} color="#EF4444" /> : <Clock size={16} color="#F59E0B" />)}
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={primaryTextStyle}>{p.customer_name}</div>
                                            <div style={secondaryTextStyle}>{p.customer_phone}</div>
                                            <div style={secondaryTextStyle}>{formatLocalTime(p.created_at)}</div>
                                        </div>
                                    </div>

                                    <div style={{ ...amountValueStyle, color: '#0070E0' }}><span style={{ fontSize: 11, fontWeight: '700', color: '#0070E0', marginRight: 4 }}>{p.currency}</span>{Number(p.total_paid_amount ?? p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* <div style={infoBoxStyle}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Analytics processing is performed on secondary replication nodes to ensure live system stability and sub-microsecond latency.</span>
            </div> */}
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const pageStyle = { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' };
const headerStyle = { marginBottom: '8px' };
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const subtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '24px' };
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

const cardHeaderStyle = { display: 'flex', alignItems: 'flex-start', gap: '20px' };
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

const cardTitleStyle = { fontSize: '18px', fontWeight: '700', color: '#1A1F36', marginBottom: '4px', fontFamily: "'Outfit', sans-serif" };
const cardDescStyle = { fontSize: '14px', color: '#6B7C93', lineHeight: '1.6', fontWeight: '500' };

const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#4A5568', marginLeft: 4 };

const rowStyle = { display: 'flex', gap: '20px' };

const footerActionStyle = { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' };
const auditInfoStyle = { fontSize: '10px', color: '#3f3f46', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' };

const btnStyle = {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.1)'
};

const placeholderContent = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.01)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px 20px'
};

const placeholderBadgeStyle = {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '100px',
    color: '#3f3f46',
    fontSize: '10px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid rgba(255, 255, 255, 0.2)'
};

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '16px',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#52525b'
};


const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(0,0,0,0.05)',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
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
