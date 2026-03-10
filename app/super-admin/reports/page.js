'use client';

import { BarChart3, Download, FileText, Globe, Info, Zap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import api from '@/utils/api';

export default function SuperAdminReports() {
    const [exporting, setExporting] = useState(false);

    const handleDownloadReport = async () => {
        setExporting(true);
        try {
            const token = localStorage.getItem('super_admin_token');
            const response = await api.get('/super-admin/export-report', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `nexus_audit_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download report:', err);
            alert('Failed to generate report.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Nexus Analytics</h1>
                    <p style={subtitleStyle}>Global overview and comprehensive system exports</p>
                </div>
            </header>

            <div style={gridStyle}>
                {/* Global Audit Card */}
                <div style={cardStyle}>
                    <div style={iconWrapStyle}>
                        <Globe size={18} color="#fbbf24" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={cardTitleStyle}>Global System Audit</h3>
                        <p style={cardDescStyle}>Comprehensive export of all transactions, active participants, and revenue streams across the platform.</p>
                        <button onClick={handleDownloadReport} style={btnStyle} disabled={exporting}>
                            {exporting ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                    <div style={spinnerStyle} />
                                    <span>Compiling Ledger...</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                    <Download size={14} />
                                    <span>Export Complete CSV</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Performance Analytics Card */}
                <div style={cardStyle}>
                    <div style={iconWrapStyle}>
                        <Zap size={18} color="#6366f1" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={cardTitleStyle}>Flux & Conversion</h3>
                        <p style={cardDescStyle}>Identify bottlenecks and top-performing merchants across all geographic regions.</p>
                        <div style={placeholderBadgeStyle}>Visual Nexus Coming Soon</div>
                    </div>
                </div>
            </div>

            <div style={infoBoxStyle}>
                <ShieldCheck size={14} color="#10b981" />
                <span style={{ color: '#52525b' }}>Analytics processing is performed on secondary replication nodes to ensure live system stability and sub-microsecond latency.</span>
            </div>
        </div>
    );
}

const pageStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' };
const headerStyle = { marginBottom: '8px' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' };
const cardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px'
};

const iconWrapStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    flexShrink: 0
};

const cardTitleStyle = { fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px' };
const cardDescStyle = { fontSize: '11px', color: '#52525b', lineHeight: '1.6', marginBottom: '20px', fontWeight: '700' };

const btnStyle = {
    width: '100%',
    padding: '12px',
    background: '#fbbf24',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontWeight: '900',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const spinnerStyle = {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(0,0,0,0.1)',
    borderTop: '2px solid #000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
};

const placeholderBadgeStyle = {
    textAlign: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.01)',
    borderRadius: '12px',
    color: '#3f3f46',
    fontSize: '10px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid rgba(255, 255, 255, 0.02)'
};

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.01)',
    borderRadius: '16px',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid rgba(255, 255, 255, 0.02)'
};
