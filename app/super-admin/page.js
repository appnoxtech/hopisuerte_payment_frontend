'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import {
    Users,
    Zap,
    TrendingUp,
    BarChart3,
    CreditCard,
    Activity,
    ShieldCheck,
    Globe,
    ArrowUpRight
} from 'lucide-react';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, userRes] = await Promise.all([
                    api.get('/super-admin/stats', getSuperAdminHeaders()),
                    api.get('/user', getSuperAdminHeaders())
                ]);
                setStats(statsRes.data);
                setUser(userRes.data);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #fbbf24', borderBottom: '2px solid rgba(251, 191, 36, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    const StatCard = ({ title, value, unit = '', color = '#fbbf24', icon: Icon }) => (
        <div style={cardStyle}>
            <div style={cardHeaderStyle}>
                <div style={cardLabelStyle}>{title}</div>
                <Icon size={14} color={color} style={{ opacity: 0.6 }} />
            </div>
            <div style={cardValueStyle}>
                {unit && <span style={unitStyle}>{unit}</span>}
                {value}
            </div>

        </div>
    );

    return (
        <div style={containerStyle}>


            {/* Matrix Stats */}
            <section style={statGridStyle}>
                <StatCard title="Total Freelancers" value={stats?.total_users || 0} icon={Users} color="#6366f1" />
                <StatCard title="Total Amount" value={(stats?.total_volume || 0).toLocaleString()} unit="$" icon={Globe} color="#10b981" />
                <StatCard title="Active Transactions" value={stats?.total_transactions || 0} icon={Zap} color="#f59e0b" />
                <StatCard title="Success Rate" value={stats?.success_rate || 0} unit="%" icon={TrendingUp} color="#fbbf24" />
            </section>

            <section style={mainGridStyle}>
                {/* Control Nodes */}
                <div style={nodesCardStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={sectionTitleStyle}>System Control Nodes</h3>
                        <p style={sectionSubStyle}>Direct access to core infrastructure</p>
                    </div>

                    <div style={nodeListStyle}>
                        <Link href="/super-admin/users" style={nodeItemStyle}>
                            <div style={nodeIconBox}><Users size={18} color="#fbbf24" /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Freelancer Directory</div>
                                <div style={nodeDescStyle}>Manage authorized merchant identities</div>
                            </div>
                            <ArrowUpRight size={14} color="#52525b" />
                        </Link>

                        <Link href="/super-admin/payments" style={nodeItemStyle}>
                            <div style={nodeIconBox}><CreditCard size={18} color="#10b981" /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Transactions</div>
                                <div style={nodeDescStyle}>Global audit of transactional movement</div>
                            </div>
                            <ArrowUpRight size={14} color="#52525b" />
                        </Link>

                        <Link href="/super-admin/products" style={nodeItemStyle}>
                            <div style={nodeIconBox}><BarChart3 size={18} color="#6366f1" /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Products</div>
                                <div style={nodeDescStyle}>Global product and asset management</div>
                            </div>
                            <ArrowUpRight size={14} color="#52525b" />
                        </Link>
                    </div>
                </div>

                {/* System Health */}
                {/* <div style={healthCardStyle}>
                    <div style={healthCircleWrap}>
                        <div style={healthCenter}>
                            <span style={healthValue}>99.9%</span>
                            <span style={healthLabel}>Uptime</span>
                        </div>
                        <svg width="100" height="100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="282" strokeDashoffset="28" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <div style={healthStatusStyle}>
                            <div style={activeDot} />
                            <span>Nexus Operational</span>
                        </div>
                        <p style={healthDesc}>Security protocols and payment links are fully synchronized across all regions.</p>
                    </div>

                    <div style={healthMetaGrid}>
                        <div style={healthMetaItem}>
                            <ShieldCheck size={12} color="#10b981" />
                            <span>SSL Encrypted</span>
                        </div>
                        <div style={healthMetaItem}>
                            <Activity size={12} color="#10b981" />
                            <span>Vault Secure</span>
                        </div>
                    </div>
                </div> */}
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
    gap: '24px',
    padding: '10px 0',
    animation: 'fadeIn 0.5s ease-out'
};

const headerSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
};

const titleStyle = {
    fontSize: '20px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
};

const subtitleStyle = {
    fontSize: '11px',
    color: '#71717a',
    fontWeight: '500',
    marginTop: '2px'
};

const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
};

const cardStyle = {
    background: 'rgba(15,15,20,0.4)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden'
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const cardLabelStyle = {
    fontSize: '10px',
    color: '#52525b',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const cardValueStyle = {
    fontSize: '22px',
    fontWeight: '900',
    color: '#fff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
};

const unitStyle = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
};

const cardFooterStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const mainGridStyle = {
    display: 'grid',
    // gridTemplateColumns: '1.2fr 1fr',
    gap: '24px',
    marginTop: '8px'
};

const nodesCardStyle = {
    background: 'rgba(15,15,20,0.4)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const sectionHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '2px' };

const sectionTitleStyle = {
    fontSize: '15px',
    fontWeight: '900',
    color: '#fff'
};

const sectionSubStyle = {
    fontSize: '11px',
    color: '#52525b'
};

const nodeListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const nodeItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.02)',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
};

const nodeIconBox = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.04)'
};

const nodeNameStyle = {
    fontSize: '13px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '2px'
};

const nodeDescStyle = {
    fontSize: '11px',
    color: '#52525b'
};

const healthCardStyle = {
    background: 'rgba(251, 191, 36, 0.02)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(251, 191, 36, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

const healthCircleWrap = {
    position: 'relative',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const healthCenter = {
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column'
};

const healthValue = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#fbbf24'
};

const healthLabel = {
    fontSize: '8px',
    color: '#52525b',
    textTransform: 'uppercase',
    fontWeight: '800'
};

const healthStatusStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px'
};

const activeDot = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 10px #10b981'
};

const healthDesc = {
    fontSize: '11px',
    color: '#52525b',
    lineHeight: '1.6',
    maxWidth: '220px',
    margin: '0 auto'
};

const healthMetaGrid = {
    display: 'flex',
    gap: '16px',
    marginTop: '24px'
};

const healthMetaItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: '800',
    color: '#10b981',
    textTransform: 'uppercase'
};