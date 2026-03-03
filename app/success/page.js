'use client';

import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-center">
            <div className="max-w-md w-full bg-[#1e293b] rounded-3xl p-10 border border-slate-700 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black text-white mb-4">Payment Successful!</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Thank you for your payment. A confirmation has been sent to your email, and the freelancer has been notified.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.close()}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700"
                    >
                        Close Window
                    </button>
                    <Link href="/" className="block text-sm text-blue-400 hover:text-blue-300 transition-all font-medium">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
