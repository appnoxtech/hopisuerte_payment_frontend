'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    LogOut,
    ShieldCheck,
    BarChart3,
    Box,
    Webhook,
    KeyRound
} from 'lucide-react';
import Image from 'next/image';

import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLayout({ children }) {
    const { user, loading, logout: contextLogout } = useUser();
    const { showToast } = useToast();

    const router = useRouter();
    const pathname = usePathname();

    const publicPaths = [
        '/merchant/login',
        '/merchant/forgot-password',
        '/merchant/reset-password',
        '/super-admin/login'
    ];

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            showToast('Logout successfully', 'success');
        } catch (err) {
            // silent fail
        } finally {
            contextLogout();
            router.push('/merchant/login');
        }
    };

    const normalizedPath = pathname?.replace(/\/$/, '') || '';

    useEffect(() => {
        if (!loading && !user && !publicPaths.includes(normalizedPath)) {
            router.push('/merchant/login');
        }
        if (!loading && user && user.role === 'admin' && !publicPaths.includes(normalizedPath)) {
            router.push('/super-admin');
        }
        if (!loading && user && publicPaths.includes(normalizedPath)) {
            if (user.role === 'admin' || user.role === 'super_admin') {
                router.push('/super-admin');
            } else {
                router.push('/merchant');
            }
        }
    }, [user, loading, normalizedPath, router]);

    if (publicPaths.includes(normalizedPath)) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F7F9FC" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/merchant',
            icon: LayoutDashboard
        },
        {
            name: 'Products',
            href: '/merchant/products',
            icon: Box
        },
        {
            name: 'Reports',
            href: '/merchant/reports',
            icon: BarChart3
        },
        {
            name: 'Webhooks',
            href: '/merchant/webhooks',
            icon: Webhook
        },
        {
            name: 'API Keys',
            href: '/merchant/api-keys',
            icon: KeyRound
        }
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
                            src="/logo-full.jpg"
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
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...navItemStyle,
                                    background: active ? '#0070E0' : 'transparent',
                                    color: active ? '#FFF' : 'rgba(255, 255, 255, 0.6)',
                                    border: `1px solid ${active ? '#0070E0' : 'transparent'}`,
                                }}
                                className="transition-all duration-200 hover:bg-white/10 hover:text-white group"
                            >
                                <Icon
                                    size={18}
                                    style={{ opacity: active ? 1 : 0.6 }}
                                    className="transition-opacity group-hover:opacity-100"
                                />
                                <span className="transition-colors group-hover:text-white">{item.name}</span>
                                {active && <div style={activeIndicatorStyle} />}
                            </Link>
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
                            <p style={userBadgeStyle}>{user?.slug || ''}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={logoutBtnStyle} className="hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all">
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
                            {menuItems.find(l => l.href === pathname)?.name || 'Command Center'}
                        </h2>
                        <div style={breadcrumbStyle}>
                            <span>Merchant Portal</span>
                            <span style={{ color: '#94A3B8' }}>/</span>
                            <span>{menuItems.find(l => l.href === pathname)?.name || 'Home'}</span>
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
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0
};

const sidebarStyle = {
    width: '260px',
    background: '#1A1F36',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: 50,
    boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
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
    width: '3px',
    background: '#FFF',
    borderRadius: '0 4px 4px 0'
};

const userFooterStyle = {
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.1)'
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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px'
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
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '500',
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
    borderRadius: '12px',
    color: '#FFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
    borderBottom: '1px solid #E3E8EF',
    position: 'sticky',
    top: 0,
    zIndex: 40
};

const headerTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1F36',
    margin: 0,
    letterSpacing: '-0.02em'
};

const breadcrumbStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6B7C93',
    marginTop: '4px'
};

const headerLeftStyle = { display: 'flex', flexDirection: 'column' };

const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.05)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
};

const statusTextStyle = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#10b981',
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
    border: '3px solid rgba(0, 112, 224, 0.1)',
    borderTop: '3px solid #0070E0',
    animation: 'spin 1s linear infinite'
};
