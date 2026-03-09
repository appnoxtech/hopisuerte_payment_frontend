'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

export default function UniqueProductPaymentPage() {
    const { uniqueId } = useParams();
    const searchParams = useSearchParams();

    // Initialize from URL if present
    const urlAmount = searchParams.get('amount');
    const urlCurrency = searchParams.get('currency');

    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(urlAmount || '');
    const [currency, setCurrency] = useState(urlCurrency || 'USD');
    const [isPreFilled, setIsPreFilled] = useState(!!urlAmount);

    // Update state if URL params change (though they usually won't in this flow)
    useEffect(() => {
        if (urlAmount) {
            setAmount(urlAmount);
            setIsPreFilled(true);
        }
        if (urlCurrency) {
            setCurrency(urlCurrency);
        }
    }, [urlAmount, urlCurrency]);

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!uniqueId) return;

        api.get(`/product/link/${uniqueId}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Product not found or link has expired.');
                setLoading(false);
            });
    }, [uniqueId]);

    const handleStartPayment = async (e) => {
        e.preventDefault();

        if (!product || !amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await api.post('/payments/intent', {
                product_id: product.id,
                amount: parseFloat(amount),
                currency: currency.toUpperCase(),
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                notes: customer.notes
            });

            setClientSecret(res.data.clientSecret);
        } catch {
            alert("Failed to start payment process. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={msgStyle}>Loading payment portal...</div>;
    if (error) return <div style={{ ...msgStyle, color: '#ef4444' }}>{error}</div>;

    return (
        <main
            style={{
                minHeight: '100vh',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 900,
                    height: 400,
                    background: 'rgba(250,204,21,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    pointerEvents: 'none'
                }}
            />

            <div style={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 10 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: '#facc15' }}>{isPreFilled ? '✓' : '$'}</span>
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
                        {product?.name}
                    </h1>
                    <p style={{ color: '#71717a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                        {isPreFilled ? `COMPLETE YOUR DETAILS FOR ${amount} ${currency}` : 'Secure Checkout • Select Amount & Currency'}
                    </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 32px' }}>
                    {!clientSecret ? (
                        <form onSubmit={handleStartPayment}>
                            {/* Payment Amount & Currency (Only show if NOT pre-filled) */}
                            {!isPreFilled && (
                                <div style={{ marginBottom: 30 }}>
                                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>
                                        Payment Details
                                    </h2>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#facc15', fontSize: 20, fontWeight: 800 }}>
                                                {currency === 'EUR' ? '€' : '$'}
                                            </span>
                                            <input
                                                style={{ ...inputStyle, paddingLeft: 44, fontSize: 24, fontWeight: 900, color: '#facc15' }}
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            style={{ ...inputStyle, width: 120, fontWeight: 800, textAlign: 'center', cursor: 'pointer' }}
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="XCG">XCG</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Client Identification */}
                            <div style={{ marginBottom: 32 }}>
                                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>
                                    Your Details
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <input
                                        style={inputStyle}
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                    <input
                                        style={inputStyle}
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        value={customer.email}
                                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    />
                                    <input
                                        style={inputStyle}
                                        type="tel"
                                        placeholder="Phone Number (Optional)"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                    <textarea
                                        rows={3}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        placeholder="Add a note (Optional)"
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting || !amount}
                                style={{
                                    width: '100%',
                                    padding: 20,
                                    background: '#facc15',
                                    color: '#000',
                                    borderRadius: 14,
                                    border: 'none',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.5,
                                    cursor: 'pointer',
                                    opacity: submitting || !amount ? 0.6 : 1,
                                    transition: 'opacity 0.2s',
                                    fontSize: 15
                                }}
                            >
                                {submitting ? 'Authenticating...' : `Pay ${amount ? Number(amount).toFixed(2) : '0.00'} ${currency}`}
                            </button>
                        </form>
                    ) : (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm amount={amount} currency={currency} />
                        </Elements>
                    )}
                </div>
            </div>
        </main>
    );
}

const inputStyle = {
    width: '100%',
    padding: 16,
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s'
};

const msgStyle = {
    textAlign: 'center',
    marginTop: 100,
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: 600,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000'
};
