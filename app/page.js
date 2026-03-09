'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
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
        if (activeOnes.length > 0) setSelectedProduct(activeOnes[0]);
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

    router.push(`/pay/${selectedProduct.unique_payment_id}?amount=${amount}&currency=${currency}`);
  };

  if (loading) return <div style={msgStyle}>Initializing Paysigur Portal...</div>;

  return (
    <main style={mainStyle}>

      {/* Staff Login */}
      <div style={loginStyle}>
        <Link href="/admin/login" style={loginLink}>
          Login
        </Link>
      </div>

      {/* Background Glow */}
      <div style={glowStyle} />

      <div style={containerStyle}>

        {/* Logo */}
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            width: '100%'
          }}
        >
          <Image
            src="/paysigur.png"
            alt="Paysigur"
            width={170}
            height={50}
            priority
            style={{ objectFit: 'contain' }}
          />

          {/* <p
            style={{
              color: '#71717a',
              fontSize: 12,
              letterSpacing: 1
            }}
          >
            Secure Payment Portal
          </p> */}
        </div>

        {/* Payment Card */}
        <div style={cardStyle}>
          <form onSubmit={handleProceed}>

            {/* Product */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Product</label>
              <select
                style={inputStyle}
                value={selectedProduct?.id || ''}
                onChange={(e) =>
                  setSelectedProduct(products.find(p => p.id == e.target.value))
                }
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Amount</label>

              <div style={{ display: 'flex', gap: 10 }}>

                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={currencySymbol}>
                    {currency === 'EUR' ? '€' : '$'}
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
                </div>

                <select
                  style={{ ...inputStyle, width: 100 }}
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
              Continue
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}

/* ================= STYLES ================= */

const mainStyle = {
  minHeight: '100vh',
  background: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  fontFamily: 'system-ui, sans-serif',
  position: 'relative'
};

const containerStyle = {
  width: '100%',
  maxWidth: 420,
  zIndex: 10
};

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18,
  padding: 24
};

const fieldStyle = {
  marginBottom: 18
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#cbd5f5',
  marginBottom: 6
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

const submitStyle = {
  width: '100%',
  marginTop: 8,
  padding: 14,
  background: '#facc15',
  color: '#000',
  borderRadius: 10,
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
  fontSize: 14
};

const currencySymbol = {
  position: 'absolute',
  left: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#facc15',
  fontWeight: 700
};

const subtitleStyle = {
  color: '#71717a',
  fontSize: 12,
  marginTop: 8,
  letterSpacing: 1
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

const loginStyle = {
  position: 'absolute',
  top: 20,
  right: 30
};

const loginLink = {
  color: '#71717a',
  fontSize: 16,
  fontWeight: 700,
  textDecoration: 'none',
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