'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, unit = '', color = 'yellow' }) => (
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 -mr-8 -mt-8 rounded-full blur-2xl transition-all group-hover:bg-${color}-500/10`}></div>
            <p className="text-neutral-400 text-sm font-semibold uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-4xl font-black text-white outfit italic">
                {unit && <span className="text-sm font-normal text-neutral-500 mr-1">{unit}</span>}
                {value}
            </h3>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">Platform Overview</h1>
                    <p className="text-neutral-400">Manage all platform data and growth metrics.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Freelancers"
                    value={stats?.total_users || 0}
                    color="blue"
                />
                <StatCard
                    title="Total Transactions"
                    value={stats?.total_transactions || 0}
                    color="purple"
                />
                <StatCard
                    title="Platform Volume"
                    value={(stats?.total_volume || 0).toLocaleString()}
                    unit="USD"
                    color="yellow"
                />
                <StatCard
                    title="Success Rate"
                    value={stats?.success_rate || 0}
                    unit="%"
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl relative">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                        <span className="w-1.5 h-6 bg-yellow-400 mr-3 rounded-full"></span>
                        Management Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-all text-left"
                            onClick={() => window.location.href = '/super-admin/users'}
                        >
                            <p className="font-bold text-white mb-1">User Audit</p>
                            <p className="text-xs text-neutral-500">Verify and manage user roles</p>
                        </button>
                        <button
                            className="p-4 bg-neutral-800 hover:bg-neutral-700 rounded-2xl transition-all text-left"
                            onClick={() => window.location.href = '/super-admin/payments'}
                        >
                            <p className="font-bold text-white mb-1">Payment Logs</p>
                            <p className="text-xs text-neutral-500">Track all platform revenue</p>
                        </button>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-500 mb-4 animate-pulse">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Real-time Performance</h3>
                    <p className="text-sm text-neutral-500 max-w-xs">Monitoring all payment intents across the HopiSuerte network.</p>
                </div>
            </div>
        </div>
    );
}
