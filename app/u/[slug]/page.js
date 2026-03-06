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
        } catch (err) {
            alert("Failed to start payment process.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-20 text-slate-400">Loading payment profile...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-2xl relative z-10 animate-fade-in-up">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-4xl font-black text-yellow-500">{user?.name?.charAt(0) || 'H'}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mb-2">
                        {user?.name}
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Global Payment Gateway</p>
                </div>

                <div className="glass-card p-10 mt-8">
                    {!clientSecret ? (
                        <form onSubmit={handleStartPayment} className="space-y-8">
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center mb-6">
                                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-black mr-3 shadow-[0_0_15px_rgba(250,204,21,0.5)]">1</span>
                                    Select Product
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map(product => (
                                        <div
                                            key={product.id}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedProduct?.id === product.id
                                                ? 'border-yellow-400 bg-yellow-400/5 shadow-[0_0_20px_rgba(250,204,21,0.1)]'
                                                : 'border-white/5 bg-white/[0.02] hover:bg-white-[0.05] hover:border-white/10'
                                                }`}
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            <div className="font-bold text-white mb-1 uppercase tracking-tight text-sm">{product.name}</div>
                                            <div className="text-2xl font-black text-yellow-500">
                                                {product.amount} <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{product.currency}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center mb-6">
                                    <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs text-zinc-400 mr-3 border border-white/5">2</span>
                                    Client Identity
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 pl-1">Full Name</label>
                                        <input
                                            className="saas-input text-base"
                                            type="text"
                                            required
                                            value={customer.name}
                                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 pl-1">Email Address</label>
                                        <input
                                            className="saas-input text-base"
                                            type="email"
                                            required
                                            value={customer.email}
                                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 pl-1">Phone Number <span className="text-zinc-700">(Optional)</span></label>
                                        <input
                                            className="saas-input text-base"
                                            type="tel"
                                            value={customer.phone}
                                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 pl-1">Notes <span className="text-zinc-700">(Optional)</span></label>
                                        <textarea
                                            className="saas-input text-base resize-none"
                                            rows="3"
                                            value={customer.notes}
                                            onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                                            placeholder="Add any special instructions..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <button type="submit" disabled={!selectedProduct} className="saas-btn-primary w-full py-5 text-base uppercase tracking-widest disabled:opacity-50">
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Initialize Transaction'
                                    )}
                                </button>
                                <p className="text-center text-[10px] font-bold text-zinc-600 mt-4 uppercase tracking-widest">Secured by Stripe</p>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
                                    <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-black mr-3">3</span>
                                    Finalize Payment
                                </h2>
                                <button
                                    onClick={() => setClientSecret(null)}
                                    className="text-zinc-500 hover:text-yellow-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Back
                                </button>
                            </div>
                            <div className="p-6 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Selected Plan</p>
                                    <p className="text-white text-sm font-bold truncate max-w-[200px]">{selectedProduct.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Total</p>
                                    <div className="text-2xl font-black text-white">
                                        {selectedProduct.amount} <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{selectedProduct.currency}</span>
                                    </div>
                                </div>
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
                                        fontFamily: 'minion-pro, sans-serif',
                                        borderRadius: '16px',
                                    }
                                }
                            }}>
                                <CheckoutForm amount={selectedProduct.amount} currency={selectedProduct.currency} />
                            </Elements>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
