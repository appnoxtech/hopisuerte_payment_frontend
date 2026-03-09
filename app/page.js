'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const activeOnes = res.data.filter(p => p.active);
        setProducts(activeOnes);
        if (activeOnes.length > 0) {
          setSelectedProduct(activeOnes[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleProceed = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Redirect to the "Your Details" page (which is the product unique link page)
    // Passing amount and currency via query parameters
    router.push(`/pay/${selectedProduct.unique_payment_id}?amount=${amount}&currency=${currency}`);
  };

  if (loading) return <div style={msgStyle}>Initializing Paysigur Portal...</div>;

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
        padding: 24,
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Header / Nav */}
      <div style={{ position: 'absolute', top: 20, right: 30, zIndex: 50 }}>
        <Link href="/admin/login" style={{ color: '#71717a', fontSize: 12, textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Staff Login
        </Link>
      </div>

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
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#facc15' }}>P</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, textTransform: 'uppercase', color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
            Paysigur Gateway
          </h1>
          <p style={{ color: '#71717a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
            Secure Payment Portal &bull; Start Transaction
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 32px' }}>
          <form onSubmit={handleProceed}>
            {/* Product Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Select Product</label>
              <select
                style={inputStyle}
                value={selectedProduct?.id || ''}
                onChange={(e) => setSelectedProduct(products.find(p => p.id == e.target.value))}
                required
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Payment Amount & Currency */}
            <div style={{ marginBottom: 30 }}>
              <h2 style={labelStyle}>Payment Details</h2>
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

            <button type="submit" style={submitStyle}>
              Proceed to Your Details
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 16,
  fontWeight: 800,
  color: '#fff',
  textTransform: 'uppercase',
  marginBottom: 16
};

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

const submitStyle = {
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
  fontSize: 15,
  transition: 'transform 0.1s active'
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