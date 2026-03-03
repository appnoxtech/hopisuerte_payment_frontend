'use client';

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || 'pk_test_placeholder');

export default function Home() {
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

  useEffect(() => {
    // Fetch products from backend
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        if (res.data.length > 0) setSelectedProduct(res.data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

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
      console.error("Error creating payment intent", err);
      alert("Failed to start payment process. Please check your connection.");
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Loading experience...</h2>
      </div>
    );
  }

  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>HopiSuerte Payments</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Standalone payment portal for local applications and freelancers.</p>
      </div>

      <div className="payment-card">
        {!clientSecret ? (
          <form onSubmit={handleStartPayment}>
            <h2 style={{ marginBottom: '1.5rem' }}>1. Choose a Plan</h2>
            <div className="product-selector">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">
                    {product.amount}
                    <span className="product-currency">{product.currency}</span>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>2. Your Information</h2>
            <div className="input-group">
              <label className="label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                required
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="john@example.com"
                required
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="label">Phone Number (Optional)</label>
              <input
                className="input"
                type="tel"
                placeholder="+1 234 567 890"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="label">Notes / Instructions</label>
              <textarea
                className="input"
                rows="3"
                placeholder="Any special requests?"
                value={customer.notes}
                onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '1rem', background: 'var(--secondary)' }}>
              Continue to Payment
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>3. Secure Payment</h2>
              <button
                onClick={() => setClientSecret(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                ← Back
              </button>
            </div>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Paying <strong>{selectedProduct.amount} {selectedProduct.currency}</strong> for <strong>{selectedProduct.name}</strong>
            </p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={selectedProduct.amount} currency={selectedProduct.currency} />
            </Elements>
          </div>
        )}
      </div>

      <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
        &copy; 2026 HopiSuerte Solutions. All rights reserved.
      </footer>
    </main>
  );
}
