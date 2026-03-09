'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedLink, setCopiedLink] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (url, linkId) => {
        navigator.clipboard.writeText(url);
        setCopiedLink(linkId);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const getPaymentUrl = (productId, currency) => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/pay/${productId}/${currency}`;
        }
        return '';
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #eab308', borderBottom: '2px solid #eab308', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0px auto", paddingBottom: "20px", padding: '0 16px' }}>

            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <p style={{ fontSize: "10px", color: "#999", letterSpacing: "3px", marginBottom: "8px" }}>
                    YOUR ASSIGNED PRODUCTS
                </p>
                <h1 style={{ fontSize: "28px", color: "white", fontWeight: "900" }}>
                    Products
                </h1>
                <p style={{ color: '#71717a', fontSize: '14px', marginTop: '8px' }}>
                    View your assigned products and get their direct payment links. Products can only be configured by the Super Admin.
                </p>
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", background: 'rgba(255,255,255,0.02)' }}>
                    <p style={{ color: '#a1a1aa', fontSize: '15px' }}>You have not been assigned any products yet.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "24px" }}>
                    {products.map((product) => (
                        <div key={product.id} style={{ border: "1px solid rgba(255,255,255,0.05)", padding: "24px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", color: "white", position: "relative" }}>

                            <div style={{ marginBottom: "12px", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ padding: '4px 8px', borderRadius: '4px', background: product.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: product.active ? '#22c55e' : '#ef4444', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {product.active ? "Active" : "Archived"}
                                </span>
                            </div>

                            <h3 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: '800' }}>
                                {product.name}
                            </h3>

                            <p style={{ color: "#a1a1aa", fontSize: "14px", marginBottom: '24px', minHeight: '40px' }}>
                                {product.description || "No description provided."}
                            </p>

                            {/* <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#71717a', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>
                                    Payment Link
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(() => {
                                        const url = `${window.location.origin}/pay/${product.unique_payment_id}`;
                                        const linkId = product.id;
                                        const isCopied = copiedLink === linkId;

                                        return (
                                            <div style={{ display: 'flex', background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                                                <div style={{ width: '60px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '12px', color: '#facc15' }}>
                                                    LINK
                                                </div>
                                                <div style={{ flex: 1, padding: '10px 12px', fontSize: '11px', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                                                    {url}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(url, linkId)}
                                                    style={{ background: isCopied ? '#22c55e' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0 16px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
                                                >
                                                    {isCopied ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}