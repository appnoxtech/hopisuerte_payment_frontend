import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
                <div className="flex items-center gap-4 mb-16">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                        <span className="text-yellow-500 font-black text-2xl">P</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Privacy Policy</h1>
                        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] mt-1">Information Security v1.0</p>
                    </div>
                </div>

                <div className="glass-card p-10 space-y-12">
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            01. Information Collection
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            We collect essential business information (name, email) and transaction details required to provide our payment services.
                            Sensitive financial data is processed exclusively by Stripe and is not stored on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            02. Cookies and Storage
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            Our platform uses secure local storage and identifiers to manage your session and provide a consistent user experience.
                            We do not use tracking technologies for advertising or third-party marketing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500 mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                            03. Data Security
                        </h2>
                        <p className="text-zinc-400 leading-relaxed font-medium">
                            We prioritize the security of your data through strict access controls and encryption.
                            We do not sell user data. Information is only shared with authorized payment providers
                            to facilitate transaction processing.
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
