'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CustomDropdown from '@/components/CustomDropdown';

const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  XCG: 1.80
};

const convertAmount = (amount, fromCurrency, toCurrency) => {
  const from = (fromCurrency || 'USD').toUpperCase();
  const to = (toCurrency || 'USD').toUpperCase();
  const fromRate = EXCHANGE_RATES[from] ?? 1.0;
  const toRate = EXCHANGE_RATES[to] ?? 1.0;
  return Number((amount * (toRate / fromRate)).toFixed(2));
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
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

  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.amount_type === 'fixed') {
        if (selectedProduct.currency) {
          setCurrency(selectedProduct.currency.toUpperCase());
        }
      } else {
        setAmount('');
      }
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.amount_type === 'fixed') {
      const prodAmt = selectedProduct.amount ? parseFloat(selectedProduct.amount) : 0;
      const prodCurr = selectedProduct.currency || 'USD';
      const converted = convertAmount(prodAmt, prodCurr, currency);
      setAmount(String(converted));
    }
  }, [selectedProduct, currency]);

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
    router.push(`/pay/${identifier}-${currency.toLowerCase()}?amount=${amount}&notes=${encodeURIComponent(notes)}`);
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
            width={160}
            height={48}
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Payment Card */}
        <div style={cardStyle} className="bg-white border border-[#E3E8EF] shadow-md">
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

              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Search for a service or product..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  maxHeight: '320px',
                  overflowY: 'auto',
                  padding: '4px',
                  margin: '-4px',
                  // Custom scrollbar can be added via globals.css but inline we just rely on browser default for now
                }}
              >
                {filteredProducts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6B7C93', fontSize: '14px', fontStyle: 'italic' }}>
                    No products found matching your search.
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        padding: 16,
                        borderRadius: 16,
                        border: selectedProduct?.id === product.id
                          ? '2px solid #0070E0'
                          : '1px solid #E3E8EF',
                        cursor: 'pointer',
                        background: selectedProduct?.id === product.id
                          ? '#F0F7FF'
                          : '#FFFFFF',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedProduct?.id === product.id ? '0 4px 12px rgba(0, 112, 224, 0.15)' : '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px'
                        }}
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1px solid #E3E8EF', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E3E8EF', color: '#0070E0', fontWeight: '800', flexShrink: 0, fontSize: '18px' }}>
                            {product.name.charAt(0)}
                          </div>
                        )}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{
                            fontWeight: 700,
                            color: selectedProduct?.id === product.id ? '#001c64' : '#1A1F36',
                            fontSize: 15,
                            marginBottom: product.description ? 4 : 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {product.name}
                          </div>
                          {product.description && (
                            <div style={{
                              fontSize: 13,
                              color: '#6B7C93',
                              fontWeight: 500,
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {product.description}
                            </div>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: selectedProduct?.id === product.id ? '6px solid #0070E0' : '2px solid #E3E8EF',
                          background: '#FFF',
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notes */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Any special instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            {/* Amount */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Payment Amount</label>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{
                    ...currencySymbol,
                    color: selectedProduct?.amount_type === 'fixed' ? '#0070E0' : '#6B7C93'
                  }}>
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
                    readOnly={selectedProduct?.amount_type === 'fixed'}
                    style={{
                      ...inputStyle,
                      paddingLeft: 38,
                      ...(selectedProduct?.amount_type === 'fixed' ? {
                        background: '#F0F7FF',
                        border: '1px solid #B9DDFF',
                        color: '#001C64',
                        fontWeight: '700',
                        cursor: 'not-allowed'
                      } : {})
                    }}
                  />
                </div>

                <div style={{ width: 140 }}>
                  <CustomDropdown
                    options={currencyOptions}
                    value={currency}
                    onChange={(val) => setCurrency(val)}
                    showSearch={false}
                    placeholder="USD"
                    toggleStyle={{ padding: '12px 16px', borderRadius: 12 }}
                  />
                </div>

              </div>
              {selectedProduct?.amount_type === 'fixed' && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#0070E0', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0070E0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Fixed amount for this product.
                </div>
              )}
            </div>

            {selectedProduct?.notes && (
              <div style={{ 
                marginBottom: '20px', 
                fontSize: '13px', 
                color: '#4B5563', 
                fontWeight: '600', 
                fontStyle: 'italic', 
                padding: '12px 16px', 
                background: '#F8FAFC', 
                borderRadius: '12px', 
                border: '1px solid #E3E8EF',
                lineHeight: 1.4
              }}>
                * Note: {selectedProduct.notes}
              </div>
            )}

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
  borderRadius: 24,
  padding: '40px',
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