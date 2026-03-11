'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SuccessPage() {
    return (
        <div style={mainStyle}>

            <style>{`
                @keyframes fadeIn {
                    from {opacity:0; transform: translateY(10px);}
                    to {opacity:1; transform: translateY(0);}
                }

                @keyframes pulse {
                    0%,100% {opacity:1;}
                    50% {opacity:0.4;}
                }
            `}</style>

            {/* Glow */}
            <div style={glowStyle} />

            <div style={containerStyle}>

                {/* Logo */}
                {/* <div style={logoWrap}>
                    <Image
                        src="/paysigur.png"
                        alt="Paysigur"
                        width={180}
                        height={70}
                        priority
                    />
                </div> */}

                {/* Card */}
                <div style={cardStyle}>

                    {/* Success Icon */}
                    <div style={iconWrap}>
                        ✓
                    </div>

                    <h1 style={titleStyle}>
                        Payment Successful
                    </h1>

                    <p style={descStyle}>
                        Your transaction has been processed successfully.
                        A confirmation receipt has been sent to your email.
                    </p>

                    {/* Buttons */}
                    <div style={btnWrap}>

                        {/* <button
                            onClick={() => window.close()}
                            style={primaryBtn}
                        >
                            Close Window
                        </button> */}

                        <Link
                            href="/"
                            style={secondaryBtn}
                        >
                            Back to Home
                        </Link>

                    </div>

                    {/* Status */}
                    <div style={statusWrap}>

                        <div style={statusDot} />

                        <span style={statusText}>
                            Transaction Completed
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
    background: '#000',
    padding: 20,
    position: 'relative'
};

const containerStyle = {
    width: '100%',
    maxWidth: 420,
    zIndex: 2
};

const logoWrap = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 24
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 28,
    textAlign: 'center',
    animation: 'fadeIn .5s ease'
};

const iconWrap = {
    width: 70,
    height: 70,
    margin: '0 auto 20px',
    borderRadius: 14,
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.25)',
    color: '#22c55e',
    fontSize: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800
};

const titleStyle = {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 10
};

const descStyle = {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 24,
    lineHeight: 1.6
};

const btnWrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
};

const primaryBtn = {
    padding: 14,
    background: '#22c55e',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#000'
};

const secondaryBtn = {
    padding: 14,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    fontSize: 14,
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 800,
    transition: 'all 0.2s ease'
};

const statusWrap = {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
};

const statusDot = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse 1.5s infinite'
};

const statusText = {
    fontSize: 10,
    letterSpacing: 2,
    color: '#52525b',
    fontWeight: 700
};

const glowStyle = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 600,
    height: 300,
    background: 'rgba(34,197,94,0.12)',
    borderRadius: '50%',
    filter: 'blur(120px)'
};