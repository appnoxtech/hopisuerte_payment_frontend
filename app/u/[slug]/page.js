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

    useEffect(() => {
        if (!slug) return;

        api.get(`/u/${slug}`)
            .then(res => {
                setUser(res.data.user);
                setProducts(res.data.products);
                if (res.data.products.length > 0) setSelectedProduct(res.data.products[0]);
                setLoading(false);
            })
            .catch(err => {
                setError('User not found or has no active products.');
                setLoading(false);
            });
    }, [slug]);

    const handleStartPayment = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        try {
            const res = await api.post('/payments/intent', {
                product_id: selectedProduct.id,
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                notes: customer.notes
            });
            setClientSecret(res.data.clientSecret);
        } catch (err) {
            alert("Failed to start payment process.");
        }
    };

    if (loading) return <div className="text-center mt-20 text-slate-400">Loading payment profile...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <main className="container min-h-screen py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Pay {user?.name}
                </h1>
                <p className="text-neutral-400 text-lg">Select a service and complete your payment securely.</p>
            </div>

            <div className="payment-card max-w-2xl mx-auto bg-black rounded-3xl p-8 border border-neutral-800 shadow-2xl">
                {!clientSecret ? (
                    <form onSubmit={handleStartPayment} className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
                                <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-black mr-3">1</span>
                                Choose a Service
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {products.map(product => (
                                    <div
                                        key={product.id}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedProduct?.id === product.id
                                            ? 'border-yellow-400 bg-yellow-400/5'
                                            : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                                            }`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <div className="font-bold text-white mb-1">{product.name}</div>
                                        <div className="text-2xl font-black text-yellow-400">
                                            {product.amount} <span className="text-sm font-normal text-neutral-500">{product.currency}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
                                <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-black mr-3">2</span>
                                Your Information
                            </h2>
                            <div className="space-y-4">
                                <div className="input-group">
                                    <label className="label">Full Name</label>
                                    <input
                                        className="input bg-black border-neutral-800"
                                        type="text"
                                        required
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Email Address</label>
                                    <input
                                        className="input bg-black border-neutral-800"
                                        type="email"
                                        required
                                        value={customer.email}
                                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Phone (Optional)</label>
                                    <input
                                        className="input bg-black border-neutral-800"
                                        type="tel"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Notes</label>
                                    <textarea
                                        className="input bg-black border-neutral-800"
                                        rows="3"
                                        value={customer.notes}
                                        onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-900/30">
                            Continue to Secure Payment
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">3. Finalize Payment</h2>
                            <button
                                onClick={() => setClientSecret(null)}
                                className="text-neutral-500 hover:text-white text-sm"
                            >
                                ← Back
                            </button>
                        </div>
                        <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl">
                            <p className="text-neutral-300">
                                Total: <strong className="text-white text-xl">{selectedProduct.amount} {selectedProduct.currency}</strong>
                            </p>
                            <p className="text-neutral-500 text-sm italic">{selectedProduct.name}</p>
                        </div>
                        <Elements stripe={stripePromise} options={{
                            clientSecret,
                            appearance: {
                                theme: 'night',
                                variables: {
                                    colorPrimary: '#facc15',
                                    colorBackground: '#000000',
                                    colorText: '#ffffff',
                                    colorDanger: '#ef4444',
                                    fontFamily: 'Outfit, sans-serif',
                                    borderRadius: '16px',
                                }
                            }
                        }}>
                            <CheckoutForm amount={selectedProduct.amount} currency={selectedProduct.currency} />
                        </Elements>
                    </div>
                )}
            </div>
        </main>
    );
}
