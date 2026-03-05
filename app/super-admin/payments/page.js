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

    if (loading && payments.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Global Payments</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        Platform Transaction History
                    </p>
                </div>
                <button
                    onClick={fetchPayments}
                    disabled={loading}
                    className="saas-btn-secondary gap-3 px-8 py-4 text-[10px] uppercase tracking-widest font-black h-fit shadow-lg shadow-black/20 disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Payments
                </button>
            </section>

            {/* Payment Table */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Transaction Records</h2>
                </div>

                <div className="glass-card overflow-hidden border-white/5 group shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                    <th className="px-10 py-6 border-b border-white/5">Freelancer</th>
                                    <th className="px-10 py-6 border-b border-white/5">Customer</th>
                                    <th className="px-10 py-6 border-b border-white/5">Product</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-right">Amount</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-center">Status</th>
                                    <th className="px-10 py-6 border-b border-white/5 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 opacity-40 group-hover:rotate-12 transition-transform duration-700">
                                                    <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-zinc-600 font-black uppercase tracking-widest mb-2">No Payments</h3>
                                                <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest">No transactions have been recorded on the platform yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="group/row hover:bg-white/[0.04] transition-all duration-300">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 font-black text-lg italic uppercase group-hover/row:border-yellow-500/30 group-hover/row:text-yellow-500 transition-all duration-500">
                                                        {payment.product?.user?.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg text-white mb-1 uppercase tracking-tighter italic group-hover/row:text-yellow-400 transition-colors duration-300">{payment.product?.user?.name || 'Deleted User'}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Verified User</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div>
                                                    <p className="font-black text-white mb-1.5 uppercase tracking-tighter group-hover/row:tracking-tight hover:text-yellow-400 transition-all duration-300 italic">{payment.customer_name}</p>
                                                    <div className="flex items-center gap-2 text-zinc-600">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                        <span className="text-[10px] font-black font-mono tracking-widest uppercase">{payment.customer_email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="inline-flex items-center px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/row:border-white/10 group-hover/row:text-white transition-all duration-500">
                                                    {payment.product?.name || 'Deleted Product'}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-2xl font-black text-white tracking-tighter italic group-hover/row:text-green-400 transition-colors duration-500">
                                                        {(payment.amount || 0).toLocaleString()} <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] not-italic ml-1">{payment.currency}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`badge ${payment.status === 'success' ? 'badge-success' : payment.status === 'failed' ? 'badge-error' : 'badge-pending'} uppercase tracking-tighter px-5 py-1.5 font-black italic shadow-2xl`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span className="text-xs font-black text-white tracking-widest uppercase">{new Date(payment.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">{new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
