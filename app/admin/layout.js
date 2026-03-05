'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const publicPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];
        if (publicPaths.includes(pathname)) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (err) {
                localStorage.removeItem('auth_token');
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (err) { }
        localStorage.removeItem('auth_token');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden selection:bg-yellow-500 selection:text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a0a0b] border-r border-white/5 flex flex-col items-stretch z-30 relative shadow-2xl">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-black font-black text-xl italic">H</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-white uppercase">
                                HopiSuerte
                            </h2>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest -mt-0.5">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {[
                        { name: 'Dashboard', href: '/admin', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                        { name: 'Products', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                        { name: 'Settings', href: '/admin/profile', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
                    ].map((item) => (
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
                                {user?.name?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white truncate uppercase">{user?.name}</p>
                                <p className="text-[9px] text-zinc-600 font-bold truncate uppercase tracking-widest">{user?.slug || 'Admin'}</p>
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
                            <span className="text-[9px] font-black text-yellow-500/40 uppercase tracking-widest">
                                {pathname === '/admin' ? 'Home' : 'Panel'}
                            </span>
                        </div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">
                            {pathname === '/admin' ? 'Dashboard' :
                                pathname === '/admin/products' ? 'Products' :
                                    'Account Settings'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-full border border-green-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">System Online</span>
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

