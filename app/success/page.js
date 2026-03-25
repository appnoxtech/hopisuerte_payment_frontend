'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div style={mainStyle}>
            {/* Background Glow */}
            <div style={glowStyle} />

            <div style={containerStyle}>
                {/* Logo */}
                <div style={logoWrap}>
                    <Image
                        src="/paysigur.png"
                        alt="Paysigur"
                        width={300}
                        height={90}
                        priority
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                {/* Card */}
                <div style={cardStyle} className="transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-2xl hover:border-[#0070E0] hover:bg-[#F0F7FF]/30">
                    {/* Success Icon */}
                    <div style={iconWrap}>
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>

                    <h1 style={titleStyle}>
                        Payment Successful
                    </h1>

                    <p style={descStyle}>
                        Your transaction has been processed successfully.
                        A confirmation receipt has been sent to your email.
                    </p>

                    <div style={dividerStyle} />

                    {/* Buttons */}
                    <div style={btnWrap}>
                        <Link
                            href="/"
                            style={primaryBtn}
                        >
                            <Home size={18} />
                            <span>Return to Dashboard</span>
                        </Link>
                    </div>

                    {/* Status Tracker */}
                    <div style={statusWrap}>
                        <div style={statusDot} />
                        <span style={statusText}>
                            SECURE TRANSACTION COMPLETED
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- STYLES ---------- */

const mainStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F7F9FC',
    padding: '24px',
    position: 'relative',
    fontFamily: "'Inter', sans-serif",
    overflow: 'hidden'
};

const containerStyle = {
    width: '100%',
    maxWidth: '480px',
    zIndex: 10
};

const logoWrap = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    width: '100%'
};

const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const iconWrap = {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    borderRadius: '24px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#001C64',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
    fontFamily: "'Outfit', sans-serif"
};

const descStyle = {
    fontSize: '15px',
    color: '#6B7C93',
    marginBottom: '32px',
    lineHeight: '1.6',
    fontWeight: '500'
};

const dividerStyle = {
    height: '1px',
    background: '#E3E8EF',
    width: '100%',
    marginBottom: '32px'
};

const btnWrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const primaryBtn = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 24px',
    background: '#0070E0',
    color: '#FFFFFF',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)'
};

const statusWrap = {
    marginTop: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
};

const statusDot = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#16a34a',
};

const statusText = {
    fontSize: '11px',
    letterSpacing: '0.1em',
    color: '#94A3B8',
    fontWeight: '800'
};

const glowStyle = {
    position: 'absolute',
    top: -150,
    right: -150,
    width: 500,
    height: 500,
    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.08) 0%, rgba(247, 249, 252, 0) 70%)',
    borderRadius: '50%',
    zIndex: 1
};