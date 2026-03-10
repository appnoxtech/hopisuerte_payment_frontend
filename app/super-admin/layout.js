'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/navigation';
import api from '@/utils/api';
import Image from 'next/image';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    CreditCard,
    LogOut,
    ShieldAlert,
    BarChart3
} from 'lucide-react';
import NextLink from 'next/link';

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
            // silent fail
        } finally {
            localStorage.removeItem('super_admin_token');
            router.push('/super-admin/login');
        }
    };

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
        { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
        { name: 'Freelancers', href: '/super-admin/users', icon: Users },
        { name: 'Products', href: '/super-admin/products', icon: ShoppingBag },
        { name: 'Capital Flow', href: '/super-admin/payments', icon: CreditCard },
        { name: 'Reports', href: '/super-admin/reports', icon: BarChart3 }
    ];

    const isActive = (href) => pathname === href;

    return (
        <div style={layoutStyle}>
            {/* Background Effects */}
            <div style={overlayGlowStyle} />

            {/* Sidebar */}
            <aside style={sidebarStyle}>
                <div style={sidebarHeaderStyle}>
                    <div style={logoWrapperStyle}>
                        <Image
                            src="/paysigur.png"
                            alt="Paysigur"
                            width={110}
                            height={40}
                            priority
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <div style={navDividerStyle} />

                <nav style={navContainerStyle}>
                    {navLinks.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <NextLink
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...navItemStyle,
                                    background: active ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                                    color: active ? '#fbbf24' : '#a1a1aa',
                                    border: `1px solid ${active ? 'rgba(251, 191, 36, 0.2)' : 'transparent'}`,
                                }}
                            >
                                <Icon size={18} style={{ opacity: active ? 1 : 0.6 }} />
                                <span>{item.name}</span>
                                {active && <div style={activeIndicatorStyle} />}
                            </NextLink>
                        );
                    })}
                </nav>

                <div style={userFooterStyle}>
                    <div style={userBriefStyle}>
                        <div style={userAvatarStyle}>
                            {user?.name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div style={userDetailsStyle}>
                            <p style={userNameStyle}>{user?.name || 'Super Admin'}</p>
                            <p style={userBadgeStyle}>Super User</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={logoutBtnStyle}>
                        <LogOut size={16} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={mainContentAreaStyle}>
                <header style={topHeaderStyle}>
                    <div style={headerLeftStyle}>
                        <h2 style={headerTitleStyle}>
                            {navLinks.find(l => l.href === pathname)?.name || 'Control Terminal'}
                        </h2>
                        <div style={breadcrumbStyle}>
                            <span>Nexus Admin</span>
                            <span style={{ color: '#52525b' }}>/</span>
                            <span>{navLinks.find(l => l.href === pathname)?.name || 'Home'}</span>
                        </div>
                    </div>
                    <div style={headerRightStyle}>
                        <ShieldAlert size={14} color="#fbbf24" />
                        <span style={statusTextStyle}>Full System Access</span>
                    </div>
                </header>

                <main style={mainViewStyle}>
                    <div style={pageInnerStyle}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

const layoutStyle = {
    minHeight: '100vh',
    background: '#050506',
    color: '#fff',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: "'Inter', sans-serif"
};

const overlayGlowStyle = {
    position: 'absolute',
    top: -200,
    right: -200,
    width: 600,
    height: 600,
    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0
};

const sidebarStyle = {
    width: '260px',
    background: '#0a0a0c',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
    boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
};

const sidebarHeaderStyle = {
    padding: '20px 24px',
};

const logoWrapperStyle = {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const navDividerStyle = {
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05) 50%, transparent)',
    margin: '0 24px 24px'
};

const navContainerStyle = {
    padding: '0 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
};

const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    letterSpacing: '0.01em'
};

const activeIndicatorStyle = {
    position: 'absolute',
    left: '0',
    top: '25%',
    bottom: '25%',
    width: '2px',
    background: '#fbbf24',
    borderRadius: '0 4px 4px 0',
    boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
};

const userFooterStyle = {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.01)'
};

const userBriefStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
};

const userAvatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #18181b, #09090b)',
    border: '1px solid rgba(251, 191, 36, 0.15)',
    color: '#fbbf24',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '14px'
};

const userDetailsStyle = {
    flex: 1,
    overflow: 'hidden'
};

const userNameStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const userBadgeStyle = {
    fontSize: '10px',
    color: '#71717a',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const logoutBtnStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    color: '#a1a1aa',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const mainContentAreaStyle = {
    paddingLeft: '260px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    zIndex: 1
};

const topHeaderStyle = {
    height: '64px',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(5, 5, 6, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 40
};

const headerTitleStyle = {
    fontSize: '16px',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.02em'
};

const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: '600',
    color: '#52525b',
    marginTop: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const headerLeftStyle = { display: 'flex', flexDirection: 'column' };

const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '20px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.1)'
};

const statusTextStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#fbbf24',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const mainViewStyle = {
    flex: 1,
    padding: '32px',
    overflowY: 'auto'
};

const pageInnerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
};

const loadingStyle = {
    minHeight: '100vh',
    background: '#050506',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const spinnerStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(251, 191, 36, 0.1)',
    borderTop: '3px solid #fbbf24',
    animation: 'spin 1s linear infinite'
};