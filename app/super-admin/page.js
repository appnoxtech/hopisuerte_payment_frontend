'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';

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

    const handleDownloadReport = async () => {
        try {

            const token = localStorage.getItem('super_admin_token');

            const response = await api.get('/super-admin/export-report', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');

            link.href = url;

            link.setAttribute(
                'download',
                `hopisuerte_report_${new Date().toISOString().split('T')[0]}.csv`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error('Failed to download report:', err);

            alert('Failed to generate report. Please try again.');

        }
    };

    if (loading)
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <div
                    style={{
                        width: '30px',
                        height: '30px',
                        border: '4px solid #eab308',
                        borderTop: '4px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
            </div>
        );

    const StatCard = ({ title, value, unit = '', color = '#eab308', icon }) => (
        <div
            style={{
                background: '#111',
                borderRadius: '14px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                }}
            >
                <p
                    style={{
                        fontSize: '11px',
                        color: '#888',
                        fontWeight: 800,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}
                >
                    {title}
                </p>

                <div
                    style={{
                        padding: '8px',
                        borderRadius: '10px',
                        background: `${color}22`,
                    }}
                >
                    <svg width="18" height="18" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
                    </svg>
                </div>
            </div>

            <h3
                style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                }}
            >
                {value}

                {unit && (
                    <span
                        style={{
                            fontSize: '11px',
                            color: '#777',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                        }}
                    >
                        {unit}
                    </span>
                )}
            </h3>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '6px',
                }}
            >
                <div
                    style={{
                        width: '6px',
                        height: '6px',
                        background: '#22c55e',
                        borderRadius: '50%',
                    }}
                />

                <p
                    style={{
                        fontSize: '10px',
                        color: '#666',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                    }}
                >
                    Live Status
                </p>
            </div>
        </div>
    );

    return (
        <div
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                paddingBottom: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '50px',
            }}
        >
            {/* Header */}

            <section
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '40px',
                            fontWeight: 900,
                            color: '#fff',
                        }}
                    >
                        Overview
                    </h1>

                    <p
                        style={{
                            fontSize: '12px',
                            color: '#777',
                            marginTop: '8px',
                        }}
                    >
                        Platform Operations Active
                    </p>
                </div>

                <button
                    onClick={handleDownloadReport}
                    style={{
                        padding: '14px 26px',
                        background: '#27272a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    Download Report
                </button>
            </section>

            {/* Stats */}

            <section>

                <h2
                    style={{
                        color: '#aaa',
                        fontSize: '12px',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                    }}
                >
                    Global Statistics
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                        gap: '20px',
                    }}
                >
                    <StatCard
                        title="Total Users"
                        value={stats?.total_users || 0}
                        color="#3b82f6"
                        icon="M17 20h5v-2..."
                    />

                    <StatCard
                        title="Total Transactions"
                        value={stats?.total_transactions || 0}
                        color="#eab308"
                        icon="M13 10V3L4 14h7v7l9-11h-7z"
                    />

                    <StatCard
                        title="Total Volume"
                        value={(stats?.total_volume || 0).toLocaleString()}
                        unit="USD"
                        color="#22c55e"
                        icon="M12 8c-1.657 0..."
                    />

                    <StatCard
                        title="Platform Success"
                        value={stats?.success_rate || 0}
                        unit="%"
                        color="#a855f7"
                        icon="M9 12l2 2 4-4..."
                    />
                </div>

            </section>

            {/* Admin Section */}

            <section
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))',
                    gap: '30px',
                }}
            >
                <div
                    style={{
                        background: '#111',
                        padding: '30px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            color: '#fff',
                            marginBottom: '25px',
                        }}
                    >
                        Management Access
                    </h3>

                    <div
                        style={{
                            display: 'grid',
                            gap: '15px',
                        }}
                    >
                        <Link
                            href="/super-admin/users"
                            style={{
                                padding: '20px',
                                background: '#000',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textDecoration: 'none',
                            }}
                        >
                            <p style={{ color: '#fff', fontWeight: 800 }}>Manage Users</p>
                            <p style={{ fontSize: '12px', color: '#777' }}>
                                View and edit registered user profiles
                            </p>
                        </Link>

                        <Link
                            href="/super-admin/payments"
                            style={{
                                padding: '20px',
                                background: '#000',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textDecoration: 'none',
                            }}
                        >
                            <p style={{ color: '#fff', fontWeight: 800 }}>Manage Payments</p>
                            <p style={{ fontSize: '12px', color: '#777' }}>
                                Monitor system wide transactions
                            </p>
                        </Link>
                    </div>
                </div>

                <div
                    style={{
                        background: '#111',
                        padding: '30px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center',
                    }}
                >
                    <h3
                        style={{
                            fontSize: '28px',
                            color: '#fff',
                            fontWeight: 900,
                        }}
                    >
                        System Monitor
                    </h3>

                    <p
                        style={{
                            fontSize: '13px',
                            color: '#777',
                            marginTop: '10px',
                        }}
                    >
                        All services are functioning normally
                    </p>
                </div>
            </section>
        </div>
    );
}