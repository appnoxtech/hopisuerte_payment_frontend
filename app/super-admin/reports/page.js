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
    Activity
} from 'lucide-react';
import CustomDropdown from '@/components/CustomDropdown';

import { useToast } from '@/context/ToastContext';

export default function SuperAdminReportsPage() {
    const { showToast } = useToast();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [freelancerId, setFreelancerId] = useState('');
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(false);

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
        const fetchFreelancers = async () => {
            try {
                const response = await api.get('/super-admin/users');
                setFreelancers(response.data);
            } catch (error) {
                showToast('Registry sync failed', 'error');
            }
        };
        fetchFreelancers();
    }, [showToast]);

    const handleDownload = async (format = 'csv') => {
        setLoading(true);
        showToast('Compiling platform ledger...', 'info');
        try {
            const params = new URLSearchParams();
            params.append('format', format);
            if (month) params.append('month', month);
            if (year) params.append('year', year);
            if (freelancerId) params.append('freelancer_id', freelancerId);

            const token = typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : '';
            const response = await api.get(`/super-admin/export-report?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const selectedFreelancer = freelancers.find(f => f.id.toString() === freelancerId);
            const nameSuf = selectedFreelancer ? `_${selectedFreelancer.name.replace(/\s+/g, '_')}` : '';
            const dateStr = month ? `${month}-${year}` : year;
            const extension = format === 'csv' ? 'csv' : 'pdf';
            link.setAttribute('download', `platform_report${nameSuf}_${dateStr}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            showToast('Audit report extracted successfully', 'success');
        } catch (err) {
            showToast('Extraction sequence failed', 'error');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Reports and Insights</h1>
                    {/* <p style={subtitleStyle}>Global intelligence and parameter-based ledger exports</p> */}
                </div>
            </header>

            <div style={gridStyle}>
                {/* Global Audit & Control Card */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}>
                            <Globe size={18} color="#fbbf24" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={cardTitleStyle}>Full System Review</h3>
                            <p style={cardDescStyle}>Download filtered transaction records.</p>
                        </div>
                    </div>

                    <div style={formGridStyle}>
                        {/* Merchant Search Dropdown */}
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Select Freelancer</label>
                            <CustomDropdown
                                options={[
                                    { label: 'All Freelancer Accounts', value: '' },
                                    ...freelancers.map(f => ({ label: `${f.name} (${f.email})`, value: f.id.toString() }))
                                ]}
                                value={freelancerId}
                                onChange={(val) => setFreelancerId(val)}
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
                        {/* <p style={auditInfoStyle}>
                            {freelancerId ? `Auditing Hub: ${freelancers.find(f => f.id.toString() === freelancerId)?.name}` : 'Auditing Platform-Wide Intelligence'}
                            {month ? ` • ${months.find(m => m.value === month)?.label} ${year}` : ` • Cycle ${year}`}
                        </p> */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => handleDownload('csv')} style={{ ...btnStyle, flex: 1, background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)' }} disabled={loading}>
                                {loading ? (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        <div style={{ ...spinnerStyle, borderTopColor: '#fbbf24', borderBottomColor: 'transparent', width: 14, height: 14 }} />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                        <FileText size={14} />
                                        <span>Download CSV</span>
                                    </div>
                                )}
                            </button>
                            <button onClick={() => handleDownload('pdf')} style={{ ...btnStyle, flex: 1 }} disabled={loading}>
                                {loading ? (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        <div style={{ ...spinnerStyle, borderTopColor: '#000', borderBottomColor: 'transparent', width: 14, height: 14 }} />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                                        <Download size={14} />
                                        <span>Export PDF</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Flux & Conversion (Placeholder) */}
                {/* <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={iconWrapStyle}>
                            <Zap size={18} color="#6366f1" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={cardTitleStyle}>Flux & Conversion</h3>
                            <p style={cardDescStyle}>Identify bottlenecks and top-performing merchants across all regions.</p>
                        </div>
                    </div>

                    <div style={placeholderContent}>
                        <Activity size={32} color="rgba(255,255,255,0.03)" strokeWidth={1} />
                        <div style={placeholderBadgeStyle}>Visual Nexus Implementation Pending</div>
                        <p style={{ fontSize: 11, color: '#3f3f46', textAlign: 'center', maxWidth: '200px' }}>Real-time graph analytics for capital velocity are currently under sync.</p>
                    </div>
                </div> */}
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

const pageStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' };
const headerStyle = { marginBottom: '8px' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' };
const cardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const cardHeaderStyle = { display: 'flex', alignItems: 'flex-start', gap: '16px' };
const iconWrapStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    flexShrink: 0
};

const cardTitleStyle = { fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '2px' };
const cardDescStyle = { fontSize: '11px', color: '#52525b', lineHeight: '1.5', fontWeight: '800' };

const formGridStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 };

const rowStyle = { display: 'flex', gap: '16px' };

const footerActionStyle = { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' };
const auditInfoStyle = { fontSize: '10px', color: '#3f3f46', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' };

const btnStyle = {
    width: '100%',
    padding: '14px',
    background: '#fbbf24',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontWeight: '900',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
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
    border: '1px solid rgba(255, 255, 255, 0.02)',
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
    border: '1px solid rgba(255,255,255,0.02)'
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
    border: '1px solid rgba(255,255,255,0.02)',
    color: '#52525b'
};

const spinnerStyle = {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(0,0,0,0.1)',
    borderTop: '2px solid #000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
};
