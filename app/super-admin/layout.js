'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

export default function SuperAdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check on the login page itself
        const publicPaths = ['/super-admin/login', '/super-admin/forgot-password'];
        if (publicPaths.includes(pathname)) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('super_admin_token');
                if (!token) {
                    router.push('/super-admin/login');
                    return;
                }

                // Use the super_admin_token for this request
                const response = await api.get('/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data;

                if (userData.role !== 'admin') {
                    localStorage.removeItem('super_admin_token');
                    router.push('/super-admin/login');
                    return;
                }

                setUser(userData);
            } catch (err) {
                localStorage.removeItem('super_admin_token');
                router.push('/super-admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('super_admin_token');
            await api.post('/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) { }
        localStorage.removeItem('super_admin_token');
        router.push('/super-admin/login');
    };

    // On the login page, render children directly (no sidebar)
    if (pathname === '/super-admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const navLinks = [
        { name: 'Dashboard', href: '/super-admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Users', href: '/super-admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Payments', href: '/super-admin/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden selection:bg-yellow-500 selection:text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0a0b] border-r border-white/5 flex flex-col items-stretch z-30 relative shadow-2xl">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-black font-black text-xl italic">S</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-white uppercase">
                                SuperAdmin
                            </h2>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest -mt-0.5">Control Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${pathname === item.href
                                ? 'bg-yellow-500 text-black font-black shadow-lg shadow-yellow-500/10'
                                : 'text-zinc-500 hover:text-white hover:bg-white/[0.03] border border-transparent'}`}
                        >
                            <svg className={`w-4 h-4 ${pathname === item.href ? 'text-black' : 'text-zinc-600 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                            </svg>
                            <span className="text-[12px] uppercase font-black tracking-widest">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 relative overflow-hidden group/card shadow-xl">
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center font-black text-yellow-500">
                                {user?.name?.[0] || 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white truncate uppercase">{user?.name}</p>
                                <p className="text-[9px] text-zinc-600 font-bold truncate uppercase tracking-widest italic font-bold">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[9px] font-black text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all uppercase tracking-widest"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#070708]">
                {/* Header / Topbar */}
                <header className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 z-20">
                    <div>
                        <div className="flex items-center gap-2 text-zinc-700 mb-0.5">
                            <span className="text-[9px] font-black uppercase tracking-widest">HopiSuerte /</span>
                            <span className="text-[9px] font-black text-yellow-500/40 uppercase tracking-widest">Super Admin</span>
                        </div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
                            {navLinks.find(l => l.href === pathname)?.name || 'Admin Panel'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-400/5 rounded-full border border-yellow-400/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                            <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">System Active</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-10 relative">
                    <div className="animate-fade-in max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

