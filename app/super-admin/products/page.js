'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { formatLocalTime } from '@/utils/date';
import CustomDropdown from '@/components/CustomDropdown';
import {
    Plus,
    Search,
    Link as LinkIcon,
    Edit2,
    Trash2,
    Eye,
    X,
    Copy,
    Check,
    ChevronDown,
    ChevronRight,
    User,
    Shield,
    Box,
    ExternalLink
} from 'lucide-react';

import { useToast } from '@/context/ToastContext';

export default function SuperAdminProducts() {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const userOptions = users.map(u => ({
        label: `${u.name} (${u.email})`,
        value: u.id,
        avatarUrl: u.profile_image_url
    }));

    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        description: '',
        active: true,
        image_url: null,
        image_file: null // to hold the new file temporarily
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedProductPayments, setSelectedProductPayments] = useState([]);
    const [viewingProductName, setViewingProductName] = useState('');

    useEffect(() => {
        if (isModalOpen || isPaymentModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isPaymentModalOpen]);

    const [filterName, setFilterName] = useState('');
    const [filterAssignedTo, setFilterAssignedTo] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const fetchProductPayments = async (product) => {
        try {
            const response = await api.get(`/super-admin/products/${product.id}/payments`);
            setSelectedProductPayments(response.data);
            setViewingProductName(product.name);
            setIsPaymentModalOpen(true);
        } catch (err) {
            showToast('Failed to retrieve audit trail', 'error');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/super-admin/products');
            setProducts(response.data);
        } catch (err) {
            showToast('Nexus sync failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/super-admin/users');
            setUsers(response.data);
        } catch (err) {
            // silent fail or small toast
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                user_id: product.user_id,
                name: product.name,
                description: product.description || '',
                active: !!product.active,
                image_url: product.image_url || null,
                image_file: null
            });
        } else {
            setEditingProduct(null);
            setFormData({
                user_id: users.length > 0 ? users[0].id : '',
                name: '',
                description: '',
                active: true,
                image_url: null,
                image_file: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let productId = null;

            if (editingProduct) {
                await api.put(`/super-admin/products/${editingProduct.id}`, {
                    user_id: formData.user_id,
                    name: formData.name,
                    description: formData.description,
                    active: formData.active
                });
                productId = editingProduct.id;
            } else {
                const res = await api.post('/super-admin/products', {
                    user_id: formData.user_id,
                    name: formData.name,
                    description: formData.description,
                    active: formData.active
                });
                productId = res.data.id;
            }

            // Handle Image Upload if a new file was selected
            if (formData.image_file && productId) {
                const imgData = new FormData();
                imgData.append('image', formData.image_file);

                // Get token correctly
                const token = localStorage.getItem('super_admin_token') || localStorage.getItem('token');

                await api.post(`/super-admin/products/${productId}/image`, imgData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            showToast(editingProduct ? 'Product edited successfully.' : 'New product added successfully.', 'success');
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Configuration failed', 'error');
        }
    };

    const handleRemoveImage = async (productId) => {
        if (!confirm('Are you sure you want to remove the product image?')) return;
        try {
            const token = localStorage.getItem('super_admin_token') || localStorage.getItem('token');
            await api.delete(`/super-admin/products/${productId}/image`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast('Image removed successfully.', 'success');
            setFormData({ ...formData, image_url: null, image_file: null });
            fetchProducts();
        } catch (err) {
            showToast('Failed to remove image', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this product?')) return;
        try {
            await api.delete(`/super-admin/products/${id}`);
            showToast('Product deleted successfully.', 'success');
            fetchProducts();
        } catch (err) {
            showToast('Product deletion failed.', 'error');
        }
    };

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        showToast('Link copied successfully');
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    const filtered = products.filter(p => {
        const matchesName = p.name.toLowerCase().includes(filterName.toLowerCase());
        const matchesAssigned = (p.user?.name || '').toLowerCase().includes(filterAssignedTo.toLowerCase());
        return matchesName && matchesAssigned;
    });

    return (
        <div style={containerStyle}>
            <header style={headerSectionStyle}>
                <div>
                    <h1 style={titleStyle}>Product Inventory</h1>
                    <p style={subtitleStyle}>Manage and monitor global product listings</p>
                </div>
                <button onClick={() => handleOpenModal()} style={addBtnStyle}>
                    <Plus size={16} />
                    <span>Create Product</span>
                </button>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder="Search product..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={searchBoxStyle}>
                    <User style={searchIconStyle} size={14} />
                    <input
                        placeholder="Search Merchant..."
                        value={filterAssignedTo}
                        onChange={(e) => setFilterAssignedTo(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={countBadgeWrap}>
                    <span>Total Products: {filtered.length} </span>
                </div>
            </div>

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ ...thStyle, paddingLeft: '24px' }}>Products</th>
                            <th style={thStyle}>Merchant</th>
                            <th style={thStyle}>Links</th>
                            <th style={thCenterStyle}>Status</th>
                            <th style={{ ...thStyle, paddingRight: '24px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>No products found</td>
                            </tr>
                        ) : (
                            filtered.map((product) => {
                                const isExpanded = expandedProductId === product.id;

                                return (
                                    <tr key={product.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={iconBoxStyle}>
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                                                    ) : (
                                                        <Box size={14} color="#0070E0" />
                                                    )}
                                                </div>
                                                <div>
                                                    <button onClick={() => fetchProductPayments(product)} style={nameLinkStyle}>
                                                        {product.name}
                                                    </button>
                                                    <div style={descTextStyle}>{product.description?.substring(0, 40) || 'Generic asset'}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={avatarCircleStyle}>
                                                    {product.user?.profile_image_url ? (
                                                        <img src={product.user.profile_image_url} alt="" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                                                    ) : (
                                                        product.user?.name?.[0] || 'A'
                                                    )}
                                                </div>
                                                <span style={userTextStyle}>{product.user?.name || 'Nexus Hub'}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                                                style={{ ...viewBtnStyle, background: isExpanded ? '#F0F7FF' : '#FFFFFF', color: isExpanded ? '#0070E0' : '#6B7C93', borderColor: isExpanded ? '#0070E0' : '#E2E8F0' }}
                                            >
                                                <LinkIcon size={12} />
                                                <span>{isExpanded ? 'Collapse' : 'Get Links'}</span>
                                            </button>

                                            {isExpanded && (
                                                <div style={linksDropStyle}>
                                                    {['USD', 'EUR', 'XCG'].map(curr => {
                                                        const identifier = product.slug || product.unique_payment_id;
                                                        const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${identifier}-${curr.toLowerCase()}`;
                                                        const cid = `${product.id}-${curr}`;
                                                        const isCopied = copiedId === cid;

                                                        return (
                                                            <div key={curr} style={linkRowStyle}>
                                                                <span style={currBadgeStyle}>{curr}</span>
                                                                <input readOnly value={url} style={linkPreviewStyle} />
                                                                <button onClick={() => handleCopy(url, cid)} style={copyIconBtnStyle}>
                                                                    {isCopied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdCenterStyle}>
                                            <span style={{
                                                ...statusLevelStyle,
                                                background: product.active ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                                                color: product.active ? '#10b981' : '#f43f5e',
                                                borderColor: product.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            }}>
                                                <div style={{ ...dotStyle, background: product.active ? '#10b981' : '#f43f5e' }} />
                                                {product.active ? 'Sync' : 'Lock'}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, paddingRight: '24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal(product)} style={actionBtnStyle}>
                                                    <Edit2 size={12} color="#0070E0" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={actionBtnStyle}>
                                                    <Trash2 size={12} color="#EF4444" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Product Configuration Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>{editingProduct ? "Edit Product" : "New Product"}</h2>

                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Merchant</label>
                                <CustomDropdown
                                    options={userOptions}
                                    value={formData.user_id}
                                    onChange={(val) => setFormData({ ...formData, user_id: val })}
                                    showSearch={true}
                                    placeholder="Search merchant..."
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Name</label>
                                <input placeholder="Enter product name" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Description</label>
                                <textarea placeholder="Add description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...modalInputStyle, height: '80px', resize: 'none' }} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Image</label>
                                {formData.image_url && !formData.image_file && (
                                    <div style={{ padding: '8px', border: '1px solid #E3E8EF', borderRadius: '12px', marginBottom: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <img src={formData.image_url} alt="Product" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                                        <button type="button" onClick={() => handleRemoveImage(editingProduct.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Remove</button>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image_file: e.target.files[0] })} style={modalInputStyle} />
                            </div>
                            <div style={checkboxWrapper}>
                                <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} style={checkboxStyle} />
                                <label htmlFor="active" style={checkboxLabel}>Mark as active</label>
                            </div>
                            <div style={modalFooterStyle}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={saveBtnStyle}>{editingProduct ? "Save Changes" : "Add Product"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Audit History Modal */}
            {isPaymentModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalCardStyle, width: '900px' }}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h3 style={{ fontSize: 13, color: '#6B7C93', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Audit Trail</h3>
                                <h2 style={modalTitleStyle}>Review: <span style={{ color: '#0070E0' }}>{viewingProductName}</span></h2>
                            </div>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={modalCloseBtnStyle}><X size={20} /></button>
                        </div>
                        <div style={historyTableWrapStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderStyle}>
                                        <th style={thStyle}>Timestamp</th>
                                        <th style={thStyle}>Merchant</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Transactions</th>
                                        <th style={thCenterStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductPayments.length === 0 ? (
                                        <tr><td colSpan="4" style={emptyStateStyle}>No capital movement detected</td></tr>
                                    ) : (
                                        selectedProductPayments.map((p) => (
                                            <tr key={p.id} style={trStyle}>
                                                <td style={{ ...tdStyle, fontSize: 11, color: '#a1a1aa' }}>{formatLocalTime(p.created_at)}</td>
                                                <td style={tdStyle}>
                                                    <div style={{ color: '#1A1F36', fontWeight: '700', fontSize: 14 }}>{p.customer_name}</div>
                                                    <div style={{ fontSize: 12, color: '#6B7C93' }}>{p.customer_email}</div>
                                                    <div style={{ fontSize: 12, color: '#6B7C93' }}>{p.customer_phone}</div>
                                                    {p.notes && (
                                                        <div style={{ 
                                                            fontSize: '11px', 
                                                            color: '#0070E0', 
                                                            marginTop: '6px', 
                                                            background: '#F0F7FF', 
                                                            padding: '4px 8px', 
                                                            borderRadius: '6px', 
                                                            display: 'inline-block',
                                                            border: '1px solid rgba(0, 112, 224, 0.1)',
                                                            fontWeight: '600'
                                                        }}>
                                                            Note: {p.notes}
                                                        </div>
                                                    )}
                                                 </td>
                                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '700' }}>
                                                    <span style={{ color: '#6B7C93', marginRight: 4, fontSize: 12 }}>
                                                        {p.currency === 'USD' ? '$' : (p.currency === 'EUR' ? '€' : (p.currency === 'XCG' ? 'Cg' : p.currency))}
                                                    </span>
                                                    <span style={{ color: '#1A1F36', fontSize: 15 }}>{Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </td>
                                                <td style={tdCenterStyle}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        border: '1px solid',
                                                        fontSize: '10px',
                                                        fontWeight: '900',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                        background: p.status === 'success' ? '#ECFDF5' : (p.status === 'pending' ? '#FFFBEB' : '#FEF2F2'),
                                                        color: p.status === 'success' ? '#10B981' : (p.status === 'pending' ? '#F59E0B' : '#EF4444'),
                                                        borderColor: p.status === 'success' ? '#D1FAE5' : (p.status === 'pending' ? '#FEF3C7' : '#FEE2E2')
                                                    }}>
                                                        <div style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: p.status === 'success' ? '#10B981' : (p.status === 'pending' ? '#F59E0B' : '#EF4444')
                                                        }} />
                                                        {p.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' };
const headerSectionStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' };
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const subtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#0070E0',
    border: 'none',
    padding: '12px 24px',
    color: '#FFF',
    fontWeight: '700',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s'
};

const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '4px' };
const searchBoxStyle = { position: 'relative', width: '280px' };
const searchIconStyle = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7C93' };

const filterInputStyle = {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '10px',
    padding: '10px 12px 10px 36px',
    color: '#1A1F36',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const countBadgeWrap = { fontSize: '12px', fontWeight: '600', color: '#6B7C93', marginLeft: 'auto' };

const tableContainerStyle = { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E3E8EF', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' };

const thStyle = { padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#6B7C93', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid #F7F9FC', transition: 'background 0.2s ease' };
const tdStyle = { padding: '20px 24px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const nameLinkStyle = { background: 'none', border: 'none', padding: 0, color: '#0070E0', fontSize: '15px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', display: 'block' };
const descTextStyle = { fontSize: '12px', color: '#6B7C93', fontWeight: '500', marginTop: 2 };
const iconBoxStyle = { width: '40px', height: '40px', borderRadius: '12px', background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E3E8EF' };
const userTextStyle = { fontSize: '14px', fontWeight: '600', color: '#1A1F36' };

const avatarCircleStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#6B7C93',
    border: '1px solid #E3E8EF'
};

const viewBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const linksDropStyle = { marginTop: 12, background: '#F8FAFC', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #E3E8EF', animation: 'fadeIn 0.2s' };
const linkRowStyle = { display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E3E8EF' };
const currBadgeStyle = { fontSize: '12px', fontWeight: '800', color: '#0070E0', minWidth: 28 };
const linkPreviewStyle = { flex: 1, background: 'none', border: 'none', color: '#4A5568', fontSize: '13px', outline: 'none', fontFamily: 'monospace' };
const copyIconBtnStyle = { background: '#F1F5F9', border: 'none', padding: 6, borderRadius: 6, color: '#6B7C93', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' };

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = { width: '6px', height: '6px', borderRadius: '50%' };

const actionBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 28, 100, 0.15)", backdropFilter: 'blur(8px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#FFFFFF", width: "500px", borderRadius: "24px", padding: '40px', border: '1px solid #E3E8EF', boxShadow: '0 25px 50px -12px rgba(0, 28, 100, 0.1)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' };
const modalTitleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#6B7C93', cursor: 'pointer', padding: '4px' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#4A5568', marginLeft: 4 };
const modalInputStyle = { width: "100%", padding: "14px 16px", background: '#F8FAFC', border: '1px solid #E3E8EF', color: '#1A1F36', borderRadius: 12, fontSize: '15px', outline: 'none', transition: 'all 0.2s' };
const checkboxWrapper = { display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 };
const checkboxStyle = { accentColor: '#0070E0', width: 18, height: 18 };
const checkboxLabel = { color: '#4A5568', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const modalFooterStyle = { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "12px" };

const saveBtnStyle = {
    padding: "14px 28px",
    background: "#0070E0",
    color: '#FFF',
    border: "none",
    fontWeight: "700",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)'
};


const cancelBtnStyle = {
    padding: "14px 28px",
    background: '#FFF',
    color: '#4A5568',
    border: '1px solid #E3E8EF',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
};

const historyTableWrapStyle = { overflowX: 'auto', maxHeight: '50vh', marginTop: 8 };
