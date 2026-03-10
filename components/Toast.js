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
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <XCircle size={18} color="#f43f5e" />,
    warning: <AlertCircle size={18} color="#fbbf24" />,
    info: <Info size={18} color="#6366f1" />
};

const colors = {
    success: 'rgba(16, 185, 129, 0.1)',
    error: 'rgba(244, 63, 94, 0.1)',
    warning: 'rgba(251, 191, 36, 0.1)',
    info: 'rgba(99, 102, 241, 0.1)'
};

const borderColors = {
    success: 'rgba(16, 185, 129, 0.2)',
    error: 'rgba(244, 63, 94, 0.2)',
    warning: 'rgba(251, 191, 36, 0.2)',
    info: 'rgba(99, 102, 241, 0.2)'
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
            <div style={iconContentStyle}>
                {icons[type] || icons.info}
                <span style={textStyle}>{message}</span>
            </div>
            <button onClick={onClose} style={closeBtnStyle}>
                <X size={14} color="#71717a" />
            </button>
        </div>
    );
}

const toastStyle = {
    padding: '12px 16px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    backdropFilter: 'blur(16px)',
    minWidth: '300px',
    maxWidth: '450px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    userSelect: 'none'
};

const iconContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const textStyle = {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    lineHeight: '1.4'
};

const closeBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background 0.2s',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)'
    }
};
