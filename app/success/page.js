'use client';

import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4 text-center">
            <div className="max-w-md w-full bg-neutral-900 rounded-3xl p-10 border border-neutral-800 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-black text-white mb-4 italic">Payment Successful!</h1>
                <p className="text-neutral-500 mb-8 leading-relaxed">
                    Thank you for your payment. A confirmation has been sent to your email, and the freelancer has been notified.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => window.close()}
                        className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-900/10"
                    >
                        Close Window
                    </button>
                    <Link href="/" className="block text-sm text-yellow-500 hover:text-yellow-400 transition-all font-bold uppercase tracking-wider">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
