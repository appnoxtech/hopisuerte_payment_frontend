'use client';

import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { UserProvider } from '@/context/UserContext';

export default function Providers({ children }) {
    return (
        <UserProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </UserProvider>
    );
}
