'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { usePathname } from 'next/navigation';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    const fetchUser = useCallback(async () => {
        const isSuperAdminPath = pathname.startsWith('/super-admin');
        const isAdminPanelPath = pathname.startsWith('/admin');
        const isResetPasswordPath = pathname === '/super-admin/reset-password' || pathname === '/admin/reset-password';
        
        if ((!isSuperAdminPath && !isAdminPanelPath) || isResetPasswordPath) {
            setLoading(false);
            return;
        }

        let token = null;
        if (isSuperAdminPath) {
            token = localStorage.getItem('super_admin_token');
        } else if (isAdminPanelPath) {
            token = localStorage.getItem('auth_token');
        }

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Use the specific token for the fetch
            const response = await api.get('/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [pathname]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(() => {
        return fetchUser();
    }, [fetchUser]);

    const logout = useCallback(() => {
        if (pathname.startsWith('/super-admin')) {
            localStorage.removeItem('super_admin_token');
        } else if (pathname.startsWith('/admin')) {
            localStorage.removeItem('auth_token');
        } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('super_admin_token');
        }
        setUser(null);
    }, [pathname]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
