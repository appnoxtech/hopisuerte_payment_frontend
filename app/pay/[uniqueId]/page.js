'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import Image from 'next/image';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

import CustomDropdown from '@/components/CustomDropdown';

export default function UniqueProductPaymentPage() {

    const { uniqueId } = useParams();
    const searchParams = useSearchParams();

    const urlAmount = searchParams.get('amount');
    const urlCurrency = searchParams.get('currency');

    const [product, setProduct] = useState(null);
    const [amount, setAmount] = useState(urlAmount || '');
    const [currency, setCurrency] = useState(urlCurrency || 'USD');
    const [isCurrencyLocked, setIsCurrencyLocked] = useState(!!urlCurrency);
    const [isAmountPreFilled, setIsAmountPreFilled] = useState(!!urlAmount);

    const currencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'XCG', value: 'XCG' }
    ];

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
                const data = res.data.product ? res.data : { product: res.data, prefilled_currency: null };
                setProduct(data.product);
                if (data.prefilled_currency) {
                    setCurrency(data.prefilled_currency);
                    setIsCurrencyLocked(true);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Product not found or link expired.');
                setLoading(false);
            });

    }, [uniqueId]);

    const handleStartPayment = async (e) => {
        e.preventDefault();

        if (!product || !amount || isNaN(amount) || parseFloat(amount) < 0.50) {
            alert("Amount must be greater than 0.50");
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
            alert("Payment initialization failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={msgStyle}>Loading payment portal...</div>;
    if (error) return <div style={{ ...msgStyle, color: '#ef4444' }}>{error}</div>;

    return (
        <main style={mainStyle}>

            <div style={glowStyle} />

            <div style={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 10 }}>
                {/* Header with Logo */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Image
                        src="/paysigur.png"
                        alt="Paysigur"
                        width={180}
                        height={54}
                        priority
                        style={{ objectFit: 'contain', margin: '0 auto 12px auto' }}
                    />
                    {/* <p style={{ color: '#71717a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                        Secure Checkout • Stripe & iDEAL
                    </p> */}
                    {/* <h1 style={{ fontSize: 24, fontWeight: 900, textTransform: 'uppercase', color: '#fff', marginTop: 24, marginBottom: 8, lineHeight: 1.1 }}>
                        {product?.name}
                    </h1> */}
                </div>

                {/* Card */}
                <div style={cardStyle}>

                    {!clientSecret ? (

                        <form onSubmit={handleStartPayment}>

                            {/* Brand Header */}


                            {/* Amount - only show if not pre-filled from home page */}
                            {!isAmountPreFilled && (
                                <div style={{ marginBottom: 20 }}>
                                    <label style={labelStyle}>Amount</label>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={currencySymbol}>
                                                {currency === 'EUR' ? '€' : (currency === 'XCG' ? 'Cg' : '$')}
                                            </span>
                                            <input
                                                type="number"
                                                min="0.50"
                                                step="0.01"
                                                required
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                style={{ ...inputStyle, paddingLeft: 34 }}
                                            />
                                        </div>
                                        <div style={{ width: 100, opacity: isCurrencyLocked ? 0.6 : 1, pointerEvents: isCurrencyLocked ? 'none' : 'auto' }}>
                                            <CustomDropdown
                                                options={currencyOptions}
                                                value={currency}
                                                onChange={(val) => setCurrency(val)}
                                                showSearch={false}
                                                placeholder="USD"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Customer */}
                            <div style={{ marginBottom: 20 }}>

                                <label style={labelStyle}>Your Details</label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                                    <input
                                        style={inputStyle}
                                        placeholder="Full Name"
                                        required
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
                                        placeholder="Phone (Optional)"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    />

                                    <textarea
                                        rows={2}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        placeholder="Notes (Optional)"
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    />

                                </div>
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={submitting || !amount}
                                style={submitStyle}
                            >
                                {submitting
                                    ? "Processing..."
                                    : `Pay ${amount ? Number(amount).toFixed(2) : '0.00'} ${currency}`
                                }
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

/* ---------------- STYLES ---------------- */

const mainStyle = {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
};

const containerStyle = {
    width: '100%',
    maxWidth: 420,
    zIndex: 2
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 24
};

const logoWrap = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const subtitleStyle = {
    fontSize: 12,
    color: '#71717a',
    marginTop: 8,
    letterSpacing: 1
};

const labelStyle = {
    fontSize: 13,
    color: '#cbd5f5',
    marginBottom: 6,
    display: 'block'
};

const productTitle = {
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center'
};

const inputStyle = {
    width: '100%',
    padding: 12,
    background: '#09090b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none'
};

const currencySymbol = {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#facc15',
    fontWeight: 700
};

const submitStyle = {
    width: '100%',
    marginTop: 6,
    padding: 14,
    background: '#facc15',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14
};

const glowStyle = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 600,
    height: 300,
    background: 'rgba(250,204,21,0.12)',
    borderRadius: '50%',
    filter: 'blur(120px)'
};

const msgStyle = {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 500,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000'
};