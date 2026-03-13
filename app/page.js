'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CustomDropdown from '@/components/CustomDropdown';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  const productOptions = products.map(p => ({ label: p.name, value: p.id }));

  const currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'XCG - Caribbean Guilder', value: 'XCG' }
  ];
  // Searching state
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const activeOnes = res.data.filter(p => p.active);
        setProducts(activeOnes);
        setFilteredProducts(activeOnes);
        if (activeOnes.length > 0) {
          setSelectedProduct(activeOnes[0]);
          setSearchTerm(activeOnes[0].name);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);

    if (!value.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setIsDropdownOpen(false);
  };

  const handleProceed = (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) < 0.50) {
      alert("Amount must be greater than 0.50");
      return;
    }

    const identifier = selectedProduct.slug || selectedProduct.unique_payment_id;
    router.push(`/pay/${identifier}-${currency.toLowerCase()}?amount=${amount}`);
  };

  if (loading) return <div style={msgStyle}>Initializing Paysigur Portal...</div>;

  return (
    <main style={mainStyle}>


      {/* Background Glow */}
      <div style={glowStyle} />

      <div style={containerStyle}>

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
            width={240}
            height={72}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Payment Card */}
        <div style={cardStyle}>
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Secure Payment
            </h1>
            <p style={{ color: '#6B7C93', fontSize: '15px' }}>
              Complete your transaction safely and quickly
            </p>
          </div>

          <form onSubmit={handleProceed}>

            {/* Product */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Select Service or Product</label>
              <CustomDropdown
                options={productOptions}
                value={selectedProduct?.id || ''}
                onChange={(val) =>
                  setSelectedProduct(products.find(p => p.id == val))
                }
                placeholder="Select a product"
                showSearch={true}
              />
            </div>

            {/* Amount */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Payment Amount</label>

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={currencySymbol}>
                    {currency === 'EUR' ? '€' : (currency === 'XCG' ? 'Cg' : '$')}
                  </span>

                  <input
                    type="number"
                    min="0.51"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
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
            </div>

            <button type="submit" style={submitStyle}>
              Continue to Payment
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
  background: '#F7F9FC',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  fontFamily: '"Inter", sans-serif',
  position: 'relative',
  overflow: 'hidden'
};

const containerStyle = {
  width: '100%',
  maxWidth: 480,
  zIndex: 10
};

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E3E8EF',
  borderRadius: 24,
  padding: '40px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const fieldStyle = {
  marginBottom: 24
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#001c64',
  marginBottom: 8
};

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

const submitStyle = {
  width: '100%',
  marginTop: 12,
  padding: '16px',
  background: '#0070E0',
  color: '#FFFFFF',
  borderRadius: 12,
  border: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)'
};

const currencySymbol = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#6B7C93',
  fontWeight: '600',
  fontSize: '15px'
};

const subtitleStyle = {
  color: '#6B7C93',
  fontSize: 14,
  marginTop: 8,
};

const glowStyle = {
  position: 'absolute',
  top: -150,
  right: -150,
  width: 500,
  height: 500,
  background: 'radial-gradient(circle, rgba(0, 112, 224, 0.08) 0%, rgba(247, 249, 252, 0) 70%)',
  borderRadius: '50%',
  zIndex: 1
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

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#09090b',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 10,
  marginTop: 6,
  maxHeight: 200,
  overflowY: 'auto',
  zIndex: 100,
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
};

const dropdownItemStyle = {
  padding: '12px 16px',
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.1s ease',
  borderBottom: '1px solid rgba(255,255,255,0.03)'
};

const msgStyle = {
  textAlign: 'center',
  color: '#001c64',
  fontSize: 18,
  fontWeight: 600,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F7F9FC'
};