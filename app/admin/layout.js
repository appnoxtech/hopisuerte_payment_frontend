'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import {  Settings2 } from 'lucide-react';

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
                // Note: assuming the token is automatically attached via api interceptor
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
        } catch (err) {
            // silent fail
        } finally {
            localStorage.removeItem('auth_token');
            router.push('/admin/login');
        }
    };

    // Show only content on public auth pages
    if (
        [
            '/admin/login',
            '/admin/forgot-password',
            '/admin/reset-password'
        ].includes(pathname)
    ) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={spinnerStyle} />
            </div>
        );
    }

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/admin',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
        },
        {
            name: 'Products',
            href: '/admin/products',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
        },
        {
            name: 'Settings',
            href: '/admin/profile',
            icon: {Settings2}
        }
    ];

    const isActive = (href) => pathname === href;

    return (
        <div style={layoutStyle}>
            {/* Fixed Sidebar */}
            <aside style={sidebarStyle}>
                {/* Brand / Logo */}
                <div style={brandContainerStyle}>
                    <div style={logoContainerStyle}>
                        <span style={logoLetterStyle}>P</span>
                    </div>
                    <div>
                        <h2 style={brandNameStyle}>PAYSIGUR</h2>
                        <p style={brandSubtitleStyle}>ADMIN PANEL</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={navStyle}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                ...navItemBaseStyle,
                                background: isActive(item.href) ? 'rgba(250,204,21,0.09)' : 'transparent',
                                borderLeft: isActive(item.href) ? '3px solid #facc15' : '3px solid transparent',
                                color: isActive(item.href) ? '#facc15' : '#d1d5db'
                            }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={item.icon}
                                />
                            </svg>
                            <span style={navLabelStyle}>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User & Logout Section */}
                <div style={userSectionStyle}>
                    <div style={userCardStyle}>
                        <div style={avatarStyle}>
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div style={userInfoStyle}>
                            <div style={userNameStyle}>{user?.name || 'Admin'}</div>
                            <div style={userRoleStyle}>{user?.slug || 'Administrator'}</div>
                        </div>
                    </div>

                    <button onClick={handleLogout} style={logoutButtonStyle}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Scrollable Main Content */}
            <div style={mainWrapperStyle}>
                <main style={mainContentStyle}>
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────── */
/*                  STYLES                          */
/* ────────────────────────────────────────────── */

const layoutStyle = {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    display: 'flex',
    overflow: 'hidden'
};

const sidebarStyle = {
    width: '260px',
    background: 'rgba(10,10,15,0.98)',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 20
};

const brandContainerStyle = {
    padding: '28px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    borderBottom: '1px solid rgba(255,255,255,0.04)'
};

const logoContainerStyle = {
    width: 48,
    height: 48,
    background: '#facc15',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(250,204,21,0.35)'
};

const logoLetterStyle = {
    color: '#000',
    fontWeight: 900,
    fontSize: 24,
    fontStyle: 'italic'
};

const brandNameStyle = {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: '0.6px'
};

const brandSubtitleStyle = {
    fontSize: 10,
    color: '#71717a',
    letterSpacing: '1.6px',
    fontWeight: 700,
    textTransform: 'uppercase'
};

const navStyle = {
    flex: 1,
    padding: '32px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4
};

const navItemBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.3px',
    transition: 'all 0.15s ease'
};

const navLabelStyle = {
    textTransform: 'uppercase'
};

const userSectionStyle = {
    padding: '24px 16px'
};

const userCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    padding: 14,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12
};

const avatarStyle = {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: '#111',
    border: '1px solid rgba(250,204,21,0.15)',
    color: '#facc15',
    fontSize: 18,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const userInfoStyle = { flex: 1 };

const userNameStyle = {
    fontSize: 13,
    fontWeight: 700
};

const userRoleStyle = {
    fontSize: 11,
    color: '#71717a',
    marginTop: 2
};

const logoutButtonStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(239,68,68,0.07)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 10,
    color: '#f87171',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
};

const mainWrapperStyle = {
    marginLeft: '260px',
    flex: 1,
    minHeight: '100vh',
    background: '#050506'
};

const mainContentStyle = {
    flex: 1,
    padding: '40px',
    overflowY: 'auto'
};

const loadingContainerStyle = {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const spinnerStyle = {
    width: 52,
    height: 52,
    borderRadius: '50%',
    border: '4px solid rgba(250,204,21,0.12)',
    borderTop: '4px solid #facc15',
    animation: 'spin 1s linear infinite'
};