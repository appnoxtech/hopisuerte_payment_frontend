'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    Info,
    Package,
    ChevronRight,
    ChevronDown,
    Check,
    Copy,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';

import { useToast } from '@/context/ToastContext';

export default function ProductManagement() {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedLink, setCopiedLink] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch (err) {
            showToast('Synchronized inventory retrieval failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (url, linkId) => {
        navigator.clipboard.writeText(url);
        setCopiedLink(linkId);
        showToast('Link copied successfully.');
        setTimeout(() => setCopiedLink(null), 2000);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #fbbf24', borderBottom: '2px solid rgba(251, 191, 36, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={pageContainerStyle}>
            {/* Header Section */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Assigned Products</h1>
                    <p style={subtitleStyle}>Authorized products for payment processing</p>
                </div>

            </header>

            {/* Product Grid */}
            {products.length === 0 ? (
                <div style={emptyStateStyle}>
                    <Package size={40} strokeWidth={1} color="rgba(255,255,255,0.05)" />
                    <h3 style={emptyTitleStyle}>No Inventory</h3>
                </div>
            ) : (
                <div style={productGridStyle}>
                    {products.map((product) => {
                        const isExpanded = expandedProductId === product.id;

                        return (
                            <div key={product.id} style={productCardStyle}>
                                <div style={cardHeaderStyle}>
                                    <div style={{
                                        ...statusBadgeStyle,
                                        background: product.active ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                                        color: product.active ? '#10b981' : '#f43f5e',
                                        borderColor: product.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                    }}>
                                        <div style={{ ...dotStyle, background: product.active ? '#10b981' : '#f43f5e' }} />
                                        {product.active ? "Ready" : "Inactive"}
                                    </div>
                                    <ShieldCheck size={16} color="rgba(255,255,255,0.1)" />
                                </div>

                                <h3 style={productTitleStyle}>{product.name}</h3>
                                <p style={productDescStyle}>{product.description || "Authorized gateway link."}</p>

                                <button
                                    onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                                    style={toggleLinkBtnStyle}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <ExternalLink size={14} />
                                        <span>{isExpanded ? "Hide Links" : "View Links"}</span>
                                    </div>
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>

                                {isExpanded && (
                                    <div style={linksSectionStyle}>
                                        <div style={linksGridStyle}>
                                            {['USD', 'EUR', 'XCG'].map((curr) => {
                                                const identifier = product.slug || product.unique_payment_id;
                                                const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${identifier}-${curr.toLowerCase()}`;
                                                const linkId = `${product.id}-${curr}`;
                                                const isCopied = copiedLink === linkId;

                                                return (
                                                    <div key={curr} style={linkWidgetStyle}>
                                                        <div style={currencyLabelStyle}>{curr}</div>
                                                        <div style={urlPreviewStyle}>{url}</div>
                                                        <button
                                                            onClick={() => handleCopy(url, linkId)}
                                                            style={{
                                                                ...copyBtnStyle,
                                                                background: isCopied ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                                                                color: isCopied ? '#10b981' : '#fff'
                                                            }}
                                                        >
                                                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES DEFINITION
// ──────────────────────────────────────────────

const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '10px 0',
    animation: 'fadeIn 0.4s ease-out'
};

const headerWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '4px'
};

const titleStyle = {
    fontSize: '18px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
};

const subtitleStyle = {
    fontSize: '11px',
    color: '#52525b',
    marginTop: '2px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.1)',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#fbbf24',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
};

const productCardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '16px',
    padding: '20px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
};

const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
};

const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };

const productTitleStyle = {
    fontSize: '14px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '6px'
};

const productDescStyle = {
    fontSize: '11px',
    color: '#52525b',
    lineHeight: '1.5',
    marginBottom: '20px',
    minHeight: '36px',
    fontWeight: '800'
};

const toggleLinkBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 18px',
    background: 'rgba(251, 191, 36, 0.08)',
    border: '1px solid rgba(251, 191, 36, 0.15)',
    borderRadius: '10px',
    color: '#fbbf24',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const linksSectionStyle = {
    marginTop: '12px',
    animation: 'slideDown 0.3s ease-out'
};

const linksGridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const linkWidgetStyle = {
    display: 'flex',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '8px',
    overflow: 'hidden'
};

const currencyLabelStyle = {
    width: '40px',
    background: 'rgba(251, 191, 36, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '11px',
    color: '#fbbf24',
    borderRight: '1px solid rgba(251, 191, 36, 0.05)'
};

const urlPreviewStyle = {
    flex: 1,
    padding: '8px 12px',
    fontSize: '11px',
    color: '#a1a1aa',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'monospace'
};

const copyBtnStyle = {
    width: '36px',
    padding: 0,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderLeft: '1px solid rgba(255,255,255,0.04)'
};

const emptyStateStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
};

const emptyTitleStyle = {
    fontSize: '12px',
    fontWeight: '800',
    color: '#3f3f46',
    margin: 0,
    textTransform: 'uppercase'
};
