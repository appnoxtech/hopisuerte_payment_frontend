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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    );

    const StatCard = ({ title, value, unit = '', color = 'yellow', icon }) => (
        <div className="glass-card p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className={`absolute -right-4 -top-4 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-colors pointer-events-none`}></div>
            <div className="relative">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                    <div className={`p-2.5 bg-${color}-500/10 rounded-xl border border-${color}-400/10`}>
                        <svg className={`w-4 h-4 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} />
                        </svg>
                    </div>
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-2 mb-2 italic">
                    {value}
                    {unit && <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest not-italic">{unit}</span>}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Live Status</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Dashboard Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Overview</h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]"></span>
                        Platform Operations Active
                    </p>
                </div>
                <button className="saas-btn-secondary gap-3 px-8 py-4 text-[10px] uppercase tracking-widest font-black h-fit shadow-lg shadow-black/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Report
                </button>
            </section>

            {/* Metrics List */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Global Statistics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={stats?.total_users || 0}
                        color="blue"
                        icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <StatCard
                        title="Total Transactions"
                        value={stats?.total_transactions || 0}
                        color="yellow"
                        icon="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                    <StatCard
                        title="Total Volume"
                        value={(stats?.total_volume || 0).toLocaleString()}
                        unit="USD"
                        color="green"
                        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <StatCard
                        title="Platform Success"
                        value={stats?.success_rate || 0}
                        unit="%"
                        color="purple"
                        icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                </div>
            </section>

            {/* Management & Status Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-12">
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-6 bg-yellow-500 rounded-full"></div>
                        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Platform Administration</h2>
                    </div>
                    <div className="glass-card p-10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-yellow-400/10 transition-colors duration-700"></div>
                        <h3 className="text-2xl font-black mb-8 text-white tracking-tighter uppercase italic">Management Access</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href="/super-admin/users"
                                className="group p-8 bg-black/40 hover:bg-white/5 border border-white/5 rounded-3xl transition-all duration-300 shadow-xl"
                            >
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all border border-blue-500/10">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <p className="font-black text-white mb-2 uppercase tracking-[0.15em] italic">Manage Users</p>
                                <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wide">View and edit registered user profiles.</p>
                            </Link>
                            <Link
                                href="/super-admin/payments"
                                className="group p-8 bg-black/40 hover:bg-white/5 border border-white/5 rounded-3xl transition-all duration-300 shadow-xl"
                            >
                                <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-400/20 transition-all border border-yellow-400/10">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="font-black text-white mb-2 uppercase tracking-[0.15em] italic">Manage Payments</p>
                                <p className="text-[11px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wide">Monitor all system-wide transactions.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                        <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">System Health</h2>
                    </div>
                    <div className="glass-card p-10 h-full flex flex-col justify-center items-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="w-24 h-24 bg-yellow-400/10 border border-yellow-400/20 rounded-3xl flex items-center justify-center text-yellow-500 mb-8 group-hover:rotate-[15deg] transition-all duration-500 shadow-[0_0_50px_rgba(251,191,36,0.05)]">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">System Monitor</h3>
                        <p className="text-xs text-zinc-500 max-w-xs font-bold leading-relaxed uppercase tracking-[0.1em]">All background services and payment channels are functioning normally.</p>

                        <div className="mt-10 flex gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-1.5 h-6 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="w-full bg-yellow-400 h-full animate-[bounce_1.5s_infinite]" style={{ animationDelay: `${i * 0.15}s` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

