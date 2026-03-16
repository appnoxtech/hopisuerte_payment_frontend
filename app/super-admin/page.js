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
import CustomDropdown from '@/components/CustomDropdown';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displayCurrency, setDisplayCurrency] = useState('USD');

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
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2.5px solid #0070E0', borderBottom: '2.5px solid #E2E8F0', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    const StatCard = ({ title, value, unit = '', color = '#0070E0', icon: Icon, extra = null }) => (
        <div style={cardStyle}>
            <div style={cardHeaderStyle}>
                <div style={cardLabelStyle}>{title}</div>
                <div style={{ ...iconWrapperSmall, color: color, background: `${color}10` }}>
                    <Icon size={14} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
                <div style={cardValueStyle}>
                    {unit && unit !== '%' && <span style={unitStyle}>{unit}</span>}
                    {value}
                    {unit === '%' && <span style={unitStyle}>{unit}</span>}
                </div>
                {extra && (
                    <div style={{ width: 85 }}>
                        {extra}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>


            {/* Matrix Stats */}
            <section style={statGridStyle}>
                <StatCard title="Total Merchants" value={stats?.total_users || 0} icon={Users} color="#0070E0" />
                <StatCard
                    title="Total Amount"
                    value={
                        displayCurrency === 'USD' ? (stats?.total_volume_usd || 0).toLocaleString() :
                            (displayCurrency === 'EUR' ? (stats?.total_volume_eur || 0).toLocaleString() :
                                (stats?.total_volume_xcg || 0).toLocaleString())
                    }
                    extra={
                        <CustomDropdown
                            options={[
                                { label: 'USD', value: 'USD' },
                                { label: 'EUR', value: 'EUR' },
                                { label: 'XCG', value: 'XCG' }
                            ]}
                            value={displayCurrency}
                            onChange={setDisplayCurrency}
                            showSearch={false}
                            placeholder="Cur"
                        />
                    }
                    unit={displayCurrency === 'USD' ? '$' : (displayCurrency === 'EUR' ? '€' : 'Cg')}
                    icon={Globe}
                    color="#10B981"
                />
                <StatCard title="Active Transactions" value={stats?.total_transactions || 0} icon={Zap} color="#6366F1" />
                <StatCard title="Platform Health" value={stats?.success_rate || 0} unit="%" icon={TrendingUp} color="#8B5CF6" />
            </section>

            <section style={mainGridStyle}>
                {/* Control Nodes */}                <div style={nodesCardStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={sectionTitleStyle}>Management Terminals</h3>
                        <p style={sectionSubStyle}>Administrative access to platform modules</p>
                    </div>

                    <div style={nodeListStyle}>
                        <Link href="/super-admin/users" style={nodeItemStyle}>
                            <div style={{ ...nodeIconBox, background: '#F0F7FF', color: '#0070E0' }}><Users size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Merchants</div>
                                <div style={nodeDescStyle}>Review and authenticate merchant accounts</div>
                            </div>
                            <ArrowUpRight size={16} color="#A0AEC0" />
                        </Link>

                        <Link href="/super-admin/payments" style={nodeItemStyle}>
                            <div style={{ ...nodeIconBox, background: '#ECFDF5', color: '#10B981' }}><CreditCard size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Total Transactions</div>
                                <div style={nodeDescStyle}>Complete real-time payment ledger</div>
                            </div>
                            <ArrowUpRight size={16} color="#A0AEC0" />
                        </Link>

                        <Link href="/super-admin/products" style={nodeItemStyle}>
                            <div style={{ ...nodeIconBox, background: '#F5F3FF', color: '#6366F1' }}><Activity size={20} /></div>
                            <div style={{ flex: 1 }}>
                                <div style={nodeNameStyle}>Inventory & Services</div>
                                <div style={nodeDescStyle}>Global directory of merchant listings</div>
                            </div>
                            <ArrowUpRight size={16} color="#A0AEC0" />
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
    gap: '32px',
    padding: '10px 0',
    animation: 'fadeIn 0.5s ease-out'
};

const titleStyle = {
    fontSize: '24px',
    fontWeight: '800',
    color: '#001C64',
    letterSpacing: '-0.02em',
    fontFamily: "'Outfit', sans-serif"
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#6B7C93',
    fontWeight: '500',
    marginTop: '4px'
};

const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
};

const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)'
};

const iconWrapperSmall = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const cardLabelStyle = {
    fontSize: '13px',
    color: '#6B7C93',
    fontWeight: '600',
    letterSpacing: '0.01em'
};

const cardValueStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#001C64',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    fontFamily: "'Outfit', sans-serif"
};

const unitStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#6B7C93',
    display: 'inline-flex',
    alignItems: 'baseline',
    marginRight: '4px'
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
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid #E3E8EF',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)'
};

const sectionHeaderStyle = { display: 'flex', flexDirection: 'column', gap: '2px' };

const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#001C64',
    fontFamily: "'Outfit', sans-serif"
};

const sectionSubStyle = {
    fontSize: '14px',
    color: '#6B7C93',
    fontWeight: '500'
};

const nodeListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const nodeItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    background: '#F7F9FC',
    borderRadius: '16px',
    border: '1px solid #E3E8EF',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
};

const nodeIconBox = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.05)'
};

const nodeNameStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: '4px'
};

const nodeDescStyle = {
    fontSize: '13px',
    color: '#6B7C93',
    fontWeight: '500'
};

const healthCardStyle = {
    background: 'rgba(251, 191, 36, 0.02)',
    borderRadius: '20px',
    padding: '32px',
    border: '1px solid rgba(251, 191, 36, 0.2)',
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