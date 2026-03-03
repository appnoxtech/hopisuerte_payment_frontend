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
        if (pathname === '/super-admin/login') {
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
        { name: 'Platform Stats', href: '/super-admin', icon: '📊' },
        { name: 'User Management', href: '/super-admin/users', icon: '👥' },
        { name: 'Global Payments', href: '/super-admin/payments', icon: '💳' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Super Admin
                    </h2>
                    <p className="text-[10px] text-yellow-500/50 uppercase tracking-widest font-bold mt-1">Platform Control</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === link.href ? 'bg-yellow-400 text-black font-bold' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                        >
                            <span className="text-sm">{link.icon}</span>
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-neutral-800">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black text-xs">
                            {user?.name?.[0] || 'SA'}
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
