import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050506] text-white selection:bg-yellow-500 selection:text-black overflow-x-hidden">
      {/* Ambient Background Infrastructure */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-400/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-yellow-600/[0.02] rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}
        ></div>
      </div>

      {/* Premium Navigation */}
      <nav className="sticky top-0 z-[100] border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-transform group-hover:scale-105">
              <span className="text-black font-black text-2xl italic">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter italic leading-none">
                HopiSuerte
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-600 font-black mt-0.5">Payment Systems</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <Link href="/admin/login" className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">
              Login
            </Link>
            <Link href="/admin/login" className="saas-btn-primary py-3 px-8">
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Section 1 — Hero Section (Strictly Centered) */}
      <section className="relative pt-32 pb-40 px-8 overflow-hidden z-10 flex flex-col items-center justify-center">
        <div className="max-w-[1200px] mx-auto text-center space-y-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-yellow-400/[0.03] border border-yellow-400/10 rounded-full text-yellow-500 animate-fade-in shadow-inner">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Payment Processing</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase italic animate-fade-in-up">
              Manage Payments <br />
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent not-italic">
                From One Dashboard.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-zinc-400 font-medium leading-relaxed animate-fade-in delay-200">
              Create payment links, accept global payments, and track transactions in real time
              through a secure and scalable platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in delay-300">
            <Link href="/admin/login" className="saas-btn-primary w-full sm:w-auto px-16 py-6 text-sm">
              Create Payment Link
            </Link>
            <Link href="/admin/login" className="saas-btn-secondary w-full sm:w-auto px-16 py-6 text-sm">
              View Dashboard
            </Link>
          </div>

          {/* Supported Networks (Centered) */}
          <div className="pt-24 animate-fade-in delay-500 w-full text-center">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-10">Integrated with trusted networks</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-black italic tracking-tighter">STRIPE</span>
              <span className="text-2xl font-black italic tracking-tighter">IDEAL</span>
              <span className="text-2xl font-black italic tracking-tighter">MASTERCARD</span>
              <span className="text-2xl font-black italic tracking-tighter">VISA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Core Features (Symmetrical & Refined) */}
      <section className="px-8 pb-32 z-10 relative flex flex-col items-center">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center w-full">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">Core Capabilities</h3>
            <p className="text-zinc-500 font-semibold max-w-lg mx-auto text-sm">Everything you need to manage your merchant operations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              {
                title: 'Payment Links',
                desc: 'Create unique payment links to accept payments from clients anywhere in seconds.',
                icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
                stats: 'Instant Setup'
              },
              {
                title: 'Global Payments',
                desc: 'Accept payments from multiple countries and currencies with seamless Stripe integration.',
                icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
                stats: 'Multi-Currency'
              },
              {
                title: 'Transaction Monitoring',
                desc: 'Track payment status and incoming transactions in real time with detailed status updates.',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                stats: 'Real-Time'
              },
              {
                title: 'Analytics Dashboard',
                desc: 'View revenue, transaction history, and payment performance in a unified manager.',
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                stats: 'Insights'
              }
            ].map((item, i) => (
              <div key={i} className="glass-card group p-8 hover:border-yellow-500/30 flex flex-col items-center text-center w-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.02] rounded-full blur-3xl group-hover:bg-yellow-500/[0.05] transition-colors"></div>
                <div className="flex flex-col h-full gap-6 relative z-10 items-center justify-center">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-yellow-500 shadow-2xl group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <h3 className="text-base md:text-lg font-black uppercase tracking-tighter italic">{item.title}</h3>
                      <span className="text-[8px] font-black text-yellow-500/40 uppercase tracking-widest">{item.stats}</span>
                    </div>
                    <p className="text-zinc-500 text-[13px] leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Platform Overview (Centered & Refined) */}
      <section className="px-8 py-32 bg-white/[0.02] border-y border-white/[0.05] relative z-10 flex flex-col items-center">
        <div className="max-w-[800px] mx-auto text-center space-y-6 flex flex-col items-center">
          <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-center">A Unified Payment Experience</h3>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto text-center">
            HopiSuerte builds the bridge between merchants and global commerce.
            Manage payments, monitor real-time growth, and generate links
            without the integration overhead.
          </p>
        </div>
      </section>

      {/* Section 4 — Product Benefits (Balanced & Centered) */}
      <section className="px-8 py-48 z-10 relative">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10 flex flex-col items-center text-center">
            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight">
              Designed for <br />
              <span className="text-yellow-500">Accelerated Growth.</span>
            </h3>
            <div className="space-y-8 w-full max-w-2xl mx-auto">
              {[
                { title: 'Fast Payment Collection', desc: 'Reduce the time between billing and settlement with optimized flows.' },
                { title: 'Simple Link Generation', desc: 'Create and share payment links via any channel in one click.' },
                { title: 'Real-Time Tracking', desc: 'Get instant notifications and status updates for every transaction.' },
                { title: 'Secure Processing', desc: 'Enterprise-grade security protocols ensuring safety at Every step.' }
              ].map((benefit, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">{benefit.title}</h4>
                    <p className="text-zinc-500 text-sm font-semibold leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex relative items-center justify-center">
            <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full"></div>
            <div className="glass-card aspect-video w-full flex items-center justify-center border-white/10 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.3)]">
                  <span className="text-black font-black text-5xl italic">H</span>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.5em]">Merchant Console</p>
                  <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em]">Build Stable v2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Call to Action (Centered & Compact) */}
      <section className="px-8 pb-48 z-10 relative flex flex-col items-center">
        <div className="max-w-[1000px] w-full mx-auto glass-card p-16 text-center space-y-10 border-yellow-500/20 shadow-2xl flex flex-col items-center">
          <div className="space-y-4">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">Start Accepting Payments Today</h3>
            <p className="text-zinc-400 text-base font-medium max-w-xl mx-auto">Join hundreds of merchants using HopiSuerte to power their global commerce.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            <Link href="/admin/login" className="saas-btn-primary px-16 py-6 text-sm w-full sm:w-auto">
              Create Payment Link
            </Link>
            <Link href="/admin/login" className="saas-btn-secondary px-16 py-6 text-sm w-full sm:w-auto">
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Centered & Balanced) */}
      <footer className="border-t border-white/5 bg-black/80 backdrop-blur-3xl relative z-20">
        <div className="max-w-[1400px] mx-auto px-12 py-24 flex flex-col md:flex-row justify-between items-center md:items-start gap-20 text-center md:text-left">
          <div className="space-y-10 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic leading-none">H</span>
              </div>
              <p className="text-zinc-400 text-sm font-black uppercase tracking-tighter italic">HopiSuerte Platform</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Professional Payment Solutions</p>
              <p className="text-[10px] text-zinc-800 font-bold tracking-[0.2em]">&copy; 2026 HopiSuerte &bull; All Rights Reserved</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 md:gap-32 w-full md:w-auto">
            <div className="space-y-8 flex flex-col items-center md:items-start">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Operational</h4>
              <div className="flex flex-col gap-6">
                <Link href="/admin/login" className="text-[10px] font-bold text-zinc-600 hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Login</Link>
                <Link href="/admin/login" className="text-[10px] font-bold text-zinc-600 hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Dashboard</Link>
              </div>
            </div>
            <div className="space-y-8 flex flex-col items-center md:items-start">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Compliance</h4>
              <div className="flex flex-col gap-6">
                <Link href="/terms" className="text-[10px] font-bold text-zinc-600 hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Terms of Service</Link>
                <Link href="/privacy" className="text-[10px] font-bold text-zinc-600 hover:text-yellow-500 transition-colors uppercase tracking-[0.2em]">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}


