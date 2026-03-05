'use client';

import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md glass-card p-10 relative z-10 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner animate-bounce-subtle">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Payment Verified</h1>
                <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">
                    Transaction completed successfully. A digital receipt has been dispatched to your inbox, and the merchant has been notified of the settlement.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.close()}
                        className="saas-btn-primary w-full py-4 text-sm"
                    >
                        Securely Close Window
                    </button>
                    <Link
                        href="/"
                        className="block py-4 text-xs text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5"
                    >
                        Return to Hub
                    </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Transaction Finalized</span>
                </div>
            </div>
        </div>
    );
}
