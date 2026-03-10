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
        const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/super-admin');
        if (!isAdminPath) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token') || localStorage.getItem('super_admin_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('super_admin_token');
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
