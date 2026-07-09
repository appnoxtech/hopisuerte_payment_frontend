'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import '../../legal-shared.css';

export default function HowPaysigurWorksPage() {
    useEffect(() => {
        // Nav scroll shadow
        const nav = document.querySelector('.nav');
        const handleNavScroll = () => {
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', handleNavScroll);

        // Mobile Drawer
        const toggleBtn = document.getElementById('legalMenuToggle');
        const closeBtn  = document.getElementById('legalMobileClose');
        const drawer    = document.getElementById('legalMobileDrawer');
        if (toggleBtn && closeBtn && drawer) {
            const openMenu  = () => drawer.classList.add('open');
            const closeMenu = () => drawer.classList.remove('open');
            toggleBtn.addEventListener('click', openMenu);
            closeBtn.addEventListener('click', closeMenu);
            drawer.addEventListener('click', (e) => { if (e.target === drawer) closeMenu(); });
            document.querySelectorAll('#legalMobileDrawer .mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));
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
                        <Link href="/compliance/how-paysigur-works" className="active">How PaySigur Works</Link>
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
                        <button className="menu-toggle" id="legalMenuToggle" aria-label="Open menu">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE DRAWER ===== */}
            <div className="mobile-drawer" id="legalMobileDrawer">
                <div className="mobile-panel">
                    <button className="mobile-close" id="legalMobileClose" aria-label="Close menu">
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
                        Compliance &amp; Operations
                    </div>
                    <h1>How PaySigur Works</h1>
                    <p className="legal-hero-sub">
                        A formal overview of PaySigur LLC&apos;s business model, revenue structure,
                        fund-handling procedures, and compliance framework for banking partners,
                        payment facilitators, and regulatory stakeholders.
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
                                <li><a href="#business-model">Business Model</a></li>
                                <li><a href="#revenue-model">Revenue Model</a></li>
                                <li><a href="#fund-handling">How Funds Are Handled</a></li>
                                <li><a href="#compliance">Compliance</a></li>
                                <li><a href="#geographic">Geographic Operations</a></li>
                                <li><a href="#mission">Our Mission</a></li>
                            </ul>
                        </aside>

                        {/* Main content */}
                        <div className="legal-content">
                            <section className="legal-section" id="business-model">
                                <span className="legal-section-num">01 — Business Model</span>
                                <h2>Business Model</h2>
                                <p>
                                    PaySigur LLC is a financial technology company incorporated in Wyoming,
                                    United States. We provide businesses with secure payment links, payment
                                    collection tools, merchant management services, and payment administration
                                    solutions.
                                </p>
                                <p>
                                    Our platform enables businesses to accept payments from their customers
                                    while simplifying payment collection and settlement.
                                </p>
                            </section>

                            <section className="legal-section" id="revenue-model">
                                <span className="legal-section-num">02 — Revenue Model</span>
                                <h2>Revenue Model</h2>
                                <p>PaySigur generates revenue by charging:</p>
                                <ul className="legal-list">
                                    <li>Transaction-based service fees;</li>
                                    <li>Platform and technology service fees;</li>
                                    <li>Optional subscription and premium business services.</li>
                                </ul>
                                <p>
                                    All fees are disclosed to merchants before they begin using the platform.
                                </p>
                            </section>

                            <section className="legal-section" id="fund-handling">
                                <span className="legal-section-num">03 — Fund Handling</span>
                                <h2>How Funds Are Handled</h2>
                                <p>
                                    PaySigur facilitates payment collection on behalf of approved merchants.
                                </p>
                                <p>When a customer makes a payment through PaySigur:</p>
                                <ol className="legal-list-ordered">
                                    <li>
                                        <strong>Receipt.</strong>&nbsp;The payment is received through PaySigur&apos;s
                                        designated payment infrastructure.
                                    </li>
                                    <li>
                                        <strong>Fee Deduction.</strong>&nbsp;PaySigur deducts the agreed platform
                                        and processing fees.
                                    </li>
                                    <li>
                                        <strong>Settlement.</strong>&nbsp;The remaining balance is transferred to
                                        the merchant according to the agreed payout schedule.
                                    </li>
                                </ol>
                                <p>
                                    PaySigur maintains records of all transactions and applies internal
                                    compliance procedures designed to prevent fraud, money laundering, and
                                    other financial crimes.
                                </p>
                            </section>

                            <section className="legal-section" id="compliance">
                                <span className="legal-section-num">04 — Compliance</span>
                                <h2>Compliance</h2>
                                <p>
                                    PaySigur follows Know Your Customer (KYC), Anti-Money Laundering (AML),
                                    Counter-Terrorist Financing (CTF), and sanctions compliance procedures.
                                    Merchants may be required to provide identity and business verification
                                    before using the platform.
                                </p>
                            </section>

                            <section className="legal-section" id="geographic">
                                <span className="legal-section-num">05 — Geographic Operations</span>
                                <h2>Geographic Operations</h2>
                                <p>
                                    PaySigur LLC is incorporated in Wyoming, United States, and operates
                                    from Cura&ccedil;ao. The company provides payment technology and payment
                                    management services to approved businesses in the Caribbean, the United
                                    States, and other permitted international markets, subject to applicable
                                    laws and the requirements of our banking and payment partners.
                                </p>
                            </section>

                            <section className="legal-section" id="mission">
                                <span className="legal-section-num">06 — Our Mission</span>
                                <h2>Our Mission</h2>
                                <p>
                                    Our mission is to provide businesses with a secure, transparent, and
                                    efficient platform for collecting payments, managing transactions, and
                                    receiving timely settlements while maintaining the highest standards of
                                    compliance and customer service.
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
                                <li><a href="/compliance/how-paysigur-works" className="active">How PaySigur Works</a></li>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
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