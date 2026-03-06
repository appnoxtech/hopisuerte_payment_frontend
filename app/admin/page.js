'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [copied, setCopied] = useState(false);

    // Filter states
    const [filterCustomer, setFilterCustomer] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchPayments();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (err) { }
    };

    const fetchPayments = async () => {
        try {
            const response = await api.get('/admin/payments');
            setPayments(response.data);
        } catch (err) {
            console.error('Failed to fetch payments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    borderTop: '2px solid #eab308',
                    borderBottom: '2px solid #eab308',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    const paymentUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/u/${user?.slug}`
        : '';

    const filteredPayments = payments.filter(p => {
        const matchesCustomer = (p.customer_name?.toLowerCase().includes(filterCustomer.toLowerCase())) ||
            (p.customer_email?.toLowerCase().includes(filterCustomer.toLowerCase()));
        const matchesProduct = (p.product?.name || 'Quick Link').toLowerCase().includes(filterProduct.toLowerCase());
        const matchesStatus = filterStatus === '' || p.status === filterStatus;

        let matchesDate = true;
        if (filterDate) {
            const pDate = new Date(p.created_at).toISOString().split('T')[0];
            matchesDate = pDate === filterDate;
        }

        return matchesCustomer && matchesProduct && matchesStatus && matchesDate;
    }).sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return (
        <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            paddingBottom: 80,
            paddingLeft: 16,
            paddingRight: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 48
        }}>

            {/* Header */}
            <header style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                justifyContent: 'space-between'
            }}>
                <div>
                    <h1 style={{
                        fontSize: 30,
                        fontWeight: 900,
                        color: 'white',
                        textTransform: 'uppercase'
                    }}>
                        Dashboard
                    </h1>

                    <p style={{
                        color: '#71717a',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}>
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#22c55e'
                        }} />
                        Platform Status: Operational
                    </p>
                </div>
            </header>

            {/* Payment Link */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 4, height: 20, background: '#eab308', borderRadius: 4 }} />
                    <h2 style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#a1a1aa',
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        Share Payment Link
                    </h2>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: 32,
                    borderRadius: 12,
                    position: 'relative'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 32
                    }}>
                        <div style={{ maxWidth: 500 }}>
                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                Your Personal Payment URL
                            </h3>

                            <p style={{
                                color: '#71717a',
                                fontSize: 14,
                                marginTop: 6
                            }}>
                                Share this link with your customers to accept payments instantly.
                                No integration required.
                            </p>

                            <div style={{
                                display: 'flex',
                                marginTop: 20,
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 8,
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <code style={{
                                        color: '#facc15',
                                        fontSize: 12,
                                        fontFamily: 'monospace'
                                    }}>
                                        {paymentUrl}
                                    </code>
                                </div>

                                <button
                                    onClick={handleCopy}
                                    style={{
                                        padding: '10px 16px',
                                        background: copied ? '#22c55e' : 'rgba(255,255,255,0.05)',
                                        color: copied ? 'white' : '#a1a1aa',
                                        fontSize: 10,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        border: 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link
                                href={paymentUrl}
                                target="_blank"
                                style={{
                                    padding: '14px 32px',
                                    background: '#eab308',
                                    color: 'black',
                                    fontWeight: 900,
                                    fontSize: 10,
                                    textTransform: 'uppercase',
                                    letterSpacing: 2,
                                    borderRadius: 6,
                                    textDecoration: 'none',
                                    width: 'fit-content'
                                }}
                            >
                                View Public Page
                            </Link>

                            <Link
                                href="/admin/profile"
                                style={{
                                    padding: '14px 32px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontWeight: 900,
                                    fontSize: 10,
                                    textTransform: 'uppercase',
                                    letterSpacing: 2,
                                    borderRadius: 6,
                                    textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    width: 'fit-content'
                                }}
                            >
                                Edit Profile & URL
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revenue Stats */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 4, height: 20, background: '#3b82f6', borderRadius: 4 }} />
                    <h2 style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#a1a1aa',
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        Revenue Overview
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
                    gap: 24
                }}>
                    {[
                        {
                            label: 'Total Revenue',
                            value: payments.reduce((acc, p) =>
                                p.status === 'success' ? acc + parseFloat(p.amount) : acc, 0
                            ).toFixed(2),
                            sub: 'Settled funds'
                        },
                        {
                            label: 'Total Payments',
                            value: payments.length,
                            sub: 'Transaction count'
                        },
                        {
                            label: 'Pending Balance',
                            value: payments.reduce((acc, p) =>
                                p.status === 'pending' ? acc + parseFloat(p.amount) : acc, 0
                            ).toFixed(2),
                            sub: 'Awaiting verification'
                        }
                    ].map((stat, i) => (
                        <div key={i} style={{
                            padding: 32,
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.05)',
                            background: 'rgba(255,255,255,0.03)'
                        }}>
                            <p style={{
                                fontSize: 10,
                                color: '#71717a',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: 2
                            }}>
                                {stat.label}
                            </p>

                            <div style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 6,
                                marginTop: 8
                            }}>
                                <span style={{
                                    fontSize: 40,
                                    fontWeight: 900,
                                    color: 'white'
                                }}>
                                    {stat.value}
                                </span>

                                <span style={{
                                    fontSize: 10,
                                    color: '#52525b',
                                    fontWeight: 900
                                }}>
                                    USD
                                </span>
                            </div>

                            <p style={{
                                fontSize: 10,
                                color: '#71717a',
                                marginTop: 4
                            }}>
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Transactions */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#a1a1aa',
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        Transaction History
                    </h2>

                    {(filterCustomer || filterProduct || filterStatus || filterDate) && (
                        <button
                            onClick={() => {
                                setFilterCustomer('');
                                setFilterProduct('');
                                setFilterStatus('');
                                setFilterDate('');
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#eab308',
                                fontSize: 10,
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: 1
                            }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Filters UI */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 12,
                    background: 'rgba(255,255,255,0.02)',
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#71717a', textTransform: 'uppercase' }}>Customer</label>
                        <input
                            type="text"
                            placeholder="Name or email..."
                            value={filterCustomer}
                            onChange={(e) => setFilterCustomer(e.target.value)}
                            style={{
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: 12,
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#71717a', textTransform: 'uppercase' }}>Product</label>
                        <input
                            type="text"
                            placeholder="Product name..."
                            value={filterProduct}
                            onChange={(e) => setFilterProduct(e.target.value)}
                            style={{
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: 12,
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#71717a', textTransform: 'uppercase' }}>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: 12,
                                outline: 'none'
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 9, fontWeight: 900, color: '#71717a', textTransform: 'uppercase' }}>Date</label>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            style={{
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: 12,
                                outline: 'none',
                                colorScheme: 'dark'
                            }}
                        />
                    </div>
                </div>

                <div style={{
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    overflow: 'hidden'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{
                                background: 'rgba(255,255,255,0.02)',
                                fontSize: 10,
                                textTransform: 'uppercase',
                                color: '#71717a'
                            }}>
                                <th style={{ padding: 16, textAlign: 'left' }}>Customer</th>
                                <th style={{ padding: 16, textAlign: 'left' }}>Product</th>
                                <th style={{ padding: 16, textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: 16, textAlign: 'center' }}>Status</th>
                                <th
                                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                    style={{
                                        padding: 16,
                                        textAlign: 'right',
                                        cursor: 'pointer',
                                        color: '#eab308',
                                        userSelect: 'none'
                                    }}
                                >
                                    Date {sortOrder === 'desc' ? '↓' : '↑'}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: 48, textAlign: 'center', color: '#71717a', fontSize: 12, fontWeight: 700 }}>
                                        No transactions found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((p) => (
                                    <tr key={p.id} style={{
                                        borderTop: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <td style={{ padding: 16 }}>
                                            <div style={{ color: 'white', fontWeight: 700 }}>
                                                {p.customer_name}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#71717a' }}>
                                                {p.customer_email}
                                            </div>
                                        </td>

                                        <td style={{ padding: 16 }}>
                                            <span style={{
                                                fontSize: 11,
                                                color: '#a1a1aa',
                                                textTransform: 'uppercase'
                                            }}>
                                                {p.product?.name || 'Quick Link'}
                                            </span>
                                        </td>

                                        <td style={{ padding: 16, textAlign: 'right', color: 'white', fontWeight: 900 }}>
                                            {p.amount} {p.currency}
                                        </td>

                                        <td style={{ padding: 16, textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: 6,
                                                fontSize: 10,
                                                textTransform: 'uppercase',
                                                background:
                                                    p.status === 'success'
                                                        ? '#16a34a'
                                                        : p.status === 'failed'
                                                            ? '#dc2626'
                                                            : '#eab308',
                                                color: 'white'
                                            }}>
                                                {p.status}
                                            </span>
                                        </td>

                                        <td style={{ padding: 16, textAlign: 'right', color: '#71717a', fontSize: 12 }}>
                                            {new Date(p.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function Link({ href, target, style, children }) {
    return (
        <a
            href={href}
            target={target}
            style={style}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
            {children}
        </a>
    );
}