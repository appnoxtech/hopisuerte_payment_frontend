'use client';

import { BarChart3, Download, FileText, Info, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
    const [generating, setGenerating] = useState(false);

    const handleDownload = () => {
        setGenerating(true);
        setTimeout(() => setGenerating(false), 2000);
    };

    return (
        <div style={pageStyle}>
            <header style={headerStyle}>
                <div>
                    <h1 style={titleStyle}>Operational Reports</h1>
                    <p style={subtitleStyle}>Analytics and merchant performance exports</p>
                </div>
            </header>

            <div style={gridStyle}>
                <div style={cardStyle}>
                    <div style={iconWrapStyle}>
                        <FileText size={18} color="#fbbf24" />
                    </div>
                    <div>
                        <h3 style={cardTitleStyle}>Monthly Performance</h3>
                        <p style={cardDescStyle}>Comprehensive summary of successful payments and merchant volume for the current cycle.</p>
                        <button onClick={handleDownload} style={btnStyle} disabled={generating}>
                            {generating ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                    <div style={spinnerStyle} />
                                    <span>Syncing...</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                                    <Download size={14} />
                                    <span>Export CSV</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={iconWrapStyle}>
                        <BarChart3 size={18} color="#6366f1" />
                    </div>
                    <div>
                        <h3 style={cardTitleStyle}>Traffic Analytics</h3>
                        <p style={cardDescStyle}>View click-through rates and conversion statistics for your active payment links.</p>
                        <div style={placeholderBadgeStyle}>Visual Nexus Coming Soon</div>
                    </div>
                </div>
            </div>

            <div style={infoBoxStyle}>
                <Info size={14} color="#3f3f46" />
                <span>Reports are generated in real-time based on your current merchant ledger data.</span>
            </div>
        </div>
    );
}

const pageStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' };
const headerStyle = { marginBottom: '8px' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' };
const cardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px'
};

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

const cardTitleStyle = { fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '4px' };
const cardDescStyle = { fontSize: '11px', color: '#52525b', lineHeight: '1.6', marginBottom: '20px', fontWeight: '600' };

const btnStyle = {
    width: '100%',
    padding: '10px',
    background: '#fbbf24',
    border: 'none',
    borderRadius: '10px',
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
    padding: '10px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '10px',
    color: '#3f3f46',
    fontSize: '9px',
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
    borderRadius: '12px',
    color: '#3f3f46',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.02)'
};
