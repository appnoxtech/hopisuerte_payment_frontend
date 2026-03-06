'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function GlobalPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);
    const [view, setView] = useState('summary'); // 'summary' or 'detailed'
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/payments', getSuperAdminHeaders());
            setPayments(response.data);
        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const getGroupedData = () => {
        const groups = {};
        payments.forEach(p => {
            const freelancerId = p.product?.user?.id || 'unknown';
            const freelancerName = p.product?.user?.name || 'Unknown Freelancer';
            const freelancerEmail = p.product?.user?.email || '';

            if (!groups[freelancerId]) {
                groups[freelancerId] = {
                    id: freelancerId,
                    name: freelancerName,
                    email: freelancerEmail,
                    totalByCurrency: {},
                    totalTransactions: 0,
                    payments: []
                };
            }

            const amount = p.amount || 0;
            const currency = p.currency || 'USD';

            groups[freelancerId].totalByCurrency[currency] = (groups[freelancerId].totalByCurrency[currency] || 0) + amount;
            groups[freelancerId].totalTransactions += 1;
            groups[freelancerId].payments.push(p);
        });
        return Object.values(groups);
    };

    const groupedFreelancers = getGroupedData().filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const activeFreelancer = groupedFreelancers.find(f => f.id === selectedFreelancerId);

    if (loading && payments.length === 0) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px"
            }}>
                <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    borderTop: "2px solid #eab308",
                    borderBottom: "2px solid #eab308",
                    animation: "spin 1s linear infinite"
                }} />
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: "1280px",
            margin: "0 auto",
            paddingBottom: "80px",
            display: "flex",
            flexDirection: "column",
            gap: "48px"
        }}>

            {/* Header */}
            <section style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                padding: "0 8px"
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{
                            fontSize: "36px",
                            fontWeight: "900",
                            color: "#ffffff",
                            textTransform: "uppercase",
                            letterSpacing: "-0.03em",
                            fontStyle: "italic"
                        }}>
                            {view === 'summary' ? 'Global Payments' : 'Freelancer Activity'}
                        </h1>

                        <p style={{
                            color: "#71717a",
                            fontSize: "12px",
                            fontWeight: "700",
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <span style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#eab308",
                                display: "inline-block"
                            }}></span>
                            {view === 'summary' ? 'Grouped by Freelancer' : `Detailed View: ${activeFreelancer?.name}`}
                        </p>
                    </div>

                    {view === 'detailed' && (
                        <button
                            onClick={() => {
                                setView('summary');
                                setSelectedFreelancerId(null);
                            }}
                            style={{
                                background: 'transparent',
                                border: '1px solid #333',
                                color: '#aaa',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontWeight: '700',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: '1px'
                            }}
                        >
                            ← Back to Overview
                        </button>
                    )}
                </div>

                <button
                    onClick={fetchPayments}
                    disabled={loading}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 32px",
                        fontSize: "10px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        background: "#111",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer",
                        opacity: loading ? 0.5 : 1
                    }}
                >
                    Refresh Data
                </button>
            </section>

            {/* Main Content Area */}
            <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px" }}>
                    <div style={{
                        width: "6px",
                        height: "24px",
                        background: view === 'summary' ? "#3b82f6" : "#22c55e",
                        borderRadius: "999px"
                    }}></div>

                    <h2 style={{
                        fontSize: "12px",
                        fontWeight: "900",
                        color: "#a1a1aa",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em"
                    }}>
                        {view === 'summary' ? 'Freelancer Performance Directory' : 'Individual Transaction History'}
                    </h2>
                </div>

                <div style={{ display: 'flex', gap: '15px', padding: '0 8px' }}>
                    <div style={{
                        flex: 1,
                        position: 'relative'
                    }}>
                        <span style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#71717a'
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Find freelancer by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 14px 14px 44px',
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    background: '#09090b'
                }}>
                    <div style={{ overflowX: "auto" }}>

                        {view === 'summary' ? (
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{
                                        background: "rgba(255,255,255,0.03)",
                                        color: "#71717a",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.2em",
                                        fontWeight: "900"
                                    }}>
                                        <th style={{ padding: "24px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Freelancer</th>
                                        <th style={{ padding: "24px 40px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Transactions</th>
                                        <th style={{ padding: "24px 40px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedFreelancers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ padding: "120px 40px", textAlign: "center" }}>
                                                <h3 style={{ color: "#52525b", fontWeight: "900", textTransform: "uppercase" }}>{searchQuery ? 'No Results Found' : 'No Payments Found'}</h3>
                                                <p style={{ color: '#3f3f46', fontSize: '12px', marginTop: '8px' }}>
                                                    {searchQuery ? 'Try adjusting your search criteria' : 'Transactions will appear here once recorded'}
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        groupedFreelancers.map((freelancer) => (
                                            <tr key={freelancer.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                                <td style={{ padding: "32px 40px" }}>
                                                    <div
                                                        onClick={() => {
                                                            setSelectedFreelancerId(freelancer.id);
                                                            setView('detailed');
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <strong style={{ color: "#eab308", fontSize: "18px", display: 'block' }}>
                                                            {freelancer.name}
                                                        </strong>
                                                        <span style={{ fontSize: "12px", color: "#71717a" }}>{freelancer.email}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "32px 40px", textAlign: "center" }}>
                                                    <span style={{
                                                        padding: "6px 16px",
                                                        background: 'rgba(59,130,246,0.1)',
                                                        color: '#3b82f6',
                                                        borderRadius: '20px',
                                                        fontWeight: '900',
                                                        fontSize: '12px'
                                                    }}>
                                                        {freelancer.totalTransactions} Records
                                                    </span>
                                                </td>
                                                <td style={{ padding: "32px 40px", textAlign: "right" }}>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedFreelancerId(freelancer.id);
                                                            setView('detailed');
                                                        }}
                                                        style={{
                                                            padding: "10px 18px",
                                                            borderRadius: "8px",
                                                            border: "1px solid rgba(234,179,8,0.3)",
                                                            background: "rgba(234,179,8,0.05)",
                                                            color: "#eab308",
                                                            fontWeight: "800",
                                                            fontSize: "11px",
                                                            textTransform: "uppercase",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        View History
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                <thead>
                                    <tr style={{
                                        background: "rgba(255,255,255,0.03)",
                                        color: "#71717a",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.2em",
                                        fontWeight: "900"
                                    }}>
                                        <th style={{ padding: "24px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Customer</th>
                                        <th style={{ padding: "24px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Product</th>
                                        <th style={{ padding: "24px 40px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Amount</th>
                                        <th style={{ padding: "24px 40px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Status</th>
                                        <th style={{ padding: "24px 40px", textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeFreelancer?.payments.map((payment) => (
                                        <tr key={payment.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            <td style={{ padding: "32px 40px" }}>
                                                <div style={{ color: "#fff", fontWeight: "700" }}>{payment.customer_name}</div>
                                                <div style={{ fontSize: "12px", color: "#71717a" }}>{payment.customer_email}</div>
                                            </td>
                                            <td style={{ padding: "32px 40px" }}>
                                                <span style={{ padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "12px", color: '#fff' }}>
                                                    {payment.product?.name || 'Deleted Product'}
                                                </span>
                                            </td>
                                            <td style={{ padding: "32px 40px", textAlign: "right", fontWeight: "900", color: "#fff", fontSize: "20px" }}>
                                                {(payment.amount || 0).toLocaleString()} {payment.currency}
                                            </td>
                                            <td style={{ padding: "32px 40px", textAlign: "center" }}>
                                                <span style={{
                                                    padding: "6px 16px",
                                                    borderRadius: "999px",
                                                    fontSize: "12px",
                                                    background: payment.status === "success" ? "#16a34a" : payment.status === "failed" ? "#dc2626" : "#eab308",
                                                    color: "#fff"
                                                }}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "32px 40px", textAlign: "right", color: "#fff", fontSize: "12px" }}>
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    </div>
                </div>

            </section>

        </div>
    );
}