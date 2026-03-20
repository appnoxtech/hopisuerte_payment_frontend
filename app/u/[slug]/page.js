'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

import CustomDropdown from '@/components/CustomDropdown';

export default function UserPaymentPage() {

    const { slug } = useParams();

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const currencyOptions = [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'XCG', value: 'XCG' }
    ];

    const [clientSecret, setClientSecret] = useState(null);
    const [stripePromise, setStripePromise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [feePercentage, setFeePercentage] = useState(10); // Default to 10%

    useEffect(() => {
        if (!slug) return;
        api.get(`/u/${slug}`)
            .then(res => {
                setUser(res.data.user);
                setProducts(res.data.products);
                if (res.data.fee_percentage !== undefined && res.data.fee_percentage !== null) {
                    setFeePercentage(res.data.fee_percentage);
                }
                if (res.data.products.length > 0) {
                    setSelectedProduct(res.data.products[0]);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('User not found or has no active products.');
                setLoading(false);
            });
    }, [slug]);

    const handleStartPayment = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (!customer.phone) {
            alert('Phone number is required');
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post('/payments/intent', {
                product_id: selectedProduct.id,
                amount: parseFloat(amount),
                currency: currency,
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                notes: customer.notes
            });
            setClientSecret(res.data.clientSecret);
            const accountId = res.data.stripe_account || 1;
            const pk = accountId === 2 
                ? process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_2_KEY 
                : process.env.NEXT_PUBLIC_STRIPE_ACCOUNT_1_KEY;
            
            console.log(`Initializing Stripe for Account ${accountId}`);
            setStripePromise(loadStripe(pk));
        } catch {
            alert("Failed to start payment process.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                textAlign: 'center',
                color: '#001c64',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F7F9FC',
                fontSize: 18,
                fontWeight: 600
            }}>
                Loading Profile...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>
                {error}
            </div>
        );
    }

    // Dynamic Stripe initialized via intent response

    return (
        <main
            style={{
                minHeight: '100vh',
                background: '#F7F9FC',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                fontFamily: '"Inter", sans-serif'
            }}
        >
            {/* glow background */}
            <div
                style={{
                    position: 'absolute',
                    top: -200,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: 1000,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(0, 112, 224, 0.05) 0%, rgba(247, 249, 252, 0) 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />

            <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 10 }}>
                {/* header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: '#F0F7FF',
                            border: '1px solid #E3E8EF',
                            borderRadius: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto',
                            boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.1)'
                        }}
                    >
                        <span style={{ fontSize: 40, fontWeight: 900, color: '#0070E0' }}>
                            {user?.name?.charAt(0) || 'M'}
                        </span>
                    </div>

                    <h1
                        className="gradient-text"
                        style={{
                            fontSize: 42,
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            marginBottom: 8
                        }}
                    >
                        {user?.name}
                    </h1>

                    <p
                        style={{
                            color: '#6B7C93',
                            fontSize: 14,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        Verified Merchant Partner
                    </p>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E3E8EF',
                        borderRadius: 32,
                        padding: 48,
                        boxShadow: '0 25px 50px -12px rgba(0, 28, 100, 0.08)'
                    }}
                >
                    {!clientSecret ? (
                        <form onSubmit={handleStartPayment}>
                             {/* product selection */}
                            <div style={{ marginBottom: 40 }}>
                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: '#001c64',
                                        marginBottom: 20,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 32,
                                            height: 32,
                                            background: '#0070E0',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#FFF',
                                            marginRight: 12
                                        }}
                                    >
                                        1
                                    </span>
                                    Choose Service
                                </h2>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 16
                                    }}
                                >
                                    {products.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            style={{
                                                padding: 20,
                                                borderRadius: 20,
                                                border: selectedProduct?.id === product.id
                                                    ? '2px solid #0070E0'
                                                    : '2px solid #E3E8EF',
                                                cursor: 'pointer',
                                                background: selectedProduct?.id === product.id
                                                    ? '#F0F7FF'
                                                    : '#FFFFFF',
                                                transition: 'all 0.2s ease',
                                                boxShadow: selectedProduct?.id === product.id ? '0 10px 15px -3px rgba(0, 112, 224, 0.1)' : 'none'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    color: selectedProduct?.id === product.id ? '#001c64' : '#4A5568',
                                                    marginBottom: 6,
                                                    fontSize: 15,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}
                                            >
                                                {product.image_url && (
                                                    <img src={product.image_url} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                                )}
                                                <div>{product.name}</div>
                                            </div>

                                            {product.description && (
                                                <div style={{ fontSize: 11, color: '#71717a' }}>
                                                    {product.description}
                                                </div>
                                            )}

                                            {product.notes && (
                                                <div style={{ fontSize: 11, color: '#4b5563', marginTop: '4px', fontStyle: 'italic' }}>
                                                    Note: {product.notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment details */}
                            <div style={{ marginBottom: 40 }}>
                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: '#001c64',
                                        marginBottom: 20,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 32,
                                            height: 32,
                                            background: '#0070E0',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#FFF',
                                            marginRight: 12
                                        }}
                                    >
                                        2
                                    </span>
                                    Payment Amount
                                </h2>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            style={{ ...inputStyle, paddingLeft: 44, fontSize: 24, fontWeight: 900, color: '#001c64' }}
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            required
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                        <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#6B7C93', fontSize: 20, fontWeight: 800 }}>
                                            {currency === 'EUR' ? '€' : (currency === 'XCG' ? 'Cg' : '$')}
                                        </span>
                                    </div>
                                    <div style={{ width: 140 }}>
                                        <CustomDropdown
                                            options={currencyOptions}
                                            value={currency}
                                            onChange={(val) => setCurrency(val)}
                                            showSearch={false}
                                            placeholder="USD"
                                        />
                                    </div>

                                </div>
                                <div style={{ marginTop: '8px', fontSize: '12px', color: '#0070E0', fontWeight: 'bold' }}>
                                    A {feePercentage}% exchange and processing fee will be added to your total amount.
                                </div>
                            </div>
                             {/* customer form */}
                            <div style={{ marginBottom: 40 }}>
                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: '#001c64',
                                        marginBottom: 20,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 32,
                                            height: 32,
                                            background: '#0070E0',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#FFF',
                                            marginRight: 12
                                        }}
                                    >
                                        3
                                    </span>
                                    Information
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                                        required
                                        placeholder="Phone Number"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                    <textarea
                                        rows={3}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        placeholder="Notes"
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Payment Summary Breakdown */}
                            {amount && !isNaN(amount) && parseFloat(amount) > 0 && (
                                <div style={{ marginBottom: 40, padding: '24px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1E293B', fontWeight: '800' }}>Payment Summary</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: 12, color: '#475569' }}>
                                        <span>Entered Amount:</span>
                                        <span style={{ fontWeight: '500' }}>{currency} {parseFloat(amount).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: 16, color: '#475569' }}>
                                        <span>Processing Fee ({feePercentage}%):</span>
                                        <span style={{ fontWeight: '500' }}>{currency} {(parseFloat(amount) * (feePercentage / 100)).toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', paddingTop: 16, borderTop: '1px solid #CBD5E1', color: '#0F172A', fontWeight: '800' }}>
                                        <span>Total Payable Amount:</span>
                                        <span>{currency} {(parseFloat(amount) * (1 + feePercentage / 100)).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                             {/* submit */}
                            <button
                                type="submit"
                                disabled={!selectedProduct || !amount || submitting}
                                style={{
                                    width: '100%',
                                    padding: 20,
                                    background: '#0070E0',
                                    color: '#FFF',
                                    borderRadius: 16,
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: 18,
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 15px -3px rgba(0, 112, 224, 0.2)',
                                    transition: 'all 0.2s ease',
                                    opacity: !selectedProduct || !amount || submitting ? 0.5 : 1
                                }}
                            >
                                {submitting ? 'Processing...' : `Pay ${amount ? (parseFloat(amount) * 1.1).toFixed(2) : '0.00'} ${currency}`}
                            </button>

                        </form>
                    ) : (
                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <CheckoutForm
                                amount={amount}
                                currency={currency}
                            />
                        </Elements>
                    )}
                </div>
            </div>
        </main>
    );

}


const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: 12,
    color: '#1A1F36',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
};