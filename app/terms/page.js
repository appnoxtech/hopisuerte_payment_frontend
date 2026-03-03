export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-20 max-w-4xl mx-auto leading-relaxed">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="mb-6">
                Welcome to HopiSuerte Payments. By using our platform, you agree to the following terms.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Use of Service</h2>
            <p className="mb-6 text-slate-400">
                You are responsible for all transactions made through your account. We act as a facilitator and are not responsible for the services or products sold by freelancers.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4">2. Payments</h2>
            <p className="mb-6 text-slate-400">
                Payments are processed via Stripe. We do not store your credit card information. Any disputes regarding payments must be handled with the payment provider.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4">3. Termination</h2>
            <p className="mb-6 text-slate-400">
                We reserve the right to suspend accounts that violate our security protocols or engage in fraudulent activities.
            </p>
            <div className="mt-20 pt-10 border-t border-slate-700">
                <a href="/" className="text-blue-500 hover:text-blue-400">← Back to Home</a>
            </div>
        </div>
    );
}
