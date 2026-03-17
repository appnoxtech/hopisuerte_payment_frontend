'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/utils/api';
import Sortable from 'sortablejs';
import { GripVertical, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ProductOrderPage() {
    const [products, setProducts] = useState([]);
    const [liveProducts, setLiveProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const { showToast } = useToast();
    const sortableRef = useRef(null);
    const listRef = useRef(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/super-admin/products');
            // Only show active products for reordering as requested
            const activeProducts = res.data.filter(p => p.active);
            
            setProducts(activeProducts);
            
            // Re-calculate if changes are pending
            // They are pending if any sort_order/is_pinned != pending equivalent
            const pending = activeProducts.some(p => 
                p.sort_order !== p.pending_sort_order
            );
            setHasPendingChanges(pending);

            const liveCopy = [...activeProducts].sort((a, b) => a.sort_order - b.sort_order);
            setLiveProducts(liveCopy);

        } catch (error) {
            showToast('Nexus synchronization failure', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!loading && listRef.current) {
            if (sortableRef.current) {
                sortableRef.current.destroy();
            }
            sortableRef.current = new Sortable(listRef.current, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    const newOrder = [...products];
                    const [movedItem] = newOrder.splice(evt.oldIndex, 1);
                    newOrder.splice(evt.newIndex, 0, movedItem);

                    const updatedProducts = newOrder.map((prod, index) => ({
                        ...prod,
                        pending_sort_order: index + 1
                    }));

                    setProducts(updatedProducts);
                    setHasPendingChanges(true); // Dragging always makes it pending
                    handleReorderAPI(updatedProducts);
                }
            });
        }
    }, [loading, products]);

    const handleReorderAPI = async (updatedList) => {
        try {
            const payload = updatedList.map(p => ({
                id: p.id,
                sort_order: p.pending_sort_order
            }));
            await api.patch('/super-admin/products/reorder', payload);
            // No toast here to keep it subtle until publish
        } catch (err) {
            showToast('Failed to buffer sort order', 'error');
            fetchProducts();
        }
    };

    const moveProduct = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === products.length - 1)
        ) return;

        const newOrder = [...products];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;

        const updatedProducts = newOrder.map((prod, idx) => ({
            ...prod,
            pending_sort_order: idx + 1
        }));

        setProducts(updatedProducts);
        setHasPendingChanges(true);
        handleReorderAPI(updatedProducts);
    };

    const handlePublish = async () => {
        try {
            await api.post('/super-admin/products/publish');
            showToast('Product arrangement changed successfully', 'success');
            fetchProducts();
        } catch (err) {
            showToast('Deployment failed', 'error');
        }
    };

    if (loading && products.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2.5px solid #0070E0', borderBottom: '2.5px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={pageContainerStyle}>
            {/* Professional Header */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Product Order Matrix</h1>
                    <p style={subtitleStyle}>Manage the sequence and visibility of products.</p>
                </div>

                <div style={headerStatsStyle}>
                    <div style={{ ...statusIndicatorStyle, color: hasPendingChanges ? '#F59E0B' : '#10B981' }}>
                        {hasPendingChanges ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        <span>{hasPendingChanges ? 'Pending Changes' : 'Synchronized Live'}</span>
                    </div>
                </div>
            </header>

            <div style={panelsGridStyle}>
                {/* ADMIN PANEL */}
                <div style={panelStyle}>
                    <div style={panelHeaderStyle}>
                        <h2 style={panelTitleStyle}>ADMIN - CONFIGURATION LAYER</h2>
                        <div style={badgeWrapperStyle}>
                            <span style={badgeStyle}>Interactive Grid</span>
                        </div>
                    </div>

                    <div style={panelScrollableArea}>
                        <div ref={listRef} style={listContainerStyle}>
                            {products.map((product, index) => {
                                const isHovered = hoveredRowId === product.id;
                                const isModified = product.sort_order !== product.pending_sort_order;

                                return (
                                    <div
                                        key={product.id}
                                        onMouseEnter={() => setHoveredRowId(product.id)}
                                        onMouseLeave={() => setHoveredRowId(null)}
                                        style={{
                                            ...orderItemStyle,
                                            borderColor: isHovered ? '#0070E0' : '#E3E8EF',
                                            background: isHovered ? '#F0F7FF' : '#FFFFFF',
                                            boxShadow: isHovered ? '0 4px 12px rgba(0, 112, 224, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                                            transform: isHovered ? 'translateX(4px)' : 'none',
                                        }}
                                    >
                                        <div className="drag-handle" style={dragHandleStyle}>
                                            <GripVertical size={20} color={isHovered ? '#0070E0' : '#94A3B8'} />
                                        </div>

                                        <div style={{
                                            ...avatarStyle,
                                            background: '#EFF6FF',
                                            color: '#0070E0',
                                            border: '1px solid currentColor',
                                            opacity: 0.8,
                                            overflow: 'hidden'
                                        }}>
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                product.name?.[0]?.toUpperCase()
                                            )}
                                        </div>

                                        <div style={productInfoStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <h4 style={productNameStyle}>{product.name}</h4>
                                                {isModified && <span style={modifiedDot} title="Has pending changes" />}
                                            </div>
                                            <p style={productDescStyle}>{product.description?.substring(0, 40) || 'Production module'}...</p>
                                        </div>

                                        <div style={controlsStyle}>
                                            <div style={sortArrowsContainerStyle}>
                                                <button
                                                    onClick={() => moveProduct(index, 'up')}
                                                    disabled={index === 0}
                                                    style={{ ...arrowBtnStyle, background: index === 0 ? 'transparent' : (isHovered ? '#FFFFFF' : 'transparent') }}
                                                >
                                                    <ChevronUp size={16} color={index === 0 ? '#CBD5E1' : '#475569'} />
                                                </button>
                                                <div style={arrowDivider} />
                                                <button
                                                    onClick={() => moveProduct(index, 'down')}
                                                    disabled={index === products.length - 1}
                                                    style={{ ...arrowBtnStyle, background: index === products.length - 1 ? 'transparent' : (isHovered ? '#FFFFFF' : 'transparent') }}
                                                >
                                                    <ChevronDown size={16} color={index === products.length - 1 ? '#CBD5E1' : '#475569'} />
                                                </button>
                                            </div>

                                            {/* HOVER QUICK PUBLISH - The "hoverable over the line" feature */}
                                            {isHovered && hasPendingChanges && (
                                                <button
                                                    onClick={handlePublish}
                                                    style={quickPublishBtnStyle}
                                                    title="Deploy all pending changes immediately"
                                                >
                                                    <Send size={14} />
                                                    <span>Publish Now</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* STICKY BOTTOM PUBLISH AREA */}
                    <div style={publishAreaStyle}>
                        <div style={publishInfoRow}>
                            {hasPendingChanges ? (
                                <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: '600' }}>⚠️ Warning: Arrangements differ from production.</span>
                            ) : (
                                <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '600' }}>✓ Live sequence matches internal configuration.</span>
                            )}
                        </div>
                        <button
                            onClick={handlePublish}
                            disabled={!hasPendingChanges}
                            style={{
                                ...publishBtnStyle,
                                background: hasPendingChanges ? '#0070E0' : '#E2E8F0',
                                color: hasPendingChanges ? '#FFFFFF' : '#94A3B8',
                                cursor: hasPendingChanges ? 'pointer' : 'not-allowed',
                                boxShadow: hasPendingChanges ? '0 4px 14px rgba(0, 112, 224, 0.3)' : 'none'
                            }}
                        >
                            <Send size={18} />
                            Publish Changes
                        </button>
                    </div>
                </div>

                {/* CONSUMER PREVIEW */}
                <div style={liveViewPanelStyle}>
                    <div style={panelHeaderStyle}>
                        <h2 style={panelTitleStyle}>CONSUMER PERSPECTIVE (LIVE)</h2>
                        <span style={{ ...badgeStyle, background: '#ECFDF5', color: '#10B981' }}>Live Simulation</span>
                    </div>

                    <div style={panelScrollableArea}>
                        <div style={liveListContainerStyle}>
                            {liveProducts.map((product, idx) => {
                                const isFirst = idx === 0;
                                return (
                                    <div key={product.id} style={{
                                        ...liveItemStyle,
                                        borderColor: isFirst ? '#0070E0' : '#E2E8F0',
                                        background: isFirst ? '#FFFFFF' : '#FFFFFF',
                                        boxShadow: isFirst ? '0 8px 16px rgba(0, 112, 224, 0.1)' : '0 1px 2px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ ...radioBtnStyle, borderColor: isFirst ? '#0070E0' : '#E2E8F0' }}>
                                            {isFirst && <div style={radioInnerStyle} />}
                                        </div>

                                        <div style={{
                                            ...avatarStyle,
                                            width: '36px', height: '36px',
                                            background: isFirst ? '#EFF6FF' : '#F8FAFC',
                                            color: isFirst ? '#0070E0' : '#64748B',
                                            border: '1px solid currentColor',
                                            fontSize: '14px',
                                            opacity: 0.7,
                                            overflow: 'hidden'
                                        }}>
                                            {product.image_url ? (
                                                <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                product.name?.[0]?.toUpperCase()
                                            )}
                                        </div>

                                        <div style={productInfoStyle}>
                                            <h4 style={{ ...productNameStyle, color: isFirst ? '#0070E0' : '#1E293B' }}>
                                                {product.name}
                                            </h4>
                                            <p style={{ ...productDescStyle, color: isFirst ? '#3B82F6' : '#64748B' }}>
                                                Order Rank: {product.sort_order}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={legendStyle}>
                        <div style={legendItemStyle}><span style={{ color: '#0070E0' }}>●</span> Active Focus</div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
                .sortable-ghost { opacity: 0.4; background: #F1F5F9 !important; border: 2px dashed #0070E0 !important; }
            `}</style>
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES (Light & Premium)
// ──────────────────────────────────────────────

const pageContainerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const subtitleStyle = { fontSize: '14px', color: '#64748B', fontWeight: '500', marginTop: '4px' };
const headerStatsStyle = { display: 'flex', gap: '16px' };

const statusIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '700',
    background: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const panelsGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' };

const panelStyle = {
    background: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    maxHeight: 'calc(100vh - 180px)',
    overflow: 'hidden'
};

const liveViewPanelStyle = { ...panelStyle, background: '#F8FAFC' };

const panelHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #E2E8F0',
    background: '#FFFFFF'
};

const panelTitleStyle = { fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' };
const badgeWrapperStyle = { display: 'flex', gap: '8px' };
const badgeStyle = { fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', background: '#F1F5F9', color: '#475569' };

const panelScrollableArea = { flex: 1, overflowY: 'auto', padding: '24px' };
const listContainerStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };

const orderItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
};

const dragHandleStyle = { cursor: 'grab', display: 'flex', alignItems: 'center', padding: '4px' };
const avatarStyle = { width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' };
const productInfoStyle = { flex: 1 };
const productNameStyle = { fontSize: '15px', fontWeight: '700', color: '#1E293B', margin: 0 };
const productDescStyle = { fontSize: '12px', color: '#64748B', fontWeight: '500', marginTop: '2px' };
const modifiedDot = { width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' };

const controlsStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const sortArrowsContainerStyle = { display: 'flex', flexDirection: 'column', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' };
const arrowBtnStyle = { border: 'none', padding: '6px', cursor: 'pointer', transition: 'all 0.2s' };
const arrowDivider = { height: '1px', background: '#E2E8F0', width: '100%' };

const pinBtnStyle = { display: 'none' };

const quickPublishBtnStyle = {
    position: 'absolute',
    right: '16px',
    top: '-12px',
    background: '#0070E0',
    color: '#FFF',
    border: 'none',
    borderRadius: '12px',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 112, 224, 0.25)',
    animation: 'fadeIn 0.2s ease',
    zIndex: 5
};

const publishAreaStyle = { padding: '24px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '16px' };
const publishInfoRow = { display: 'flex', justifyContent: 'center' };
const publishBtnStyle = { border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', width: '100%' };

const liveListContainerStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const liveItemStyle = { display: 'flex', alignItems: 'center', padding: '18px', borderRadius: '16px', border: '1px solid', gap: '16px', transition: 'all 0.3s' };
const radioBtnStyle = { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const radioInnerStyle = { width: '10px', height: '10px', borderRadius: '50%', background: '#0070E0' };

const legendStyle = { display: 'flex', gap: '20px', padding: '20px 24px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF' };
const legendItemStyle = { fontSize: '11px', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' };
