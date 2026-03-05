'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    );

    const paymentUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${user?.slug}` : '';

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 px-4 sm:px-0">
            {/* Dashboard Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Dashboard</h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></span>
                        Platform Status: Operational
                    </p>
                </div>
            </header>

            {/* Standardized Layout: Payment Link */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-yellow-500 rounded-full"></div>
                    <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Share Payment Link</h2>
                </div>
                <div className="glass-card p-6 md:p-10 relative group border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.02] rounded-full blur-[100px] pointer-events-none transition-colors"></div>

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="max-w-xl space-y-2">
                            <h3 className="text-xl font-bold text-white">Your Personal Payment URL</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                Share this link with your customers to accept payments instantly.
                                No integration required.
                            </p>

                            <div className="flex items-stretch gap-2 bg-black/40 border border-white/5 rounded-lg p-1 mt-6 max-w-md">
                                <div className="flex-1 px-4 py-2.5 flex items-center min-w-0">
                                    <code className="text-yellow-500/90 font-mono text-xs truncate">
                                        {paymentUrl}
                                    </code>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(paymentUrl)}
                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-md transition-all flex items-center gap-2 font-black text-[9px] uppercase tracking-wider"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        <Link
                            href={paymentUrl}
                            target="_blank"
                            className="saas-btn-primary px-10 py-4 uppercase tracking-[0.2em] text-[10px] whitespace-nowrap self-start md:self-center"
                        >
                            View Public Page
                        </Link>
                    </div>
                </div>
            </section>

            {/* Insights Overview */}
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                    <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Revenue Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            label: 'Total Revenue',
                            value: `${payments.reduce((acc, p) => p.status === 'success' ? acc + parseFloat(p.amount) : acc, 0).toFixed(2)}`,
                            sub: 'Settled funds',
                            color: 'green',
                            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                        },
                        {
                            label: 'Total Payments',
                            value: `${payments.length}`,
                            sub: 'Transaction count',
                            color: 'yellow',
                            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        },
                        {
                            label: 'Pending Balance',
                            value: `${payments.reduce((acc, p) => p.status === 'pending' ? acc + parseFloat(p.amount) : acc, 0).toFixed(2)}`,
                            sub: 'Awaiting verification',
                            color: 'blue',
                            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-8 border-white/5 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                                <svg className={`w-4 h-4 text-${stat.color}-500 opacity-50`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>

                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                                <span className="text-[10px] text-zinc-700 font-black uppercase">USD</span>
                            </div>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Transactions */}
            <section className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                        <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Transaction History</h2>
                    </div>
                    <button
                        onClick={fetchPayments}
                        className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                        <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Data
                    </button>
                </div>

                <div className="glass-card overflow-hidden border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] text-zinc-600 text-[9px] uppercase tracking-[0.2em] font-black border-b border-white/5">
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Product</th>
                                    <th className="px-8 py-5 text-right">Amount</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No transactions found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-white text-sm">{p.customer_name}</div>
                                                <div className="text-[10px] font-medium text-zinc-600 mt-0.5">{p.customer_email}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase">{p.product?.name || 'Quick Link'}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-sm font-black text-white tracking-widest uppercase">
                                                    {p.amount} <span className="text-[9px] text-zinc-700 font-bold ml-1">{p.currency}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1.5">
                                                    <span className={`badge ${p.status === 'success' ? 'badge-success' : p.status === 'failed' ? 'badge-error' : 'badge-pending'} scale-90`}>
                                                        {p.status}
                                                    </span>
                                                    {p.status === 'pending' && (
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Complete this payment manually?')) {
                                                                    try {
                                                                        await api.post(`/payments/simulate-success/${p.stripe_payment_intent_id}`);
                                                                        fetchPayments();
                                                                    } catch (err) { alert('Action failed'); }
                                                                }
                                                            }}
                                                            className="text-[8px] font-black text-yellow-500/40 hover:text-yellow-500 transition-colors uppercase tracking-widest underline underline-offset-2"
                                                        >
                                                            Approve Manually
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-[10px] font-bold text-zinc-600">
                                                    <div>{new Date(p.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
                                                    <div className="text-[9px] opacity-60">{new Date(p.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Link({ href, target, className, children }) {
    return (
        <a href={href} target={target} className={className} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
            {children}
        </a>
    );
}

