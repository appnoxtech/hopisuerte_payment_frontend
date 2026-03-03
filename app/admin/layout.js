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
        if (pathname === '/admin/login' || pathname === '/admin/register') {
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

    if (pathname === '/admin/login' || pathname === '/admin/register') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        HopiSuerte Admin
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link
                        href="/admin"
                        className={`block px-4 py-3 rounded-xl transition-all ${pathname === '/admin' ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Transactions
                    </Link>
                    <Link
                        href="/admin/products"
                        className={`block px-4 py-3 rounded-xl transition-all ${pathname === '/admin/products' ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Manage Products
                    </Link>
                    <Link
                        href="/admin/profile"
                        className={`block px-4 py-3 rounded-xl transition-all ${pathname === '/admin/profile' ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                        Profile Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-neutral-800">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black text-xs">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-neutral-500 text-xs truncate">{user?.email}</p>
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
            <main className="flex-1 overflow-y-auto p-8 bg-black">
                {children}
            </main>
        </div>
    );
}
