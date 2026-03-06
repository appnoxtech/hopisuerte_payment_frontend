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

    if (['/super-admin/login', '/super-admin/forgot-password'].includes(pathname)) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    borderTop: "3px solid #eab308",
                    borderBottom: "3px solid #eab308",
                    animation: "spin 1s linear infinite"
                }} />
            </div>
        );
    }

    const navLinks = [
        { name: 'Dashboard', href: '/super-admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Users', href: '/super-admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Payments', href: '/super-admin/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "#000",
            color: "#fff",
            display: "flex",
            overflow: "hidden"
        }}>

            {/* Sidebar */}
            <aside style={{
                width: "288px",
                background: "#09090b",
                borderRight: "1px solid rgba(255,255,255,0.04)",
                display: "flex",
                flexDirection: "column"
            }}>

                <div style={{ padding: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            background: "linear-gradient(135deg,#facc15,#eab308,#ca8a04)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 20px rgba(234,179,8,0.2)"
                        }}>
                            <span style={{
                                color: "#000",
                                fontWeight: "900",
                                fontSize: "22px"
                            }}>S</span>
                        </div>

                        <div>
                            <h2 style={{
                                fontSize: "18px",
                                fontWeight: "900",
                                textTransform: "uppercase"
                            }}>
                                SuperAdmin
                            </h2>
                            <p style={{
                                fontSize: "10px",
                                color: "#71717a",
                                letterSpacing: "0.2em"
                            }}>
                                Control Panel
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px" }}>
                    <p style={{
                        fontSize: "10px",
                        color: "#71717a",
                        fontWeight: "900",
                        letterSpacing: "0.2em",
                        marginBottom: "24px"
                    }}>
                        Main System
                    </p>

                    <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {navLinks.map(item => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "12px 16px",
                                        borderRadius: "12px",
                                        border: active ? "1px solid rgba(234,179,8,0.2)" : "1px solid transparent",
                                        background: active ? "rgba(234,179,8,0.08)" : "transparent",
                                        color: active ? "#eab308" : "#a1a1aa",
                                        textDecoration: "none"
                                    }}
                                >
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                                    </svg>

                                    <span style={{
                                        fontSize: "12px",
                                        fontWeight: "900",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase"
                                    }}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ marginTop: "auto", padding: "24px" }}>
                    <div style={{
                        padding: "24px",
                        borderRadius: "24px",
                        border: "1px solid rgba(255,255,255,0.05)",
                        background: "rgba(255,255,255,0.02)"
                    }}>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginBottom: "20px"
                        }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "16px",
                                background: "#000",
                                border: "1px solid rgba(255,255,255,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#eab308",
                                fontWeight: "900"
                            }}>
                                {user?.name?.[0] || 'S'}
                            </div>

                            <div>
                                <p style={{ fontSize: "12px", fontWeight: "900" }}>{user?.name}</p>
                                <p style={{ fontSize: "9px", color: "#71717a" }}>Administrator Access</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "14px",
                                border: "1px solid rgba(239,68,68,0.2)",
                                background: "rgba(239,68,68,0.05)",
                                color: "#ef4444",
                                fontWeight: "900",
                                cursor: "pointer"
                            }}
                        >
                            Logout Session
                        </button>

                    </div>
                </div>

            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                background: "#070708"
            }}>

                <header style={{
                    height: "80px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 40px"
                }}>
                    <h1 style={{
                        fontSize: "20px",
                        fontWeight: "900"
                    }}>
                        {navLinks.find(l => l.href === pathname)?.name || 'Admin Panel'}
                    </h1>
                </header>

                <main style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "40px"
                }}>
                    <div style={{
                        maxWidth: "1200px",
                        margin: "0 auto"
                    }}>
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}