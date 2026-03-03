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

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/super-admin/payments', getSuperAdminHeaders());
                setPayments(response.data);
            } catch (err) {
                console.error('Failed to fetch payments:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 italic outfit">Global Revenue</h1>
                    <p className="text-neutral-400">Monitoring all platform-wide payment flows.</p>
                </div>
            </header>

            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-800 text-neutral-400 text-xs uppercase tracking-widest font-black">
                            <th className="px-6 py-5">Platform Vendor</th>
                            <th className="px-6 py-5">Customer Info</th>
                            <th className="px-6 py-5">Product/Plan</th>
                            <th className="px-6 py-5">Revenue</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-neutral-500 italic">No transactions found across the platform.</td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-neutral-800/50 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs text-neutral-400 font-bold mr-3">
                                                {payment.product?.user?.name?.[0]}
                                            </div>
                                            <div className="text-sm">
                                                <p className="font-bold text-white mb-0.5">{payment.product?.user?.name}</p>
                                                <p className="text-neutral-500 text-xs uppercase tracking-tighter">Freelancer</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="font-bold text-white mb-0.5">{payment.customer_name}</p>
                                            <p className="text-sm text-neutral-500">{payment.customer_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-white text-sm font-semibold">{payment.product?.name || 'Deleted Product'}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-yellow-500 font-black outfit italic">{(payment.amount || 0).toLocaleString()} {payment.currency}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right text-xs text-neutral-500 font-mono">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                        <br />
                                        {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
