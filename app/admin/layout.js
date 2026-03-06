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

        const publicPaths = [
            '/admin/login',
            '/admin/forgot-password',
            '/admin/reset-password'
        ];

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

            <div
                style={{
                    minHeight: '100vh',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <div
                    style={{
                        height: 48,
                        width: 48,
                        borderRadius: '50%',
                        borderTop: '2px solid #facc15',
                        borderBottom: '2px solid #facc15',
                        animation: 'spin 1s linear infinite'
                    }}
                />

            </div>

        );

    }


    if (
        [
            '/admin/login',
            '/admin/forgot-password',
            '/admin/reset-password'
        ].includes(pathname)
    ) {

        return <>{children}</>;

    }


    const menuItems = [

        {
            name: 'Dashboard',
            href: '/admin',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
        },

        {
            name: 'Products',
            href: '/admin/products',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        },

        {
            name: 'Settings',
            href: '/admin/profile',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0'
        }

    ];


    return (

        <div
            style={{
                minHeight: '100vh',
                background: '#000',
                color: '#fff',
                display: 'flex'
            }}
        >

            {/* Sidebar */}

            <aside
                style={{
                    width: 256,
                    background: '#0a0a0b',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >

                {/* Logo */}

                <div
                    style={{
                        padding: '28px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                    }}
                >

                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center'
                        }}
                    >

                        <div
                            style={{
                                width: 44,
                                height: 44,
                                background: '#facc15',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 6px 20px rgba(250,204,21,0.3)'
                            }}
                        >

                            <span
                                style={{
                                    color: '#000',
                                    fontWeight: 900,
                                    fontSize: 18,
                                    fontStyle: 'italic'
                                }}
                            >
                                P
                            </span>

                        </div>

                        <div>

                            <h2
                                style={{
                                    fontWeight: 800,
                                    fontSize: 18
                                }}
                            >
                                Paysigur
                            </h2>

                            <p
                                style={{
                                    fontSize: 10,
                                    color: '#777',
                                    letterSpacing: 2
                                }}
                            >
                                ADMIN PANEL
                            </p>

                        </div>

                    </div>

                </div>


                {/* Navigation */}

                <nav
                    style={{
                        flex: 1,
                        padding: '32px 16px'
                    }}
                >

                    {menuItems.map((item) => {

                        const active = pathname === item.href;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    marginBottom: 8,
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    fontSize: 13,
                                    letterSpacing: 1,
                                    background: active ? '#facc15' : 'transparent',
                                    color: active ? '#000' : '#888'
                                }}
                            >

                                <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke={active ? '#000' : '#999'}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={item.icon}
                                    />
                                </svg>

                                <span>{item.name}</span>

                            </Link>

                        );

                    })}

                </nav>


                {/* User Section */}

                <div style={{ padding: '0 16px 24px 16px' }}>

                    <div
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 14,
                            padding: 16
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                marginBottom: 14
                            }}
                        >

                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: '#000',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#facc15',
                                    fontWeight: 700
                                }}
                            >
                                {user?.name?.[0] || 'A'}
                            </div>

                            <div>

                                <p
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 700
                                    }}
                                >
                                    {user?.name}
                                </p>

                                <p
                                    style={{
                                        fontSize: 10,
                                        color: '#777'
                                    }}
                                >
                                    {user?.slug || 'Admin'}
                                </p>

                            </div>

                        </div>


                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: 10,
                                fontSize: 11,
                                fontWeight: 700,
                                color: '#ef4444',
                                border: '1px solid rgba(239,68,68,0.2)',
                                background: 'rgba(239,68,68,0.05)',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </aside>


            {/* Main Content */}

            <main
                style={{
                    flex: 1,
                    padding: 40
                }}
            >
                {children}
            </main>

        </div>

    );

}