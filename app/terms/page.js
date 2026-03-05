import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
                <div className="flex items-center gap-4 mb-16">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                        <span className="text-yellow-500 font-black text-2xl">L</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Terms of Service</h1>
                        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mt-1">Platform Agreement v1.0</p>
                    </div>
                </div>

                <div className="glass-card p-10 space-y-12">
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            01. Agreement to Terms
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            By using HopiSuerte Payments, you agree to comply with and be bound by these Terms of Service.
                            Our platform provides payment processing tools for merchants. Users assume full responsibility
                            for their business operations and interactions with customers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            02. Payments and Transactions
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            All financial transactions are processed securely through the Stripe payment gateway.
                            HopiSuerte does not store sensitive credit card or banking information.
                            Any disputes related to payments are subject to the policies of the respective payment provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            03. Account Termination
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            We reserve the right to suspend or terminate access to the platform if we detect fraudulent activity,
                            security violations, or breach of these terms.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5">
                    <Link href="/" className="saas-btn-secondary inline-flex items-center gap-3 px-8 py-3 text-[10px] font-black uppercase tracking-widest">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
