'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { Download, FileText, Calendar, Filter, Users, DollarSign, Activity } from 'lucide-react';

export default function SuperAdminReportsPage() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [loading, setLoading] = useState(false);

    const handleDownload = async (format) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('format', format);
            if (month) params.append('month', month);
            if (year) params.append('year', year);

            const response = await api.get(`/super-admin/export-report?${params.toString()}`, {
                responseType: 'blob'
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const dateStr = month ? `${month}-${year}` : year;
            const extension = format === 'csv' ? 'csv' : 'pdf';
            link.setAttribute('download', `platform_intelligence_report_${dateStr}.${extension}`);

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to generate platform report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const months = [
        { value: '', label: 'Select Month (Optional)' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2024; i--) {
        years.push(i.toString());
    }

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Platform Intelligence Reports</h1>
                    <p style={subtitleStyle}>Global overview of users, growth, and transactional performance</p>
                </div>
            </header>

            <div style={gridStyle}>
                {/* Configuration Card */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <Filter size={18} color="#facc15" />
                        <h2 style={cardTitleStyle}>Reporting Period</h2>
                    </div>

                    <div style={formGridStyle}>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Fiscal Year</label>
                            <select
                                style={inputStyle}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Specific Month</label>
                            <select
                                style={inputStyle}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p style={infoNoteStyle}>
                        {month
                            ? `Exporting platform-wide data for ${months.find(m => m.value === month)?.label} ${year}`
                            : `Exporting platform-wide data for the full year of ${year}`
                        }
                    </p>
                </div>

                {/* Download Card */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <Download size={18} color="#facc15" />
                        <h2 style={cardTitleStyle}>Export Formats</h2>
                    </div>

                    <div style={buttonGroupStyle}>
                        <button
                            style={{ ...downloadButtonStyle, background: 'rgba(250,204,21,0.1)', color: '#facc15', border: '1px solid rgba(250,204,21,0.2)' }}
                            onClick={() => handleDownload('csv')}
                            disabled={loading}
                        >
                            <div style={buttonContentStyle}>
                                <FileText size={20} />
                                <div>
                                    <div style={buttonLabelStyle}>Export as CSV Data</div>
                                    <div style={buttonSublabelStyle}>Raw data for external audit/BI tools</div>
                                </div>
                            </div>
                        </button>

                        <button
                            style={{ ...downloadButtonStyle, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            onClick={() => handleDownload('pdf')}
                            disabled={loading}
                        >
                            <div style={buttonContentStyle}>
                                <FileText size={20} color="#f87171" />
                                <div>
                                    <div style={buttonLabelStyle}>Export as Intelligence PDF</div>
                                    <div style={buttonSublabelStyle}>Formatted report with executive summary</div>
                                </div>
                            </div>
                        </button>
                    </div>

                    {loading && (
                        <div style={loadingOverlayStyle}>
                            <div style={spinnerStyle} />
                            <span style={{ color: '#94a3b8', fontSize: 13 }}>Assembling platform data...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Platform Metrics Preview */}
            <div style={{ ...cardStyle, marginTop: 24 }}>
                <div style={cardHeaderStyle}>
                    <Activity size={18} color="#facc15" />
                    <h2 style={cardTitleStyle}>Intelligence Overview</h2>
                </div>
                <div style={metricsRowStyle}>
                    <div style={miniMetricStyle}>
                        <Users size={16} color="#71717a" />
                        <div>
                            <div style={miniMetricLabel}>User Growth</div>
                            <div style={miniMetricVal}>Comprehensive List</div>
                        </div>
                    </div>
                    <div style={miniMetricStyle}>
                        <DollarSign size={16} color="#71717a" />
                        <div>
                            <div style={miniMetricLabel}>Revenue Flow</div>
                            <div style={miniMetricVal}>All-Time Totals</div>
                        </div>
                    </div>
                    <div style={miniMetricStyle}>
                        <FileText size={16} color="#71717a" />
                        <div>
                            <div style={miniMetricLabel}>Audit Logs</div>
                            <div style={miniMetricVal}>Transaction History</div>
                        </div>
                    </div>
                </div>
                <div style={placeholderContentStyle}>
                    <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: '600px', textAlign: 'center' }}>The Platform Intelligence Report provides a high-level summary of paysigur operations. It merges User registration metrics with Transactional history and Global success rates into a single, cohesive audit document.</p>
                </div>
            </div>
        </div>
    );
}

/* ─────────────── STYLES ─────────────── */

const containerStyle = {
    padding: '10px'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28,
};

const titleStyle = {
    fontSize: 28,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '-0.5px',
};

const subtitleStyle = {
    color: '#71717a',
    fontSize: 14,
    marginTop: 4,
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
};

const cardStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    position: 'relative'
};

const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: 12,
};

const cardTitleStyle = {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#fff'
};

const formGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
};

const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
};

const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const inputStyle = {
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '12px',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
};

const infoNoteStyle = {
    marginTop: 20,
    fontSize: 12,
    color: '#71717a',
    fontStyle: 'italic'
};

const buttonGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
};

const downloadButtonStyle = {
    padding: '16px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
};

const buttonContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
};

const buttonLabelStyle = {
    fontWeight: 700,
    fontSize: 15,
};

const buttonSublabelStyle = {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 2,
};

const metricsRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 20
};

const miniMetricStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.02)',
    padding: '12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.03)'
};

const miniMetricLabel = {
    fontSize: 10,
    color: '#71717a',
    textTransform: 'uppercase',
    fontWeight: 600
};

const miniMetricVal = {
    fontSize: 13,
    color: '#fff',
    fontWeight: 600
};

const placeholderContentStyle = {
    padding: '24px',
    background: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center'
};

const loadingOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
};

const spinnerStyle = {
    width: 24,
    height: 24,
    border: '2px solid rgba(250,204,21,0.1)',
    borderTop: '2px solid #facc15',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
};
