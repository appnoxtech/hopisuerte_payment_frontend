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

    if (loading) return <div>Loading transactions...</div>;

    const paymentUrl = `${window.location.origin}/u/${user?.slug}`;

    return (
        <div className="space-y-8">
            <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-blue-400 font-bold mb-1">Your Public Payment Link</h3>
                    <p className="text-slate-400 text-sm">Share this URL with clients to receive payments:</p>
                    <div className="mt-2 flex items-center gap-2">
                        <code className="bg-[#0f172a] px-3 py-1.5 rounded-lg text-blue-300 text-sm border border-slate-700">
                            {paymentUrl}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(paymentUrl);
                                alert('Link copied!');
                            }}
                            className="p-1.5 hover:bg-slate-700 rounded-lg transition-all text-xs text-slate-400 border border-slate-700"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <a
                    href={paymentUrl}
                    target="_blank"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all text-center"
                >
                    View Public Page
                </a>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Transaction History</h1>
                <button
                    onClick={fetchPayments}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-800/30 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{p.customer_name}</div>
                                        <div className="text-xs text-slate-400">{p.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300">{p.product?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-white">
                                            {p.amount} {p.currency}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                            p.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400">
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
