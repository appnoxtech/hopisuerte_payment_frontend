export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white p-20 max-w-4xl mx-auto leading-relaxed">
            <h1 className="text-4xl font-black italic mb-8">Privacy Policy</h1>
            <p className="mb-6 text-neutral-300">
                Your privacy is important to us. Here’s how we handle your data.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">1. Data Collection</h2>
            <p className="mb-6 text-neutral-500">
                We collect your name, email, and transaction details to facilitate the payment flow. We do NOT store payment info (Stripe handles it).
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">2. Cookies</h2>
            <p className="mb-6 text-neutral-500">
                We use cookies to maintain your login session. No tracking cookies are used for marketing purposes.
            </p>
            <h2 className="text-2xl font-bold mt-10 mb-4 text-yellow-400">3. Third Parties</h2>
            <p className="mb-6 text-neutral-500">
                We share your payment data with Stripe only to process your transaction. We do not sell your personal data to any advertisers.
            </p>
            <div className="mt-20 pt-10 border-t border-neutral-800">
                <a href="/" className="text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-wider transition-all">← Back to Home</a>
            </div>
        </div>
    );
}
