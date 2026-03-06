'use client';

import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'sans-serif'
            }}
        >
            <style>{`
                @keyframes fadeIn {
                    from {opacity:0; transform: translateY(10px);}
                    to {opacity:1; transform: translateY(0);}
                }

                @keyframes pulse {
                    0%,100% {opacity:1;}
                    50% {opacity:0.4;}
                }

                @keyframes bounceSubtle {
                    0%,100% {transform: translateY(0);}
                    50% {transform: translateY(-6px);}
                }
            `}</style>

            {/* Ambient background */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '42rem',
                    height: '400px',
                    background: 'rgba(34,197,94,0.1)',
                    borderRadius: '9999px',
                    filter: 'blur(100px)',
                    pointerEvents: 'none'
                }}
            />

            <div
                style={{
                    width: '100%',
                    maxWidth: '28rem',
                    padding: '40px',
                    position: 'relative',
                    zIndex: 10,
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    animation: 'fadeIn 0.6s ease'
                }}
            >
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#22c55e',
                        margin: '0 auto 32px auto',
                        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                        animation: 'bounceSubtle 2s infinite'
                    }}
                >
                    <svg
                        style={{ width: '40px', height: '40px' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1
                    style={{
                        fontSize: '30px',
                        fontWeight: 900,
                        color: '#fff',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em'
                    }}
                >
                    Payment Verified
                </h1>

                <p
                    style={{
                        color: '#71717a',
                        fontSize: '14px',
                        marginBottom: '40px',
                        lineHeight: '1.6',
                        fontWeight: 500
                    }}
                >
                    Transaction completed successfully. A digital receipt has been dispatched to your inbox, and the merchant has been notified of the settlement.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={() => window.close()}
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#22c55e',
                            color: '#000',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Securely Close Window
                    </button>

                    <Link
                        href="/"
                        style={{
                            display: 'block',
                            padding: '16px',
                            fontSize: '12px',
                            color: '#71717a',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            textDecoration: 'none'
                        }}
                    >
                        Return to Hub
                    </Link>
                </div>

                <div
                    style={{
                        marginTop: '40px',
                        paddingTop: '32px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <div
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#22c55e',
                            animation: 'pulse 1.5s infinite'
                        }}
                    />

                    <span
                        style={{
                            fontSize: '10px',
                            fontWeight: 900,
                            color: '#52525b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em'
                        }}
                    >
                        Transaction Finalized
                    </span>
                </div>
            </div>
        </div>
    );
}