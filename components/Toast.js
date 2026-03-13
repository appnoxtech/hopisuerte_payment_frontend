'use client';

import React, { useEffect, useState } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    XCircle,
    Info,
    X
} from 'lucide-react';

const icons = {
    success: <CheckCircle2 size={18} color="#16a34a" />,
    error: <XCircle size={18} color="#dc2626" />,
    warning: <AlertCircle size={18} color="#d97706" />,
    info: <Info size={18} color="#2563eb" />
};

const colors = {
    success: '#f0fdf4',
    error: '#fef2f2',
    warning: '#fffbeb',
    info: '#eff6ff'
};

const borderColors = {
    success: '#bbf7d0',
    error: '#fecaca',
    warning: '#fef3c7',
    info: '#dbeafe'
};

const textColors = {
    success: '#166534',
    error: '#991b1b',
    warning: '#92400e',
    info: '#1e40af'
};

export default function Toast({ message, type, onClose }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            ...toastStyle,
            background: colors[type] || colors.info,
            border: `1px solid ${borderColors[type] || borderColors.info}`,
            animation: isExiting ? 'fadeSlideOut 0.4s ease forwards' : 'fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            pointerEvents: 'auto'
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .toast-close-btn:hover {
                    background: rgba(0, 0, 0, 0.05) !important;
                    transform: scale(1.1);
                }
                .toast-close-btn:active {
                    transform: scale(0.95);
                }
            `}} />
            <div style={iconContentStyle}>
                {icons[type] || icons.info}
                <span style={{
                    ...textStyle,
                    color: textColors[type] || textColors.info
                }}>
                    {message}
                </span>
            </div>
            <button onClick={onClose} className="toast-close-btn" style={closeBtnStyle}>
                <X size={16} color={textColors[type] || textColors.info} style={{ opacity: 0.6 }} />
            </button>
        </div>
    );
}

const toastStyle = {
    padding: '14px 20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    minWidth: '320px',
    maxWidth: '480px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    userSelect: 'none',
    zIndex: 100000
};

const iconContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
};

const textStyle = {
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '1.5'
};

const closeBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '10px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

