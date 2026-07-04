
'use client';
import { useEffect } from 'react';
import './page.css';

export default function LandingPage() {
  useEffect(() => {
    // Mobile Drawer
    const toggleBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('mobileClose');
    const drawer = document.getElementById('mobileDrawer');

    if (toggleBtn && closeBtn && drawer) {
      const openMenu = () => drawer.classList.add('open');
      const closeMenu = () => drawer.classList.remove('open');

      toggleBtn.addEventListener('click', openMenu);
      closeBtn.addEventListener('click', closeMenu);
      drawer.addEventListener('click', (e) => { if (e.target === drawer) closeMenu(); });
      document.querySelectorAll('.mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));

      // active nav link on scroll
      const sections = ['top', 'solutions', 'how', 'trust', 'partners', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
      const navLinks = document.querySelectorAll('.nav-links a');
      const handleScroll = () => {
        let current = sections[0]?.id;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 120) current = sec.id;
        }
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
      };
      window.addEventListener('scroll', handleScroll);

      // scroll reveal observer
      const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

      // number counter animation
      const revCounter = document.getElementById('revenueCounter');
      if (revCounter) {
        const target = 48920;
        const duration = 2000;
        let startTime = null;

        setTimeout(() => {
          requestAnimationFrame(function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            revCounter.innerText = '$' + (target * ease).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            if (progress < 1) requestAnimationFrame(updateCounter);
          });
        }, 600);
      }

      return () => {
        toggleBtn.removeEventListener('click', openMenu);
        closeBtn.removeEventListener('click', closeMenu);
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{
      __html: `

<!-- ================= NAV ================= -->
<header class="nav">
  <div class="nav-inner">
    <a href="#top"><img class="nav-logo" src="/logo-full.jpg" alt="Paysigur"></a>
    <nav class="nav-links">
      <a href="#top" class="active">Home</a>
      <a href="#solutions">Solutions</a>
      <a href="#how">How It Works</a>
      <a href="#trust">Why Paysigur</a>
      <a href="#partners">Partners</a>
      <a href="/contact">Contact</a>
    </nav>
    <div class="nav-actions">
      <a href="/merchant/login" class="btn-login">Log in</a>
      <a href="/pay" class="btn btn-outline-store">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        Pay Now 
      </a>
      <a href="/contact" class="btn btn-primary">Partner With Us</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
    </div>
  </div>
</header>

<!-- mobile drawer -->
<div class="mobile-drawer" id="mobileDrawer">
  <div class="mobile-panel">
    <button class="mobile-close" id="mobileClose" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <a href="#top">Home</a>
    <a href="#solutions">Solutions</a>
    <a href="#how">How It Works</a>
    <a href="#trust">Why Paysigur</a>
    <a href="#partners">Partners</a>
    <a href="#contact">Contact</a>
    <a href="/merchant/login">Log in</a>
    <a href="#contact" class="btn btn-primary">Partner With Us</a>
  </div>
</div>

<!-- ================= HERO ================= -->
<section class="hero" id="top">
  <div class="blob blob-a"></div>
  <div class="blob blob-b"></div>
  <div class="hero-inner">
    <div class="hero-copy">
      <div class="kicker hero-animate-in"><span class="dot"></span>Unified Payment Gateway</div>
      <h1 class="hero-animate-in delay-1">The developer-first payment platform for <span class="accent">modern merchants.</span></h1>
      <p class="lead hero-animate-in delay-2">Generate secure payment links, integrate real-time webhooks, and automate WhatsApp receipts—all managed from a centralized, secure dashboard.</p>
      <div class="hero-ctas hero-animate-in delay-3">
        <a href="#solutions" class="btn btn-primary btn-lg">Explore Platform
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a href="#how" class="btn btn-ghost btn-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/></svg>
          API Documentation
        </a>
      </div>
      <div class="hero-stats hero-animate-in delay-4">
        <div class="stat"><b>Real-time</b><span>Webhook Events</span></div>
        <div class="stat"><b>QR & Link</b><span>Payment Options</span></div>
        <div class="stat"><b>99.9%</b><span>Uptime Guarantee</span></div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-card">
        <div class="hero-card-top">
          <span class="label">This month's revenue</span>
          <span class="pill">+18.4%</span>
        </div>
        <div class="hero-amount" id="revenueCounter">\$48,920.00</div>
        <div class="hero-sub">Across 6 active payment links</div>
        <div class="hero-bars">
          <i style="height:38%"></i><i style="height:52%"></i><i style="height:44%"></i>
          <i style="height:70%"></i><i style="height:60%"></i><i style="height:85%"></i>
          <i style="height:66%"></i><i style="height:92%"></i>
        </div>
        <div class="hero-row">
          <div class="who"><div class="avatar"></div><span>Island Coffee Co.</span></div>
          <span class="amt">+\$240.00</span>
        </div>
        <div class="hero-row">
          <div class="who"><div class="avatar"></div><span>Marisol Boutique</span></div>
          <span class="amt">+\$865.00</span>
        </div>
      </div>
      <div class="float-badge b1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        Payment received
      </div>
      <div class="float-badge b2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg>
        Bank-grade security
      </div>
    </div>
  </div>
  <div class="wave-divider">
    <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#14295c"/>
          <stop offset="40%" stop-color="#1477c6"/>
          <stop offset="72%" stop-color="#17a99e"/>
          <stop offset="100%" stop-color="#52b957"/>
        </linearGradient>
      </defs>
      <path d="M0,30 C240,70 480,0 720,25 C960,50 1200,10 1440,32 L1440,70 L0,70 Z" fill="url(#waveGrad)"/>
    </svg>
  </div>
</section>

<!-- ================= LOGO STRIP ================= -->
<section class="logo-strip">
  <div class="wrap">
    <span class="caption">Trusted by leading partners</span>
    <div class="marks">
      <span>ISLAND BANK</span>
      <span>CariPay</span>
      <span>NovaCloud</span>
      <span>Harborline</span>
      <span>TrustRail</span>
    </div>
  </div>
</section>

<!-- ================= FEATURES / SOLUTIONS ================= -->
<section class="features" id="solutions">
  <div class="wrap">
    <div class="section-head">
      <div class="kicker"><span class="dot"></span>Solutions</div>
      <h2>Powerful tools for developers and operators</h2>
      <p>A complete suite of APIs, webhooks, and centralized management tools designed for scalable merchant operations.</p>
    </div>
    <div class="feature-grid">
      <div class="feature-card reveal-up stagger-1">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>
        <h3>Developer API Keys</h3>
        <p>Integrate directly with your applications using secure API keys and our dedicated v1/payments verification API.</p>
      </div>
      <div class="feature-card reveal-up stagger-2">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 2.5h3l2.7 12.4a2 2 0 002 1.6h8.4a2 2 0 002-1.6L21 7H6"/></svg></div>
        <h3>Real-Time Webhooks</h3>
        <p>Automate fulfillment with robust webhook endpoints. Track delivery logs and easily replay failed events.</p>
      </div>
      <div class="feature-card reveal-up stagger-3">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6h-6"/></svg></div>
        <h3>Instant Payment Links & QR</h3>
        <p>Share dynamic product payment URLs or dynamic QR codes to accept payments instantly—no coding required.</p>
      </div>
      <div class="feature-card reveal-up stagger-1">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg></div>
        <h3>WhatsApp Integration</h3>
        <p>Automatically generate and deliver transaction receipts to your customers directly via WhatsApp.</p>
      </div>
      <div class="feature-card reveal-up stagger-2">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M17 3.5a4 4 0 010 8"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg></div>
        <h3>Centralized Catalog</h3>
        <p>Super Admins control the master product catalog, ensuring pricing consistency and compliance across all merchants.</p>
      </div>
      <div class="feature-card reveal-up stagger-3">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/></svg></div>
        <h3>Comprehensive Analytics</h3>
        <p>Exportable CSV reports and real-time dashboard analytics tailored for both Merchants and Super Admins.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================= STOREFRONT CTA ================= -->
<section class="demo" id="demo">
  <div class="storefront-bg">
    <div class="s-blob s-blob-a"></div>
    <div class="s-blob s-blob-b"></div>
  </div>
  <div class="wrap storefront-inner">
    <div class="storefront-text reveal-up">
      <div class="kicker"><span class="dot"></span>Public Storefront</div>
      <h2>Discover and purchase products instantly</h2>
      <p>Our open storefront brings together products from verified merchants on the Paysigur platform. No account needed to browse. Simply pick what you need and complete checkout securely via card or QR scan.</p>
      <div class="storefront-features">
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> No login required to browse</div>
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Pay via secure link or QR code</div>
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> WhatsApp receipt delivered instantly</div>
      </div>
      <a href="/pay" class="btn btn-primary btn-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Browse Products
      </a>
    </div>
    <div class="storefront-cards reveal-up stagger-2">
      <div class="s-card s-card-1">
        <div class="s-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/></svg>
        </div>
        <div class="s-card-info">
          <span class="s-card-name">Product 1</span>
          <span class="s-card-merchant">Merchant</span>
        </div>
        <span class="s-card-price">$XX.XX</span>
      </div>
      <div class="s-card s-card-2">
        <div class="s-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/></svg>
        </div>
        <div class="s-card-info">
          <span class="s-card-name">Product 2</span>
          <span class="s-card-merchant">Merchant</span>
        </div>
        <span class="s-card-price">$XX.XX</span>
      </div>
      <div class="s-card s-card-3">
        <div class="s-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/></svg>
        </div>
        <div class="s-card-info">
          <span class="s-card-name">Product 3</span>
          <span class="s-card-merchant">Merchant</span>
        </div>
        <span class="s-card-price">$XX.XX</span>
      </div>
      <div class="s-card-cta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        + more products available
      </div>
    </div>
  </div>
</section>

<!-- ================= HOW IT WORKS ================= -->
<section class="how" id="how">
  <div class="wrap">
    <div class="section-head">
      <div class="kicker"><span class="dot"></span>Workflow</div>
      <h2>Secure, managed onboarding and integration</h2>
      <p>From centralized provisioning to automated fulfillment, Paysigur scales with your operations.</p>
    </div>
    <div class="how-grid">
      <div class="how-step reveal-up stagger-1">
        <div class="how-num">1</div>
        <h4>Managed Onboarding</h4>
        <p>A Super Admin securely provisions your merchant account and assigns your approved product catalog.</p>
      </div>
      <div class="how-step reveal-up stagger-2">
        <div class="how-num">2</div>
        <h4>Integrate or Share</h4>
        <p>Generate API keys for custom integration, or use the dashboard to instantly share product payment links.</p>
      </div>
      <div class="how-step reveal-up stagger-3">
        <div class="how-num">3</div>
        <h4>Receive via QR or Link</h4>
        <p>Customers complete checkout securely via dynamic URLs or by scanning in-person QR codes.</p>
      </div>
      <div class="how-step reveal-up stagger-4">
        <div class="how-num">4</div>
        <h4>Automate & Fulfill</h4>
        <p>Webhooks instantly notify your backend, and transaction receipts are sent directly via WhatsApp.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================= TRUST ================= -->
<section class="trust" id="trust">
  <div class="wrap trust-grid">
    <div class="trust-card reveal-up stagger-1">
      <p class="trust-quote">"Paysigur’s webhook infrastructure and API key management allowed us to seamlessly integrate checkout into our custom mobile app. The managed catalog ensures we stay perfectly in sync."</p>
      <div class="trust-person">
        <div class="avatar"></div>
        <div><b>Marcus Reed</b><span>Lead Developer, NovaCloud</span></div>
      </div>
    </div>
    <div class="trust-points">
      <div class="trust-point reveal-up stagger-2">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg></div>
        <div><h4>Bank-grade API Security</h4><p>Robust API key management with granular revocation capabilities and rate-limited endpoints.</p></div>
      </div>
      <div class="trust-point reveal-up stagger-3">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/></svg></div>
        <div><h4>Centralized Administration</h4><p>Platform operators maintain full control over merchant lifecycles, user status, and product definitions.</p></div>
      </div>
      <div class="trust-point reveal-up stagger-4">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M17 3.5a4 4 0 010 8"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg></div>
        <div><h4>Reliable Webhook Delivery</h4><p>Never miss a transaction event. Replay failed deliveries and rotate endpoint secrets effortlessly.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PARTNERS / CTA ================= -->
<section id="partners">
  <div class="cta reveal-up">
    <div class="cta-inner">
      <h2>Ready to integrate with Paysigur?</h2>
      <p>Log in to access your developer credentials, manage webhooks, and start generating secure payment links.</p>
      <div class="cta-ctas">
        <a href="/contact" class="btn btn-primary btn-lg">Partner With Us</a>
        <a href="/merchant/login" class="btn btn-outline-light btn-lg">Admin Sign In</a>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOOTER ================= -->
<footer class="footer" id="contact">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="footer-logo" src="/logo-full.jpg" alt="Paysigur">
        <p>Empowering Caribbean entrepreneurs with the technology, tools, and trusted partnerships to accept payments and grow with confidence.</p>
        <div class="footer-social">
          <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor" style="color:#fff"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.9-4.1 4.1 0 .3 0 .6.1.9-3.4-.2-6.4-1.8-8.4-4.3-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.2 1.7-5.1 1.7-.3 0-.7 0-1-.1 1.8 1.2 4 1.9 6.3 1.9 7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#fff"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#fff"><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/><path d="M10 9v12M10 13a4 4 0 018 0v8"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="#top">About Us</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#partners">For Business Partners</a></li>
          <li><a href="#trust">Partners</a></li>
        </ul>
      </div>
      
      <div class="footer-col">
        <h5>Access</h5>
        <ul>
          <li><a href="/merchant/login">Log In</a></li>
          <li><a href="/contact">Contact Support</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Paysigur. All rights reserved.</span>
      <div class="legal-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

` }} />
  );
}
