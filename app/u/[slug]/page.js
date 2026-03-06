'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

export default function UserPaymentPage() {

    const { slug } = useParams();

    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

        if (!slug) return;

        api.get(`/u/${slug}`)
            .then(res => {

                setUser(res.data.user);
                setProducts(res.data.products);

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

        setSubmitting(true);

        try {

            const res = await api.post('/payments/intent', {

                product_id: selectedProduct.id,
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                notes: customer.notes

            });

            setClientSecret(res.data.clientSecret);

        } catch {

            alert("Failed to start payment process.");

        } finally {

            setSubmitting(false);

        }

    };



    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: 80, color: '#94a3b8' }}>
                Loading payment profile...
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

            {/* glow background */}

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


            <div style={{ width: '100%', maxWidth: 720, position: 'relative', zIndex: 10 }}>


                {/* header */}

                <div style={{ textAlign: 'center', marginBottom: 40 }}>

                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px auto'
                        }}
                    >

                        <span style={{ fontSize: 40, fontWeight: 900, color: '#facc15' }}>
                            {user?.name?.charAt(0) || 'H'}
                        </span>

                    </div>


                    <h1
                        style={{
                            fontSize: 42,
                            fontWeight: 900,
                            letterSpacing: -1,
                            textTransform: 'uppercase',
                            color: '#fff',
                            marginBottom: 8
                        }}
                    >
                        {user?.name}
                    </h1>

                    <p
                        style={{
                            color: '#71717a',
                            fontSize: 13,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 2
                        }}
                    >
                        Global Payment Gateway
                    </p>

                </div>



                <div
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 24,
                        padding: 40
                    }}
                >



                    {!clientSecret ? (

                        <form onSubmit={handleStartPayment}>



                            {/* product selection */}

                            <div style={{ marginBottom: 40 }}>

                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 900,
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        marginBottom: 20,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >

                                    <span
                                        style={{
                                            width: 32,
                                            height: 32,
                                            background: '#facc15',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 12,
                                            color: '#000',
                                            marginRight: 12
                                        }}
                                    >
                                        1
                                    </span>

                                    Select Product

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
                                                borderRadius: 16,
                                                border: selectedProduct?.id === product.id
                                                    ? '2px solid #facc15'
                                                    : '2px solid rgba(255,255,255,0.05)',
                                                cursor: 'pointer',
                                                background: selectedProduct?.id === product.id
                                                    ? 'rgba(250,204,21,0.05)'
                                                    : 'rgba(255,255,255,0.02)'
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    color: '#fff',
                                                    marginBottom: 6,
                                                    fontSize: 13,
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                {product.name}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 26,
                                                    fontWeight: 900,
                                                    color: '#facc15'
                                                }}
                                            >
                                                {product.amount}

                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: '#71717a',
                                                        marginLeft: 6,
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {product.currency}
                                                </span>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>



                            {/* customer form */}

                            <div style={{ marginBottom: 40 }}>

                                <h2
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 900,
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        marginBottom: 20
                                    }}
                                >
                                    Client Identity
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



                            {/* submit */}

                            <button
                                type="submit"
                                disabled={!selectedProduct}
                                style={{
                                    width: '100%',
                                    padding: 20,
                                    background: '#facc15',
                                    color: '#000',
                                    borderRadius: 14,
                                    border: 'none',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: 2,
                                    cursor: 'pointer',
                                    opacity: !selectedProduct ? 0.5 : 1
                                }}
                            >
                                {submitting ? 'Processing...' : 'Initialize Transaction'}
                            </button>


                        </form>

                    ) : (

                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <CheckoutForm
                                amount={selectedProduct.amount}
                                currency={selectedProduct.currency}
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
    padding: 14,
    background: '#000',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 14
};