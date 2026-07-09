'use client';

import Image from 'next/image';
import Link from 'next/link';
import '../page.css';

export default function ContactPage() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .cp-page {
                    font-family: 'Inter', sans-serif;
                    color: #001c64;
                    background: #F0F7FF;
                    min-height: 100vh;
                }

                /* ─── NAV ─── */
                .cp-nav {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: rgba(255,255,255,0.88);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid rgba(0,112,224,0.08);
                }
                .cp-nav-inner {
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 0 24px;
                    height: 68px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                }
                .cp-nav-links { display: flex; gap: 32px; }
                .cp-nav-links a {
                    font-size: 14px; font-weight: 500;
                    color: #4A5568; text-decoration: none;
                    transition: color 0.2s;
                }
                .cp-nav-links a:hover, .cp-nav-links a.active { color: #0070E0; }
                .cp-btn-login {
                    padding: 8px 18px;
                    border: 1.5px solid #0070E0;
                    border-radius: 8px;
                    font-size: 14px; font-weight: 600;
                    color: #0070E0; text-decoration: none;
                    transition: all 0.2s;
                }
                .cp-btn-login:hover { background: #0070E0; color: #fff; }
                .cp-btn-primary {
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #0070E0, #52b957);
                    border-radius: 8px;
                    font-size: 14px; font-weight: 600;
                    color: #fff; text-decoration: none;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .cp-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

                /* ─── HERO ─── */
                .cp-hero {
                    background: linear-gradient(135deg, #001c64 0%, #14295c 40%, #0070E0 80%, #17a99e 100%);
                    padding: 90px 24px 140px;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }
                .cp-hero-blob1 {
                    position: absolute; top: -80px; right: -80px;
                    width: 420px; height: 420px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(82,185,87,0.22) 0%, transparent 70%);
                    pointer-events: none;
                }
                .cp-hero-blob2 {
                    position: absolute; bottom: -60px; left: -60px;
                    width: 380px; height: 380px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,112,224,0.28) 0%, transparent 70%);
                    pointer-events: none;
                }
                .cp-hero-kicker {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.25);
                    padding: 6px 16px; border-radius: 100px;
                    font-size: 12px; font-weight: 600; color: #a5f3fc;
                    margin-bottom: 24px; letter-spacing: 0.07em; text-transform: uppercase;
                }
                .cp-hero-kicker .dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #52b957;
                    box-shadow: 0 0 8px #52b957;
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.4); }
                }
                .cp-hero h1 {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(34px, 5vw, 60px);
                    font-weight: 800; color: #fff;
                    line-height: 1.1; letter-spacing: -0.03em;
                    margin-bottom: 20px;
                }
                .cp-hero h1 span {
                    background: linear-gradient(90deg, #52b957, #17a99e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .cp-hero-sub {
                    font-size: clamp(15px, 2vw, 18px);
                    color: rgba(255,255,255,0.78);
                    max-width: 560px; margin: 0 auto 42px;
                    line-height: 1.65;
                }
                .cp-hero-stats {
                    display: flex; justify-content: center;
                    gap: 48px; flex-wrap: wrap;
                }
                .cp-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
                .cp-stat b { font-size: 24px; font-weight: 700; color: #fff; font-family: 'Outfit', sans-serif; }
                .cp-stat span { font-size: 12px; color: rgba(255,255,255,0.6); }
                .cp-hero-wave {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    height: 72px; overflow: hidden;
                }
                .cp-hero-wave svg { width: 100%; height: 100%; display: block; }

                /* ─── CARDS SECTION ─── */
                .cp-cards-section {
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 72px 24px;
                }
                .cp-section-head { text-align: center; margin-bottom: 52px; }
                .cp-section-kicker {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #EFF6FF; border: 1px solid #DBEAFE;
                    padding: 5px 14px; border-radius: 100px;
                    font-size: 12px; font-weight: 600; color: #0070E0;
                    margin-bottom: 16px; letter-spacing: 0.06em; text-transform: uppercase;
                }
                .cp-section-kicker .dot-blue {
                    width: 6px; height: 6px; border-radius: 50%; background: #0070E0;
                }
                .cp-section-head h2 {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(26px, 3.5vw, 40px);
                    font-weight: 800; color: #001c64;
                    margin-bottom: 12px; letter-spacing: -0.02em;
                }
                .cp-section-head p { font-size: 16px; color: #4A5568; max-width: 520px; margin: 0 auto; line-height: 1.65; }

                .cp-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                    max-width: 860px;
                    margin: 0 auto;
                }
                .cp-info-card {
                    background: #fff;
                    border: 1px solid rgba(0,112,224,0.1);
                    border-radius: 20px;
                    padding: 32px 28px;
                    display: flex; flex-direction: column; gap: 16px;
                    box-shadow: 0 4px 20px rgba(0,28,100,0.06);
                    transition: transform 0.25s, box-shadow 0.25s;
                    position: relative; overflow: hidden;
                }
                .cp-info-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    border-radius: 20px 20px 0 0;
                    opacity: 0;
                    transition: opacity 0.25s;
                }
                .cp-info-card:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(0,28,100,0.12); }
                .cp-info-card:hover::before { opacity: 1; }
                .cp-info-card.c-blue::before { background: linear-gradient(90deg, #0070E0, #60A5FA); }
                .cp-info-card.c-green::before { background: linear-gradient(90deg, #10B981, #34D399); }
                .cp-info-card.c-purple::before { background: linear-gradient(90deg, #7C3AED, #A78BFA); }
                .cp-info-card.c-teal::before { background: linear-gradient(90deg, #0D9488, #2DD4BF); }

                .cp-icon-wrap {
                    width: 52px; height: 52px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .cp-icon-wrap.blue { background: linear-gradient(135deg, #EFF6FF, #DBEAFE); }
                .cp-icon-wrap.green { background: linear-gradient(135deg, #ECFDF5, #D1FAE5); }
                .cp-icon-wrap.purple { background: linear-gradient(135deg, #F5F3FF, #EDE9FE); }
                .cp-icon-wrap.teal { background: linear-gradient(135deg, #F0FDFA, #CCFBF1); }

                .cp-card-label {
                    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
                    text-transform: uppercase; margin-bottom: 4px;
                }
                .cp-card-label.blue { color: #0070E0; }
                .cp-card-label.green { color: #10B981; }
                .cp-card-label.purple { color: #7C3AED; }
                .cp-card-label.teal { color: #0D9488; }

                .cp-info-card h3 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 19px; font-weight: 700; color: #001c64;
                    margin-bottom: 8px;
                }
                .cp-info-card p { font-size: 14px; color: #4A5568; line-height: 1.6; margin-bottom: 12px; }
                .cp-info-card a {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 14px; font-weight: 600; color: #0070E0;
                    text-decoration: none; transition: gap 0.2s, color 0.2s;
                }
                .cp-info-card a:hover { gap: 10px; color: #005BBB; }
                .cp-info-card.c-green a { color: #10B981; }
                .cp-info-card.c-green a:hover { color: #059669; }
                .cp-info-card.c-purple a { color: #7C3AED; }
                .cp-info-card.c-purple a:hover { color: #6D28D9; }
                .cp-info-card.c-teal a { color: #0D9488; }
                .cp-info-card.c-teal a:hover { color: #0F766E; }

                /* ─── SOCIAL STRIP ─── */
                .cp-social-section {
                    max-width: 1240px; margin: 0 auto;
                    padding: 0 24px 72px;
                    text-align: center;
                }
                .cp-social-section h3 {
                    font-family: 'Outfit', sans-serif;
                    font-size: 20px; font-weight: 700; color: #001c64;
                    margin-bottom: 8px;
                }
                .cp-social-section p { font-size: 14px; color: #4A5568; margin-bottom: 24px; }
                .cp-social-row { display: flex; justify-content: center; gap: 14px; }
                .cp-soc-btn {
                    width: 48px; height: 48px;
                    border-radius: 12px;
                    background: #fff;
                    border: 1px solid rgba(0,112,224,0.12);
                    display: flex; align-items: center; justify-content: center;
                    color: #0070E0;
                    transition: all 0.2s;
                    cursor: pointer; text-decoration: none;
                    box-shadow: 0 2px 10px rgba(0,28,100,0.07);
                }
                .cp-soc-btn:hover {
                    background: linear-gradient(135deg, #0070E0, #17a99e);
                    color: #fff; transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0,112,224,0.3);
                }

                /* ─── CTA BANNER ─── */
                .cp-cta {
                    background: linear-gradient(135deg, #001c64 0%, #14295c 50%, #0070E0 100%);
                    padding: 80px 24px;
                    text-align: center; position: relative; overflow: hidden;
                }
                .cp-cta::before {
                    content: ''; position: absolute; inset: 0;
                    background: radial-gradient(circle at 70% 50%, rgba(82,185,87,0.18) 0%, transparent 60%);
                    pointer-events: none;
                }
                .cp-cta h2 {
                    font-family: 'Outfit', sans-serif;
                    font-size: clamp(26px, 4vw, 42px); font-weight: 800;
                    color: #fff; margin-bottom: 14px; letter-spacing: -0.02em;
                    position: relative;
                }
                .cp-cta p { font-size: 16px; color: rgba(255,255,255,0.72); margin-bottom: 36px; position: relative; }
                .cp-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }
                .cp-cta-outline {
                    padding: 14px 28px;
                    border: 1.5px solid rgba(255,255,255,0.4);
                    border-radius: 10px; font-size: 15px; font-weight: 600;
                    color: #fff; text-decoration: none; transition: all 0.2s;
                }
                .cp-cta-outline:hover { background: rgba(255,255,255,0.12); }

                /* ─── FOOTER ─── */
                .cp-footer {
                    background: #001c64;
                    padding: 28px 32px;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 16px; flex-wrap: wrap;
                }
                .cp-footer span { font-size: 13px; color: rgba(255,255,255,0.45); }
                .cp-footer-links { display: flex; gap: 20px; }
                .cp-footer-links a { font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; }
                .cp-footer-links a:hover { color: #fff; }

                /* ─── RESPONSIVE ─── */
                @media (max-width: 640px) {
                    .cp-nav-links { display: none; }
                    .cp-hero { padding: 60px 20px 110px; }
                    .cp-hero-stats { gap: 28px; }
                    .cp-cards-grid { grid-template-columns: 1fr; }
                    .cp-footer { flex-direction: column; text-align: center; }
                }
            `}</style>

            <div className="cp-page">

                {/* ── NAV ── */}
                <header className="nav">
                    <div className="nav-inner">
                        <Link href="/">
                            <img className="nav-logo" src="/logo-full.jpg" alt="Paysigur" />
                        </Link>
                        <nav className="nav-links">
                            <Link href="/">Home</Link>
                            <Link href="/#solutions">Solutions</Link>
                            <Link href="/#how">How It Works</Link>
                            <Link href="/#trust">Why Paysigur</Link>
                            <Link href="/#partners">Partners</Link>
                            <Link href="/contact" className="active">Contact</Link>
                        </nav>
                        <div className="nav-actions">
                            <Link href="/merchant/login" className="btn-login">Log in</Link>
                            <Link href="/pay" className="btn btn-outline-store">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                                Pay Now
                            </Link>
                            <Link href="/contact" className="btn btn-primary">Partner With Us</Link>
                        </div>
                    </div>
                </header>

                {/* ── HERO ── */}
                <section className="cp-hero">
                    <div className="cp-hero-blob1" />
                    <div className="cp-hero-blob2" />
                    <div className="cp-hero-kicker">
                        <span className="dot" /> Get in Touch
                    </div>
                    <h1>We'd love to <span>hear from you.</span></h1>
                    <p className="cp-hero-sub">
                        Whether you're ready to partner with us, need support, or want to learn more about Paysigur — our team is here and ready to help.
                    </p>
                    <div className="cp-hero-stats">
                        <div className="cp-stat"><b>{'<'}2h</b><span>Avg. Response Time</span></div>
                        <div className="cp-stat"><b>24/7</b><span>Support Available</span></div>
                        <div className="cp-stat"><b>99.9%</b><span>Uptime Guarantee</span></div>
                    </div>
                    <div className="cp-hero-wave">
                        <svg viewBox="0 0 1440 72" preserveAspectRatio="none">
                            <path d="M0,30 C240,72 480,0 720,26 C960,52 1200,10 1440,34 L1440,72 L0,72 Z" fill="#F0F7FF" />
                        </svg>
                    </div>
                </section>

                {/* ── CONTACT CARDS ── */}
                <section className="cp-cards-section">
                    <div className="cp-section-head">
                        <div className="cp-section-kicker">
                            <span className="dot-blue" /> Contact Channels
                        </div>
                        <h2>Multiple ways to reach us</h2>
                        <p>Choose the channel that works best for you. Our team is standing by.</p>
                    </div>

                    <div className="cp-cards-grid">

                        {/* Email */}
                        <div className="cp-info-card c-blue">
                            <div className="cp-icon-wrap blue">
                                <svg width="24" height="24" fill="none" stroke="#0070E0" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="cp-card-label blue">Email</div>
                                <h3>Email Support</h3>
                                <p>For general inquiries, billing questions, and technical support. We respond within 2 hours.</p>
                                <a href="mailto:info@paysigur.com">
                                    info@paysigur.com
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="cp-info-card c-green">
                            <div className="cp-icon-wrap green">
                                <svg width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <div className="cp-card-label green">Phone</div>
                                <h3>Call Us</h3>
                                <p>Speak directly with our team. Available Monday – Friday, 9am to 6pm EST.</p>
                                <a href="tel:+59995261166">
                                    +599 952 61166
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp - hidden for now */}
                        {false && (
                        <div className="cp-info-card c-teal">
                            <div className="cp-icon-wrap teal">
                                <svg width="24" height="24" fill="none" stroke="#0D9488" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <div className="cp-card-label teal">Live Chat</div>
                                <h3>WhatsApp Chat</h3>
                                <p>Chat with our support team directly via WhatsApp for fast, real-time responses.</p>
                                <a href="https://wa.me/59995261166" target="_blank" rel="noopener noreferrer">
                                    Open WhatsApp
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </a>
                            </div>
                        </div>
                        )}

                        {/* Office - hidden for now */}
                        {false && (
                        <div className="cp-info-card c-purple">
                            <div className="cp-icon-wrap purple">
                                <svg width="24" height="24" fill="none" stroke="#7C3AED" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="cp-card-label purple">Office</div>
                                <h3>Visit Us</h3>
                                <p>Meet our team in person. Schedule an appointment for a product demo or consultation.</p>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                    123 Innovation Drive, CA 94043
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>
                                </a>
                            </div>
                        </div>
                        )}


                    </div>
                </section>

                {/* ── SOCIAL ── */}
                <div className="cp-social-section">
                    <h3>Follow us on social media</h3>
                    <p>Stay up to date with news, updates, and tips from the Paysigur team.</p>
                    <div className="cp-social-row">
                        <a href="#" className="cp-soc-btn" aria-label="Twitter">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.9-4.1 4.1 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.3-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg>
                        </a>
                        <a href="#" className="cp-soc-btn" aria-label="Instagram">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                        </a>
                        <a href="#" className="cp-soc-btn" aria-label="LinkedIn">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9v12M10 13a4 4 0 018 0v8"/></svg>
                        </a>
                        <a href="#" className="cp-soc-btn" aria-label="Facebook">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                        </a>
                    </div>
                </div>

                {/* ── CTA ── */}
                <section className="cp-cta">
                    <h2>Ready to grow with Paysigur?</h2>
                    <p>Join merchants across the Caribbean who trust Paysigur to power their payments.</p>
                    <div className="cp-cta-btns">
                        <Link href="/merchant/login" className="cp-btn-primary" style={{ padding: '14px 30px', fontSize: 15, borderRadius: 10 }}>
                            Admin Sign In
                        </Link>
                        <Link href="/" className="cp-cta-outline">Back to Home</Link>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="cp-footer">
                    <span>© 2026 Paysigur. All rights reserved.</span>
                    <div className="cp-footer-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/compliance/how-paysigur-works">How PaySigur Works</Link>
                    </div>
                </footer>

            </div>
        </>
    );
}
