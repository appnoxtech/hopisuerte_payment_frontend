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
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
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
                                        background: product.active ? '#ECFDF5' : '#FEF2F2',
                                        color: product.active ? '#10B981' : '#EF4444',
                                        borderColor: product.active ? '#A7F3D0' : '#FECACA',
                                    }}>
                                        <div style={{ ...dotStyle, background: 'currentColor' }} />
                                        {product.active ? "Active" : "Inactive"}
                                    </div>
                                    <ShieldCheck size={18} color="#001c64" style={{ opacity: 0.1 }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #E3E8EF' }} />
                                    ) : (
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E3E8EF' }}>
                                            <Package size={24} color="#0070E0" />
                                        </div>
                                    )}
                                    <h3 style={{ ...productTitleStyle, marginBottom: 0 }}>{product.name}</h3>
                                </div>
                                <p style={productDescStyle}>{product.description || "Authorized gateway link."}</p>

                                <button
                                    onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                                    style={{
                                        ...toggleLinkBtnStyle,
                                        background: isExpanded ? '#0070E0' : '#F0F7FF',
                                        color: isExpanded ? '#FFF' : '#0070E0',
                                        borderColor: isExpanded ? '#0070E0' : '#E3E8EF'
                                    }}
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
                                                                background: isCopied ? '#ECFDF5' : '#F8FAFC',
                                                                color: isCopied ? '#10B981' : '#1A1F36'
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
    fontSize: '24px',
    fontWeight: '800',
    color: '#001c64',
    letterSpacing: '-0.02em'
};

const subtitleStyle = {
    fontSize: '13px',
    color: '#6B7C93',
    marginTop: '4px',
    fontWeight: '500'
};

const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#fbbf24',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const productGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
};

const productCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '24px',
    padding: '28px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)',
    transition: 'all 0.3s'
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
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '100px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600'
};

const dotStyle = { width: '6px', height: '6px', borderRadius: '50%' };

const productTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: '8px'
};

const productDescStyle = {
    fontSize: '14px',
    color: '#6B7C93',
    lineHeight: '1.6',
    marginBottom: '24px',
    minHeight: '44px',
    fontWeight: '500'
};

const toggleLinkBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 20px',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid'
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
    background: '#F8FAFC',
    border: '1px solid #E3E8EF',
    borderRadius: '12px',
    overflow: 'hidden'
};

const currencyLabelStyle = {
    width: '50px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '12px',
    color: '#475569',
    borderRight: '1px solid #E3E8EF'
};

const urlPreviewStyle = {
    flex: 1,
    padding: '10px 14px',
    fontSize: '12px',
    color: '#64748B',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: 'monospace'
};

const copyBtnStyle = {
    width: '42px',
    padding: 0,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderLeft: '1px solid #E3E8EF'
};

const emptyStateStyle = {
    padding: '60px 20px',
    textAlign: 'center',
    background: 'rgba(15, 15, 20, 0.4)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.2)',
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
