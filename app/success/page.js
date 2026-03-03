export default function SuccessPage() {
    return (
        <main className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
            <div className="payment-card">
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
                <h1 style={{ marginBottom: '1rem' }}>Payment Successful!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Thank you for your payment. A confirmation has been sent to your email.
                </p>
                <a href="/" className="btn">
                    Back to Portal
                </a>
            </div>
        </main>
    );
}
