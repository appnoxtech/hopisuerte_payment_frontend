export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white p-20 max-w-4xl mx-auto leading-relaxed">
            <h1 className="text-4xl font-black italic mb-8">Terms of Service</h1>
            <p className="mb-6 text-neutral-300">
                Welcome to HopiSuerte Payments. By using our platform, you agree to the following terms.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">1. Use of Service</h2>
            <p className="mb-6 text-neutral-500">
                You are responsible for all transactions made through your account. We act as a facilitator and are not responsible for the services or products sold by freelancers.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">2. Payments</h2>
            <p className="mb-6 text-neutral-500">
                Payments are processed via Stripe. We do not store your credit card information. Any disputes regarding payments must be handled with the payment provider.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">3. Termination</h2>
            <p className="mb-6 text-neutral-500">
                We reserve the right to suspend accounts that violate our security protocols or engage in fraudulent activities.
            </p>
            <div className="mt-20 pt-10 border-t border-neutral-800">
                <a href="/" className="text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-wider transition-all">← Back to Home</a>
            </div>
        </div>
    );
}
