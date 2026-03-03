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
        if (pathname === '/admin/login') {
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
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        HopiSuerte Admin
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        href="/admin"
                        className={`block px-4 py-3 rounded-xl transition-all ${pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                    >
                        Transactions
                    </Link>
                    <Link
                        href="/admin/products"
                        className={`block px-4 py-3 rounded-xl transition-all ${pathname === '/admin/products' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                    >
                        Manage Products
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all text-left"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
