'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import {
    Users,
    Zap,
    TrendingUp,
    BarChart3,
    Download,
    CreditCard,
    Activity,
    CheckCircle2,
    Lock,
    LayoutDashboard
} from 'lucide-react';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/super-admin/stats', getSuperAdminHeaders());
                setStats(response.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <div style={{ width: '32px', height: '32px', border: '4px solid #fbbf24', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    const StatCard = ({ title, value, unit = '', color = '#fbbf24', icon: Icon }) => (
        <div style={cardStyle}>
            <div style={{ ...cardHoverOverlay, background: `${color}05` }} />
            <div style={cardHeaderStyle}>
                <div style={{ ...iconContainerStyle, background: `${color}10`, borderColor: `${color}20` }}>
                    <Icon size={20} color={color} />
                </div>
                <div style={cardBadgeStyle}>
                    <div style={{ ...dotStyle, background: '#10b981' }} />
                    <span>Real-time</span>
                </div>
            </div>
            <div style={cardContentStyle}>
                <p style={cardLabelStyle}>{title}</p>
                <h3 style={cardValueStyle}>
                    {value}
                    {unit && <span style={unitStyle}>{unit}</span>}
                </h3>
            </div>
            <div style={cardProgressContainer}>
                <div style={{ ...cardProgressBar, background: color, width: '70%', boxShadow: `0 0 10px ${color}40` }} />
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            <header style={headerSectionStyle}>
                <div>
                    <h1 style={titleStyle}>Command Center</h1>
                    <p style={subtitleStyle}>Global oversight of system operations and capital flow</p>
                </div>
            </header>

            <section style={accessGridStyle}>
                <div style={managementCardStyle}>
                    <div style={managementHeaderStyle}>
                        <h3 style={managementTitleStyle}>Operational Modules</h3>
                        <p style={managementSubtitleStyle}>Direct access to core system entities</p>
                    </div>
                    <div style={moduleGridStyle}>
                        <Link href="/super-admin/users" style={moduleItemStyle}>
                            <div style={moduleIconStyle}><Users size={24} color="#fbbf24" /></div>
                            <div>
                                <h4 style={moduleNameStyle}>Freelancer Directory</h4>
                                <p style={moduleDescStyle}>Verify identities and manage authorized agents</p>
                            </div>
                        </Link>
                        <Link href="/super-admin/payments" style={moduleItemStyle}>
                            <div style={moduleIconStyle}><CreditCard size={24} color="#fbbf24" /></div>
                            <div>
                                <h4 style={moduleNameStyle}>Global Transaction Vault</h4>
                                <p style={moduleDescStyle}>Audit and monitor real-time fund movement</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div style={statusCardStyle}>
                    <div style={radialContainerStyle}>
                        <div style={{ position: 'relative', width: 120, height: 120 }}>
                            <svg width="120" height="120" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="6" strokeDasharray="210 283" strokeLinecap="round" />
                            </svg>
                            <div style={radialLabelStyle}>
                                <span style={radialValueStyle}>99.9</span>
                                <span style={radialUnitStyle}>Uptime</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                            <Activity size={18} color="#10b981" />
                            <h3 style={statusTitleStyle}>System Health</h3>
                        </div>
                        <p style={statusDescStyle}>All core infrastructure components are operational</p>
                    </div>
                    <div style={statusGridStyle}>
                        <div style={statusIndicatorStyle}>
                            <div style={{ ...smallDotStyle, background: '#10b981' }} />
                            <span>Payment API</span>
                        </div>
                        <div style={statusIndicatorStyle}>
                            <div style={{ ...smallDotStyle, background: '#10b981' }} />
                            <span>Vault Security</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    padding: '20px 0',
    animation: 'fadeIn 0.5s ease-out'
};

const headerSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const titleStyle = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: '4px'
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#71717a',
    fontWeight: '500'
};

const reportBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
};

const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px'
};

const cardStyle = {
    background: 'rgba(15,15,20,0.4)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const cardHoverOverlay = {
    position: 'absolute',
    inset: 0,
    opacity: 0.1,
    transition: 'opacity 0.3s ease'
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative'
};

const iconContainerStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid'
};

const cardBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(16, 185, 129, 0.05)',
    borderRadius: '20px',
    fontSize: '10px',
    color: '#10b981',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = {
    width: '4px',
    height: '4px',
    borderRadius: '50%'
};

const cardContentStyle = { position: 'relative' };

const cardLabelStyle = {
    fontSize: '12px',
    color: '#71717a',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
};

const cardValueStyle = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#fff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px'
};

const unitStyle = {
    fontSize: '12px',
    color: '#52525b',
    fontWeight: '700'
};

const cardProgressContainer = {
    width: '100%',
    height: '2px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    marginTop: '20px',
    overflow: 'hidden'
};

const cardProgressBar = {
    height: '100%',
    transition: 'width 1s ease-out'
};

const accessGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px'
};

const managementCardStyle = {
    background: 'rgba(15,15,20,0.6)',
    borderRadius: '24px',
    padding: '32px',
    border: '1px solid rgba(255,255,255,0.04)'
};

const managementHeaderStyle = { marginBottom: '32px' };

const managementTitleStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '4px'
};

const managementSubtitleStyle = {
    fontSize: '13px',
    color: '#71717a'
};

const moduleGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
};

const moduleItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.04)',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
};

const moduleIconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'rgba(251, 191, 36, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const moduleNameStyle = {
    fontSize: '15px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '2px'
};

const moduleDescStyle = {
    fontSize: '12px',
    color: '#71717a'
};

const statusCardStyle = {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(15,15,20,0.6) 100%)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(16, 185, 129, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

const radialContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const radialLabelStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

const radialValueStyle = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#10b981'
};

const radialUnitStyle = {
    fontSize: '9px',
    color: '#71717a',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const statusTitleStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff'
};

const statusDescStyle = {
    fontSize: '13px',
    color: '#71717a',
    maxWidth: '240px'
};

const statusGridStyle = {
    display: 'flex',
    gap: '24px',
    marginTop: '32px'
};

const statusIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const smallDotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
};