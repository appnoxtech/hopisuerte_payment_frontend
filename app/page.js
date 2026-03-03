import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container px-6 py-6 flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            HopiSuerte Payments
          </h1>
          <div className="flex items-center space-x-6">
            <Link href="/admin/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-all">
              Sign In
            </Link>
            <Link
              href="/admin/register"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-6 py-24 md:py-32 flex flex-col items-center text-center mx-auto">
        <div className="max-w-4xl space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
            Standalone Freelance Payment Portal
          </div>
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Receive Secure Payments <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">
              Lightning Fast.
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            HopiSuerte Payments gives you a dedicated URL to share with clients. No complex integrations, just a clean payment experience that gets you paid.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/admin/register"
              className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/30 text-center"
            >
              Create Your Free Account
            </Link>
            <Link
              href="/admin/login"
              className="w-full md:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 text-lg font-bold rounded-2xl transition-all border border-slate-700 text-center"
            >
              Merchant Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              title: 'Custom Payment URLs',
              desc: 'Get a unique link (u/your-name) to share with clients for instant Checkout.',
              icon: '🔗'
            },
            {
              title: 'Global Payments',
              desc: 'Accept payments in any currency via Stripe, including iDEAL and cards.',
              icon: '🌍'
            },
            {
              title: 'Real-time Tracking',
              desc: 'A dedicated dashboard to manage your products and track every transaction.',
              icon: '📊'
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-[#1e293b] rounded-3xl border border-slate-700/50 hover:border-blue-500/30 transition-all text-left">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-20">
        <div className="container px-6 py-12 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            &copy; 2026 HopiSuerte Solutions. Built for freelancers.
          </p>
          <div className="flex space-x-8">
            <Link href="/terms" className="text-sm text-slate-500 hover:text-white transition-all">Terms</Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-white transition-all">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

