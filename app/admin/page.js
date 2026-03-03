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
        <div className="space-y-8 bg-black">
            <div className="p-6 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-yellow-500 font-bold mb-1">Your Public Payment Link</h3>
                    <p className="text-neutral-400 text-sm">Share this URL with clients to receive payments:</p>
                    <div className="mt-2 flex items-center gap-2">
                        <code className="bg-black px-3 py-1.5 rounded-lg text-yellow-500 text-sm border border-neutral-800">
                            {paymentUrl}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(paymentUrl);
                                alert('Link copied!');
                            }}
                            className="p-1.5 hover:bg-neutral-800 rounded-lg transition-all text-xs text-neutral-500 border border-neutral-800"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                <a
                    href={paymentUrl}
                    target="_blank"
                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl text-sm font-bold transition-all text-center shadow-lg shadow-yellow-900/20"
                >
                    View Public Page
                </a>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Transaction History</h1>
                <button
                    onClick={fetchPayments}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-sm transition-all"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-neutral-900 text-neutral-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 border-b border-neutral-800">Customer</th>
                            <th className="px-6 py-4 border-b border-neutral-800">Product</th>
                            <th className="px-6 py-4 border-b border-neutral-800">Amount</th>
                            <th className="px-6 py-4 border-b border-neutral-800">Status</th>
                            <th className="px-6 py-4 border-b border-neutral-800">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-neutral-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((p) => (
                                <tr key={p.id} className="hover:bg-neutral-900/50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{p.customer_name}</div>
                                        <div className="text-xs text-neutral-500">{p.customer_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-neutral-300">{p.product?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-white">
                                            {p.amount} {p.currency}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                p.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {p.status}
                                            </span>
                                            {p.status === 'pending' && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Simulate successful payment for this transaction?')) {
                                                            try {
                                                                await api.post(`/payments/simulate-success/${p.stripe_payment_intent_id}`);
                                                                fetchPayments();
                                                            } catch (err) { alert('Simulation failed'); }
                                                        }
                                                    }}
                                                    className="text-[10px] text-yellow-500 hover:text-yellow-400 underline"
                                                >
                                                    Simulate Success
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500">
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
