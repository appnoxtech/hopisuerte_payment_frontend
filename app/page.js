
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
      const sections = ['top', 'workspace', 'solutions', 'business-partners', 'strategic-partners', 'developers', 'about'].map(id => document.getElementById(id)).filter(Boolean);
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
      document.querySelectorAll('.section-head').forEach(el => observer.observe(el));

      // stat counters
      const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        let startTime = null;
        requestAnimationFrame(function tick(now) {
          if (!startTime) startTime = now;
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * ease).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        });
      };
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.stat-counter').forEach(el => counterObserver.observe(el));

      // nav shadow on scroll
      const nav = document.querySelector('.nav');
      const handleNavScroll = () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', handleNavScroll);

      // number counter animation
      const revCounter = document.getElementById('revenueCounter');
      if (revCounter) {
        const target = 99.99;
        const duration = 2000;
        let startTime = null;

        setTimeout(() => {
          requestAnimationFrame(function updateCounter(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            revCounter.innerText = (target * ease).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

            if (progress < 1) requestAnimationFrame(updateCounter);
          });
        }, 600);
      }

      return () => {
        toggleBtn.removeEventListener('click', openMenu);
        closeBtn.removeEventListener('click', closeMenu);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('scroll', handleNavScroll);
        observer.disconnect();
        counterObserver.disconnect();
      };
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{
      __html: `

<!-- ================= NAV ================= -->
<header class="nav">
  <div class="nav-inner">
    <a href="#top"><img class="nav-logo" src="/logo-new.png" alt="Paysigur"></a>
    <nav class="nav-links">
      <a href="#top" class="active">Home</a>
      <a href="#workspace">Workspace</a>
      <a href="#solutions">Solutions</a>
      <a href="#business-partners">Business Partners</a>
      <a href="#strategic-partners">Strategic Partners</a>
      <a href="#developers">Developers</a>
      <a href="#about">About</a>
      <a href="/compliance/how-paysigur-works">How PaySigur Works</a>
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
    <a href="#workspace">Workspace</a>
    <a href="#solutions">Solutions</a>
    <a href="#business-partners">Business Partners</a>
    <a href="#strategic-partners">Strategic Partners</a>
    <a href="#developers">Developers</a>
    <a href="#about">About</a>
    <a href="/compliance/how-paysigur-works">How PaySigur Works</a>
    <a href="/merchant/login">Log in</a>
    <a href="/contact" class="btn btn-primary">Partner With Us</a>
  </div>
</div>

<!-- ================= HERO ================= -->
<section class="hero-new" id="top">
  <!-- Background Image -->
  <div class="hero-new-bg" style="background-image: url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop'); background-position: center center;"></div>
  <div class="hero-new-overlay"></div>
  
  <div class="hero-new-inner wrap">
    <div class="hero-new-copy">
      <div class="hero-kicker hero-animate-in"><span class="hero-kicker-dot"></span>Digital Commerce Workspace</div>
      <h1 class="hero-animate-in delay-1">Every entrepreneur deserves the <span class="hero-accent">opportunity to succeed.</span></h1>
      <p class="lead hero-animate-in delay-2">The Digital Commerce Workspace designed to help Caribbean businesses get paid, stay organized, and grow through trusted technology and strategic partnerships.</p>
      
      <div class="hero-ctas-new hero-animate-in delay-3">
        <a href="#business-partners" class="btn btn-hero-primary btn-lg">Become a Business Partner <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <a href="#workspace" class="btn btn-hero-ghost btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z"/></svg>
          Explore Workspace
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Features Bar (outside hero so it's not clipped) -->
<div class="hero-features-section">
  <div class="wrap">
    <div class="hero-features-bar hero-animate-in delay-3">
      <div class="hf-item">
        <div class="hf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#17a99e" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg></div>
        <div class="hf-text">
          <h4>Accept Payments</h4>
          <p>Secure, flexible payment solutions for every business.</p>
        </div>
      </div>
      <div class="hf-item">
        <div class="hf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#17a99e" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
        <div class="hf-text">
          <h4>Manage Operations</h4>
          <p>All-in-one tools to simplify and run your business.</p>
        </div>
      </div>
      <div class="hf-item">
        <div class="hf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#17a99e" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
        <div class="hf-text">
          <h4>Grow Your Business</h4>
          <p>Insights and solutions that help you scale with confidence.</p>
        </div>
      </div>
      <div class="hf-item">
        <div class="hf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#17a99e" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <div class="hf-text">
          <h4>Built on Trust</h4>
          <p>Security, compliance, and governance you can rely on.</p>
        </div>
      </div>
      <div class="hf-item">
        <div class="hf-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#17a99e" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div class="hf-text">
          <h4>Stronger Together</h4>
          <p>A connected ecosystem of partners supporting you.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ================= STATS STRIP ================= -->
<section class="stats-strip">
  <div class="wrap">
    <div class="stats-inner">
      <div class="stat-item reveal-up stagger-1">
        <b class="stat-counter" data-target="2400" data-suffix="+">0</b>
        <span>Merchants Onboarded</span>
      </div>
      <div class="stat-item reveal-up stagger-2">
        <b class="stat-counter" data-target="14" data-suffix="">0</b>
        <span>Caribbean Markets</span>
      </div>
      <div class="stat-item reveal-up stagger-3">
        <b class="stat-counter" data-target="99" data-suffix=".9%">0</b>
        <span>Platform Uptime SLA</span>
      </div>
    </div>
  </div>
</section>

<!-- ================= TRUSTED PARTNERS ================= -->
<section class="trusted-partners-strip">
  <div class="wrap">
    <h3 class="tp-heading">Trusted by Leading Partners</h3>
    <div class="tp-grid">
      <div class="tp-item">
        <div class="tp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8v12"/><path d="M12 2v2M8 4l8 0"/></svg></div>
        <div class="tp-name">Banking<br/>Partners</div>
      </div>
      <div class="tp-item">
        <div class="tp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>
        <div class="tp-name">Payment<br/>Partners</div>
      </div>
      <div class="tp-item">
        <div class="tp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.5 19C19.985 19 22 16.985 22 14.5C22 12.015 19.985 10 17.5 10C17.158 10 16.828 10.04 16.516 10.114C15.702 7.18 13.045 5 9.8 5C5.49 5 2 8.49 2 12.8C2 16.223 4.777 19 8.2 19H17.5Z"/></svg></div>
        <div class="tp-name">Technology<br/>Partners</div>
      </div>
      <div class="tp-item">
        <div class="tp-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2"/></svg></div>
        <div class="tp-name">Business<br/>Partners</div>
      </div>
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
<section class="demo" id="workspace">
  <div class="storefront-bg">
    <div class="s-blob s-blob-a"></div>
    <div class="s-blob s-blob-b"></div>
  </div>
  <div class="wrap storefront-inner">
    <div class="storefront-text reveal-up">
      <div class="kicker"><span class="dot"></span>Digital Commerce Workspace</div>
      <h2>A unified space to manage and grow your business</h2>
      <p>Our workspace brings together everything you need to sell online. No complex setup required. Simply list your products, generate payment links, and track your revenue securely from one centralized dashboard.</p>
      <div class="storefront-features">
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Centralized merchant operations</div>
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Secure payment links & QR codes</div>
        <div class="sf-feat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Automated transaction receipts</div>
      </div>
      <a href="/merchant/login" class="btn btn-primary btn-lg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Enter Workspace
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
<section class="how" id="business-partners">
  <div class="wrap">
    <div class="section-head">
      <div class="kicker"><span class="dot"></span>Business Partners</div>
      <h2>Grow alongside a thriving ecosystem</h2>
      <p>Whether you're a merchant, reseller, or agency, our partnership programs are designed to help you succeed.</p>
    </div>
    <div class="how-grid">
      <div class="how-step reveal-up stagger-1">
        <div class="how-num">1</div>
        <h4>Merchants & Retailers</h4>
        <p>Access our comprehensive digital commerce workspace to securely accept payments and manage your daily operations.</p>
      </div>
      <div class="how-step reveal-up stagger-2">
        <div class="how-num">2</div>
        <h4>Agencies & Developers</h4>
        <p>Build custom checkout experiences for your clients using our robust API keys and reliable webhook infrastructure.</p>
      </div>
      <div class="how-step reveal-up stagger-3">
        <div class="how-num">3</div>
        <h4>Resellers</h4>
        <p>Join our reseller network to offer top-tier digital payment solutions to businesses across the Caribbean.</p>
      </div>
      <div class="how-step reveal-up stagger-4">
        <div class="how-num">4</div>
        <h4>Affiliates</h4>
        <p>Earn commissions by referring businesses to a secure, developer-first platform they can trust.</p>
      </div>
    </div>
  </div>
</section>

<!-- ================= TRUST ================= -->
<section class="trust" id="strategic-partners">
  <div class="wrap trust-grid">
    <div class="trust-card reveal-up stagger-1">
      <div class="kicker"><span class="dot"></span>Strategic Partners</div>
      <h3 style="margin-top: 1rem; color: #ffffff;">Building the Future of Digital Commerce Together</h3>
      <p style="margin-top: 1rem; color: var(--text-2);">We collaborate with leading financial institutions, telecommunication providers, and technology platforms to deliver a secure, robust ecosystem for the Caribbean market. Our strategic partnerships ensure enterprise-grade reliability and seamless interconnectivity.</p>
    </div>
    <div class="trust-points">
      <div class="trust-point reveal-up stagger-2">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/></svg></div>
        <div><h4>Financial Institutions</h4><p>Collaborating with banks to ensure bank-grade compliance, security, and seamless fund settlements.</p></div>
      </div>
      <div class="trust-point reveal-up stagger-3">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-4"/></svg></div>
        <div><h4>Telecommunications</h4><p>Partnering with major telecom providers to power instant WhatsApp notifications and SMS alerts.</p></div>
      </div>
      <div class="trust-point reveal-up stagger-4">
        <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M17 3.5a4 4 0 010 8"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg></div>
        <div><h4>Technology Integrators</h4><p>Working with cloud providers and enterprise platforms to maintain a 99.9% uptime guarantee.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ================= PARTNERS / CTA ================= -->
<section id="developers">
  <div class="cta reveal-up">
    <div class="cta-orb cta-orb-1"></div>
    <div class="cta-orb cta-orb-2"></div>
    <div class="cta-orb cta-orb-3"></div>
    <div class="cta-inner">
      <div class="kicker" style="color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2);"><span class="dot" style="background: #fff;"></span>Developers</div>
      <h2 style="margin-top: 1rem;">Ready to build with Paysigur?</h2>
      <p>Log in to access your developer credentials, explore our API documentation, and configure real-time webhooks for your applications.</p>
      <div class="cta-ctas">
        <a href="#solutions" class="btn btn-primary btn-lg" style="background: #fff; color: var(--navy);">View Documentation</a>
        <a href="/merchant/login" class="btn btn-outline-light btn-lg">Developer Portal</a>
      </div>
    </div>
  </div>
</section>

<!-- ================= ABOUT ================= -->
<section class="about" id="about">
  <div class="wrap">
    <div class="about-inner reveal-up">
      <div class="kicker"><span class="dot"></span>About Us</div>
      <h2 style="margin-top: 1rem; margin-bottom: 1.5rem; font-size: 36px;">Empowering Caribbean Commerce</h2>
      <p style="font-size: 1.125rem; line-height: 1.8; color: var(--muted); max-width: 680px; margin: 0 auto 2.5rem;">Paysigur is dedicated to democratizing digital commerce for entrepreneurs across the Caribbean. By combining trusted technology, strategic partnerships, and a unified workspace, we are building the infrastructure that allows modern merchants to get paid, stay organized, and grow with confidence.</p>
      <div class="about-pillars">
        <div class="about-pillar">
          <div class="ap-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
          <b>Trusted</b><span>Bank-grade security</span>
        </div>
        <div class="about-pillar">
          <div class="ap-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M17 3.5a4 4 0 010 8"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg></div>
          <b>Partnership-Led</b><span>Stronger together</span>
        </div>
        <div class="about-pillar">
          <div class="ap-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6h-6"/></svg></div>
          <b>Growth-Focused</b><span>Built to scale</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ================= FOOTER ================= -->
<footer class="footer">
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
          <li><a href="#business-partners">For Business Partners</a></li>
          <li><a href="#strategic-partners">Partners</a></li>
        </ul>
      </div>
      
      <div class="footer-col">
        <h5>Access</h5>
        <ul>
          <li><a href="/merchant/login">Log In</a></li>
          <li><a href="/contact">Contact Support</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Compliance</h5>
        <ul>
          <li><a href="/compliance/how-paysigur-works">How PaySigur Works</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Paysigur. All rights reserved.</span>
    </div>
  </div>
</footer>

` }} />
  );
}
