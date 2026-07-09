'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import '../legal-shared.css';

export default function TermsPage() {
    useEffect(() => {
        // Nav scroll shadow
        const nav = document.querySelector('.nav');
        const handleNavScroll = () => {
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', handleNavScroll);

        // Mobile Drawer
        const toggleBtn = document.getElementById('termsMenuToggle');
        const closeBtn  = document.getElementById('termsMobileClose');
        const drawer    = document.getElementById('termsMobileDrawer');
        if (toggleBtn && closeBtn && drawer) {
            const openMenu  = () => drawer.classList.add('open');
            const closeMenu = () => drawer.classList.remove('open');
            toggleBtn.addEventListener('click', openMenu);
            closeBtn.addEventListener('click', closeMenu);
            drawer.addEventListener('click', (e) => { if (e.target === drawer) closeMenu(); });
            document.querySelectorAll('#termsMobileDrawer .mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));
        }

        return () => {
            window.removeEventListener('scroll', handleNavScroll);
        };
    }, []);

    return (
        <>
            {/* ===== NAV ===== */}
            <header className="nav">
                <div className="nav-inner">
                    <Link href="/">
                        <img className="nav-logo" src="/logo-new.png" alt="Paysigur" />
                    </Link>
                    <nav className="nav-links">
                        <Link href="/">Home</Link>
                        <Link href="/#solutions">Solutions</Link>
                        <Link href="/#how">How It Works</Link>
                        <Link href="/#trust">Why Paysigur</Link>
                        <Link href="/#partners">Partners</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/compliance/how-paysigur-works">How PaySigur Works</Link>
                    </nav>
                    <div className="nav-actions">
                        <Link href="/merchant/login" className="btn-login">Log in</Link>
                        <Link href="/pay" className="btn-outline-store">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Pay Now
                        </Link>
                        <Link href="/contact" className="btn btn-primary">Partner With Us</Link>
                        <button className="menu-toggle" id="termsMenuToggle" aria-label="Open menu">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE DRAWER ===== */}
            <div className="mobile-drawer" id="termsMobileDrawer">
                <div className="mobile-panel">
                    <button className="mobile-close" id="termsMobileClose" aria-label="Close menu">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                    <Link href="/">Home</Link>
                    <Link href="/#solutions">Solutions</Link>
                    <Link href="/#how">How It Works</Link>
                    <Link href="/#trust">Why Paysigur</Link>
                    <Link href="/#partners">Partners</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/compliance/how-paysigur-works">How PaySigur Works</Link>
                    <Link href="/merchant/login">Log in</Link>
                    <Link href="/contact" className="btn btn-primary">Partner With Us</Link>
                </div>
            </div>

            {/* ===== HERO ===== */}
            <section className="legal-hero">
                <div className="legal-hero-inner wrap">
                    <div className="legal-kicker">
                        <span className="legal-kicker-dot"></span>
                        Platform Agreement
                    </div>
                    <h1>Terms of Service</h1>
                    <p className="legal-hero-sub">
                        Please read these terms carefully before using the Paysigur platform.
                        By accessing or using our services, you agree to be bound by these terms.
                    </p>
                </div>
            </section>

            {/* ===== BODY ===== */}
            <div className="legal-body">
                <div className="wrap">
                    <div className="legal-layout">
                        {/* Sidebar TOC */}
                        <aside className="legal-toc">
                            <div className="legal-toc-title">On this page</div>
                            <ul>
                                <li><a href="#agreement">Agreement to Terms</a></li>
                                <li><a href="#payments">Payments &amp; Transactions</a></li>
                                <li><a href="#merchant-obligations">Merchant Obligations</a></li>
                                <li><a href="#prohibited">Prohibited Activities</a></li>
                                <li><a href="#termination">Account Termination</a></li>
                                <li><a href="#liability">Limitation of Liability</a></li>
                                <li><a href="#governing-law">Governing Law</a></li>
                            </ul>
                        </aside>

                        {/* Main content */}
                        <div className="legal-content">
                            <section className="legal-section" id="agreement">
                                <span className="legal-section-num">01 — Agreement to Terms</span>
                                <h2>Agreement to Terms</h2>
                                <p>
                                    By using Paysigur&apos;s payment services, you agree to comply with and be
                                    bound by these Terms of Service. Our platform provides payment processing
                                    tools for merchants. Users assume full responsibility for their business
                                    operations and interactions with customers.
                                </p>
                                <p>
                                    If you do not agree with any part of these terms, you may not access
                                    or use our services.
                                </p>
                            </section>

                            <section className="legal-section" id="payments">
                                <span className="legal-section-num">02 — Payments &amp; Transactions</span>
                                <h2>Payments &amp; Transactions</h2>
                                <p>
                                    All financial transactions are processed securely through our payment
                                    infrastructure. Paysigur does not store sensitive credit card or
                                    banking information on our servers.
                                </p>
                                <p>
                                    Any disputes related to payments are subject to the policies of
                                    the respective payment provider and Paysigur&apos;s dispute resolution
                                    procedures. Settlement timelines are outlined at onboarding.
                                </p>
                            </section>

                            <section className="legal-section" id="merchant-obligations">
                                <span className="legal-section-num">03 — Merchant Obligations</span>
                                <h2>Merchant Obligations</h2>
                                <p>As a merchant using Paysigur, you agree to:</p>
                                <ul className="legal-list">
                                    <li>Provide accurate and up-to-date business and identity information;</li>
                                    <li>Comply with all applicable laws, including KYC and AML regulations;</li>
                                    <li>Use the platform only for lawful business transactions;</li>
                                    <li>Promptly respond to any compliance requests or identity verification requirements;</li>
                                    <li>Keep your login credentials secure and confidential.</li>
                                </ul>
                            </section>

                            <section className="legal-section" id="prohibited">
                                <span className="legal-section-num">04 — Prohibited Activities</span>
                                <h2>Prohibited Activities</h2>
                                <p>You may not use the Paysigur platform for:</p>
                                <ul className="legal-list">
                                    <li>Fraudulent transactions, money laundering, or terrorist financing;</li>
                                    <li>Unauthorized resale or redistribution of platform access;</li>
                                    <li>Any activity that violates applicable local or international laws;</li>
                                    <li>Providing false or misleading information during onboarding or verification.</li>
                                </ul>
                                <p>
                                    Violation of these prohibitions may result in immediate suspension or
                                    termination of your account and may be reported to relevant authorities.
                                </p>
                            </section>

                            <section className="legal-section" id="termination">
                                <span className="legal-section-num">05 — Account Termination</span>
                                <h2>Account Termination</h2>
                                <p>
                                    We reserve the right to suspend or terminate access to the platform if
                                    we detect fraudulent activity, security violations, or breach of these
                                    terms. In such cases, pending settlements may be held pending investigation.
                                </p>
                                <p>
                                    You may also terminate your account at any time by contacting our
                                    support team. Outstanding balances will be settled according to the
                                    payout schedule in effect at the time of termination.
                                </p>
                            </section>

                            <section className="legal-section" id="liability">
                                <span className="legal-section-num">06 — Limitation of Liability</span>
                                <h2>Limitation of Liability</h2>
                                <p>
                                    To the fullest extent permitted by law, Paysigur shall not be liable
                                    for any indirect, incidental, special, consequential, or punitive damages
                                    arising out of your use of or inability to use the platform.
                                </p>
                                <p>
                                    Our total cumulative liability for any claims arising under these terms
                                    shall not exceed the fees paid by you to Paysigur in the twelve (12)
                                    months preceding the claim.
                                </p>
                            </section>

                            <section className="legal-section" id="governing-law">
                                <span className="legal-section-num">07 — Governing Law</span>
                                <h2>Governing Law</h2>
                                <p>
                                    These Terms of Service are governed by the laws of the State of Wyoming,
                                    United States, without regard to conflict of law principles. Any disputes
                                    shall be subject to the exclusive jurisdiction of the courts located in
                                    Wyoming.
                                </p>
                                <p>
                                    These terms were last updated in 2026. We may revise these terms from
                                    time to time and will notify users of material changes.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="footer">
                <div className="wrap">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <img className="footer-logo" src="/logo-full.jpg" alt="Paysigur" />
                            <p>Empowering Caribbean entrepreneurs with the technology, tools, and trusted partnerships to accept payments and grow with confidence.</p>
                            <div className="footer-social">
                                <a href="#" aria-label="Twitter">
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{color:'#fff'}}>
                                        <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.9-4.1 4.1 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.3-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/>
                                    </svg>
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#fff'}}>
                                        <rect x="3" y="3" width="18" height="18" rx="5"/>
                                        <circle cx="12" cy="12" r="4"/>
                                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                                    </svg>
                                </a>
                                <a href="#" aria-label="LinkedIn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#fff'}}>
                                        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                                        <path d="M10 9v12M10 13a4 4 0 018 0v8"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h5>Company</h5>
                            <ul>
                                <li><a href="/#top">About Us</a></li>
                                <li><a href="/#solutions">Solutions</a></li>
                                <li><a href="/#business-partners">For Business Partners</a></li>
                                <li><a href="/#strategic-partners">Partners</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h5>Access</h5>
                            <ul>
                                <li><a href="/merchant/login">Log In</a></li>
                                <li><a href="/contact">Contact Support</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h5>Compliance</h5>
                            <ul>
                                <li><a href="/compliance/how-paysigur-works">How PaySigur Works</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms" className="active">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>&copy; 2026 Paysigur. All rights reserved.</span>
                    </div>
                </div>
            </footer>
        </>
    );
}
