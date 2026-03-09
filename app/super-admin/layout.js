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
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = response.data;

                // You might want to use a more specific role like 'super_admin'
                if (userData.role !== 'admin' && userData.role !== 'super_admin') {
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
            if (token) {
                await api.post('/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } catch (err) {
            // silent fail is ok for logout
        } finally {
            localStorage.removeItem('super_admin_token');
            router.push('/super-admin/login');
        }
    };

    // Public pages (login, forgot password) → no layout
    if (['/super-admin/login', '/super-admin/forgot-password'].includes(pathname)) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={loadingStyle}>
                <div style={spinnerStyle} />
            </div>
        );
    }

    const navLinks = [
        { name: 'Dashboard', href: '/super-admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Users', href: '/super-admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Products', href: '/super-admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { name: 'Payments', href: '/super-admin/payments', icon: 'M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z' },
    ];

    const isActive = (href) => pathname === href;

    return (
        <div style={layoutStyle}>
            {/* Fixed Sidebar – never scrolls */}
            <aside style={sidebarStyle}>
                {/* Logo / Brand */}
                <div style={brandStyle}>
                    <div style={logoCircleStyle}>
                        <span style={logoTextStyle}>S</span>
                    </div>
                    <div>
                        <h2 style={brandTitleStyle}>SUPER ADMIN</h2>
                        <p style={brandSubtitleStyle}>CONTROL PANEL</p>
                    </div>
                </div>

                {/* Navigation */}
                <div style={navContainerStyle}>
                    <p style={sectionTitleStyle}>MAIN SYSTEM</p>

                    <nav style={navStyle}>
                        {navLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...navItemStyle,
                                    background: isActive(item.href) ? 'rgba(250,204,21,0.08)' : 'transparent',
                                    border: isActive(item.href) ? '1px solid rgba(250,204,21,0.18)' : '1px solid transparent',
                                    color: isActive(item.href) ? '#facc15' : '#d1d5db',
                                }}
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span style={navLabelStyle}>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User & Logout – pushed to bottom */}
                <div style={userSectionStyle}>
                    <div style={userCardStyle}>
                        <div style={avatarStyle}>
                            {user?.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div style={userInfoStyle}>
                            <p style={userNameStyle}>{user?.name || 'Super Admin'}</p>
                            <p style={userRoleStyle}>Full Access</p>
                        </div>
                    </div>

                    <button onClick={handleLogout} style={logoutButtonStyle}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area – this scrolls */}
            <div style={mainContentStyle}>
                <header style={headerStyle}>
                    <h1 style={pageTitleStyle}>
                        {navLinks.find(l => l.href === pathname)?.name || 'Dashboard'}
                    </h1>
                </header>

                <main style={mainStyle}>
                    <div style={contentWrapperStyle}>
                        {children}
                    </div>
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
    width: '280px',
    background: 'rgba(15,15,20,0.98)',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 30
};

const brandStyle = {
    padding: '32px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16
};

const logoCircleStyle = {
    width: 48,
    height: 48,
    background: 'linear-gradient(135deg, #facc15, #ca8a04)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(250,204,21,0.25)'
};

const logoTextStyle = {
    color: '#000',
    fontWeight: 900,
    fontSize: 26
};

const brandTitleStyle = {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
};

const brandSubtitleStyle = {
    fontSize: 10,
    color: '#71717a',
    letterSpacing: '1.5px',
    fontWeight: 700,
    textTransform: 'uppercase'
};

const navContainerStyle = {
    padding: '0 24px'
};

const sectionTitleStyle = {
    fontSize: 10,
    color: '#71717a',
    fontWeight: 900,
    letterSpacing: '1.8px',
    textTransform: 'uppercase',
    marginBottom: 20
};

const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
};

const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 16px',
    borderRadius: 10,
    textDecoration: 'none',
    transition: 'all 0.15s ease'
};

const navLabelStyle = {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.4px',
    textTransform: 'uppercase'
};

const userSectionStyle = {
    marginTop: 'auto',
    padding: '24px'
};

const userCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)'
};

const avatarStyle = {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#111',
    border: '1px solid rgba(250,204,21,0.15)',
    color: '#facc15',
    fontSize: 20,
    fontWeight: 900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const userInfoStyle = { flex: 1 };

const userNameStyle = {
    fontSize: 14,
    fontWeight: 700
};

const userRoleStyle = {
    fontSize: 11,
    color: '#71717a'
};

const logoutButtonStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 10,
    color: '#f87171',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
};

const mainContentStyle = {
    marginLeft: '280px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#050506'
};

const headerStyle = {
    height: '80px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 40px',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)'
};

const pageTitleStyle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.3px'
};

const mainStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '40px'
};

const contentWrapperStyle = {
    maxWidth: '1280px',
    margin: '0 auto'
};

const loadingStyle = {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const spinnerStyle = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '4px solid rgba(250,204,21,0.1)',
    borderTop: '4px solid #facc15',
    animation: 'spin 1s linear infinite'
};