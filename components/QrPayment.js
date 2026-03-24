'use client';

import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { QrCode, ExternalLink, Clock, AlertCircle } from 'lucide-react';

const POLL_INTERVAL_MS = 2000;
const EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export default function QrPayment({ paymentLinkUrl, paymentId, amount, currency }) {
    const router = useRouter();
    const [expired, setExpired] = useState(false);
    const [status, setStatus] = useState('pending');
    const intervalRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!paymentId) return;

        // Start polling
        intervalRef.current = setInterval(async () => {
            try {
                const res = await api.get(`/payments/${paymentId}/status`);
                const newStatus = res.data.status;
                setStatus(newStatus);

                if (newStatus === 'success') {
                    clearInterval(intervalRef.current);
                    clearTimeout(timerRef.current);
                    router.push('/success');
                } else if (newStatus === 'failed') {
                    clearInterval(intervalRef.current);
                    clearTimeout(timerRef.current);
                }
            } catch {
                // Silently ignore polling errors
            }
        }, POLL_INTERVAL_MS);

        // Set expiry timeout
        timerRef.current = setTimeout(() => {
            clearInterval(intervalRef.current);
            setExpired(true);
        }, EXPIRY_MS);

        // Cleanup on unmount
        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timerRef.current);
        };
    }, [paymentId, router]);

    const formatAmount = (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return '0.00';
        if (mounted) {
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return num.toFixed(2);
    };

    if (expired) {
        return (
            <div style={containerStyle}>
                <div style={iconWrapStyle}>
                    <AlertCircle size={40} color="#EF4444" />
                </div>
                <h3 style={{ ...titleStyle, color: '#EF4444' }}>Payment Link Expired</h3>
                <p style={subtitleStyle}>
                    This QR code has expired after 10 minutes of inactivity.
                    Please go back and try again.
                </p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div style={containerStyle}>
                <div style={iconWrapStyle}>
                    <AlertCircle size={40} color="#EF4444" />
                </div>
                <h3 style={{ ...titleStyle, color: '#EF4444' }}>Payment Failed</h3>
                <p style={subtitleStyle}>
                    Something went wrong with the payment. Please go back and try again.
                </p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* QR Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <QrCode size={22} color="#0070E0" />
                <h3 style={titleStyle}>Scan to Pay</h3>
            </div>

            <p style={subtitleStyle}>
                Scan with your phone camera to complete payment
            </p>

            {/* QR Code */}
            <div style={qrWrapStyle}>
                <QRCodeSVG
                    value={paymentLinkUrl}
                    size={240}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#1A1F36"
                />
            </div>

            {/* Amount badge */}
            <div style={amountBadgeStyle} className="notranslate" suppressHydrationWarning>
                {currency} {formatAmount(amount)}
            </div>

            {/* Polling indicator */}
            <div style={pollingStyle}>
                <div style={pulseStyle} />
                <span>Waiting for payment confirmation...</span>
            </div>

            {/* Fallback link */}
            <a
                href={paymentLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
            >
                <ExternalLink size={14} />
                Open payment link
            </a>

            {/* Timer hint */}
            <div style={timerStyle}>
                <Clock size={12} />
                <span>Link expires in 10 minutes</span>
            </div>
        </div>
    );
}

/* ---------- STYLES ---------- */

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '8px 0',
};

const iconWrapStyle = {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: '#FEF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
};

const titleStyle = {
    fontSize: 18,
    fontWeight: 800,
    color: '#001C64',
    margin: 0,
    letterSpacing: '-0.01em',
    fontFamily: "'Outfit', sans-serif",
};

const subtitleStyle = {
    fontSize: 14,
    color: '#6B7C93',
    fontWeight: 500,
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 1.5,
};

const qrWrapStyle = {
    background: '#FFFFFF',
    border: '2px solid #E3E8EF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06)',
};

const amountBadgeStyle = {
    display: 'inline-block',
    padding: '8px 20px',
    background: '#F0F7FF',
    border: '1px solid #BFDBFE',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 800,
    color: '#0070E0',
    marginBottom: 20,
};

const pollingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#6B7C93',
    fontWeight: 600,
    marginBottom: 20,
};

const pulseStyle = {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#16a34a',
    animation: 'pulse 1.5s ease-in-out infinite',
};

const linkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    color: '#0070E0',
    textDecoration: 'none',
    padding: '10px 20px',
    background: '#F0F7FF',
    borderRadius: 10,
    border: '1px solid #BFDBFE',
    transition: 'all 0.2s ease',
    marginBottom: 16,
};

const timerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 500,
};
