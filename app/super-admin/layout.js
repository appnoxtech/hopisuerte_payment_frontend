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
    BarChart3,
    User
} from 'lucide-react';
import NextLink from 'next/link';

import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export default function SuperAdminLayout({ children }) {
    const { user, loading, logout: contextLogout } = useUser();
    const { showToast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const publicPaths = ['/super-admin/login', '/super-admin/forgot-password'];

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            showToast('Logout successfully', 'success');
        } catch (err) {
            // silent fail
        } finally {
            contextLogout();
            router.push('/super-admin/login');
        }
    };

    useEffect(() => {
        if (!loading && !publicPaths.includes(pathname)) {
            if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
                router.push('/super-admin/login');
            }
        }
    }, [user, loading, pathname, router]);

    if (publicPaths.includes(pathname)) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F7F9FC" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2.5px solid #0070E0', borderBottom: '2.5px solid #E2E8F0', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return null;
    }

    const navLinks = [
        { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
        { name: 'Merchants', href: '/super-admin/users', icon: Users },
        { name: 'Products', href: '/super-admin/products', icon: ShoppingBag },
        { name: 'Transactions', href: '/super-admin/payments', icon: CreditCard },
        { name: 'Reports', href: '/super-admin/reports', icon: BarChart3 },
        { name: 'Profile Settings', href: '/super-admin/profile', icon: User }
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
                            width={160}
                            height={80}
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
                                    background: active ? '#0070E0' : 'transparent',
                                    color: active ? '#FFFFFF' : '#A0AEC0',
                                }}
                            >
                                <Icon size={18} style={{ opacity: active ? 1 : 0.7 }} />
                                <span>{item.name}</span>
                                {active && <div style={activeIndicatorStyle} />}
                            </NextLink>
                        );
                    })}
                </nav>

                <div style={userFooterStyle}>
                    <div style={userBriefStyle}>
                        <div style={userAvatarStyle}>
                            {user?.profile_image_url ? (
                                <img src={user.profile_image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                            ) : (
                                user?.name?.[0]?.toUpperCase() || ''
                            )}
                        </div>
                        <div style={userDetailsStyle}>
                            <p style={userNameStyle}>{user?.name || ''}</p>
                            <p style={userBadgeStyle}>Super User</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={logoutBtnStyle}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={mainContentAreaStyle}>
                <header style={topHeaderStyle}>
                    <div style={headerLeftStyle}>
                        <h2 style={headerTitleStyle}>
                            {navLinks.find(l => l.href === pathname)?.name || 'Platform Admin'}
                        </h2>
                        <div style={breadcrumbStyle}>
                            <span>Paysigur Terminal</span>
                            <span style={{ color: '#CBD5E1' }}>/</span>
                            <span>{navLinks.find(l => l.href === pathname)?.name || 'Home'}</span>
                        </div>
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
    background: '#F7F9FC',
    color: '#1A1F36',
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
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.04) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0
};

const sidebarStyle = {
    width: '260px',
    background: '#1A1F36',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
    boxShadow: '4px 0 20px rgba(0, 28, 100, 0.05)'
};

const sidebarHeaderStyle = {
    padding: '20px 24px',
};

const logoWrapperStyle = {
    // marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const navDividerStyle = {
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
    margin: '0 24px 20px'
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
    width: '3px',
    background: '#FFFFFF',
    borderRadius: '0 4px 4px 0',
};

const userFooterStyle = {
    padding: '24px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)'
};

const userBriefStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
};

const userAvatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: '#0070E0',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '15px'
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
    color: '#A0AEC0',
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
    padding: '12px',
    background: '#0070E0',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)'
};

const mainContentAreaStyle = {
    paddingLeft: '260px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
};

const topHeaderStyle = {
    height: '72px',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 40
};

const headerTitleStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#001C64',
    margin: 0,
    letterSpacing: '-0.02em',
    fontFamily: "'Outfit', sans-serif"
};

const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    marginTop: '2px',
    letterSpacing: '0.01em'
};

const headerLeftStyle = { display: 'flex', flexDirection: 'column' };

const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    background: 'rgba(0, 112, 224, 0.05)',
    border: '1px solid rgba(0, 112, 224, 0.1)'
};

const statusTextStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: '#0070E0',
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
    background: '#F7F9FC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const spinnerStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid #E2E8F0',
    borderTop: '3px solid #0070E0',
    animation: 'spin 1s linear infinite'
};