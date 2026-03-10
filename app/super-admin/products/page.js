'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
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

export default function SuperAdminProducts() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const userOptions = users.map(u => ({ label: `${u.name} (${u.email})`, value: u.id }));

    const [formData, setFormData] = useState({
        user_id: '',
        name: '',
        description: '',
        active: true
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedProductPayments, setSelectedProductPayments] = useState([]);
    const [viewingProductName, setViewingProductName] = useState('');
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
            alert('Failed to fetch payments');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await api.get('/super-admin/products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/super-admin/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                user_id: product.user_id,
                name: product.name,
                description: product.description || '',
                active: !!product.active
            });
        } else {
            setEditingProduct(null);
            setFormData({
                user_id: users.length > 0 ? users[0].id : '',
                name: '',
                description: '',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/super-admin/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/super-admin/products', formData);
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently remove this product?')) return;
        try {
            await api.delete(`/super-admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #fbbf24', borderBottom: '2px solid rgba(251, 191, 36, 0.1)', animation: 'spin 1s linear infinite' }} />
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
                    <h1 style={titleStyle}>Nexus Inventory</h1>
                    <p style={subtitleStyle}>Global configuration of merchant assets</p>
                </div>
                <button onClick={() => handleOpenModal()} style={addBtnStyle}>
                    <Plus size={14} />
                    <span>New Module</span>
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
                        placeholder="Filter merchant..."
                        value={filterAssignedTo}
                        onChange={(e) => setFilterAssignedTo(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={countBadgeWrap}>
                    <span>{filtered.length} Total</span>
                </div>
            </div>

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ ...thStyle, paddingLeft: '24px' }}>Asset Module</th>
                            <th style={thStyle}>Merchant Admin</th>
                            <th style={thStyle}>Payment Access</th>
                            <th style={thCenterStyle}>Status</th>
                            <th style={{ ...thStyle, paddingRight: '24px', textAlign: 'right' }}>Controls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>Zero products found in Nexus ledger</td>
                            </tr>
                        ) : (
                            filtered.map((product) => {
                                const isExpanded = expandedProductId === product.id;

                                return (
                                    <tr key={product.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={iconBoxStyle}><Box size={14} color="#fbbf24" /></div>
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
                                                <div style={avatarCircleStyle}>{product.user?.name?.[0] || 'A'}</div>
                                                <span style={userTextStyle}>{product.user?.name || 'Nexus Hub'}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                                                style={{ ...viewBtnStyle, color: isExpanded ? '#fbbf24' : '#71717a' }}
                                            >
                                                <LinkIcon size={12} />
                                                <span>{isExpanded ? 'Collapse' : 'Currency Links'}</span>
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
                                                                    {isCopied ? <Check size={10} color="#10b981" /> : <Copy size={10} />}
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
                                                    <Edit2 size={12} color="#fbbf24" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={actionBtnStyle}>
                                                    <Trash2 size={12} color="#f43f5e" />
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
                                <h2 style={modalTitleStyle}>{editingProduct ? "Edit Configuration" : "New Nexus Asset"}</h2>
                                <p style={{ fontSize: 11, color: '#52525b', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 }}>System Resource Allocator</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Assign Merchant Hub</label>
                                <CustomDropdown
                                    options={userOptions}
                                    value={formData.user_id}
                                    onChange={(val) => setFormData({ ...formData, user_id: val })}
                                    showSearch={true}
                                    placeholder="Search registry..."
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Display Identity</label>
                                <input placeholder="e.g. VIP Subscription" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Ledger Description</label>
                                <textarea placeholder="Describe asset nature..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...modalInputStyle, height: '80px', resize: 'none' }} />
                            </div>
                            <div style={checkboxWrapper}>
                                <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} style={checkboxStyle} />
                                <label htmlFor="active" style={checkboxLabel}>Enable payment routing for this asset</label>
                            </div>
                            <div style={modalFooterStyle}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Discard</button>
                                <button type="submit" style={saveBtnStyle}>{editingProduct ? "Save Changes" : "Commit to Nexus"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Audit History Modal */}
            {isPaymentModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalCardStyle, width: '800px' }}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Audit: <span style={{ color: '#fbbf24' }}>{viewingProductName}</span></h2>
                                <p style={{ fontSize: 11, color: '#52525b', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 }}>Transaction Ledger Analytics</p>
                            </div>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <div style={historyTableWrapStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderStyle}>
                                        <th style={thStyle}>Timestamp</th>
                                        <th style={thStyle}>Origin</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Capital Flow</th>
                                        <th style={thCenterStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductPayments.length === 0 ? (
                                        <tr><td colSpan="4" style={emptyStateStyle}>No capital movement detected</td></tr>
                                    ) : (
                                        selectedProductPayments.map((p) => (
                                            <tr key={p.id} style={trStyle}>
                                                <td style={{ ...tdStyle, fontSize: 11, color: '#52525b' }}>{new Date(p.created_at).toLocaleString()}</td>
                                                <td style={tdStyle}>
                                                    <div style={userTextStyle}>{p.customer_name}</div>
                                                    <div style={{ fontSize: 11, color: '#52525b' }}>{p.customer_email}</div>
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right', color: '#fbbf24', fontWeight: '900' }}>
                                                    {Number(p.amount).toLocaleString()} {p.currency}
                                                </td>
                                                <td style={tdCenterStyle}>
                                                    <span style={{ color: p.status === 'success' ? '#10b981' : '#f43f5e', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }}>{p.status}</span>
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

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' };
const headerSectionStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fbbf24',
    border: 'none',
    padding: '8px 16px',
    color: '#000',
    fontWeight: '900',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px'
};

const filterRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px'
};

const searchBoxStyle = { position: 'relative', width: '180px' };
const searchIconStyle = { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' };

const filterInputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '8px 12px 8px 30px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const countBadgeWrap = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#3f3f46',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginLeft: 'auto'
};

const tableContainerStyle = { background: 'rgba(15, 15, 20, 0.4)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' };

const thStyle = { padding: '16px', fontSize: '9px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.01)', transition: 'background 0.2s ease' };
const tdStyle = { padding: '16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const nameLinkStyle = { background: 'none', border: 'none', padding: 0, color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer', textAlign: 'left', display: 'block' };
const descTextStyle = { fontSize: '10px', color: '#3f3f46', fontWeight: '600', marginTop: 2 };
const iconBoxStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251, 191, 36, 0.05)' };
const userTextStyle = { fontSize: '12px', fontWeight: '800', color: '#a1a3ad' };

const avatarCircleStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '900',
    color: '#52525b',
    border: '1px solid rgba(255, 255, 255, 0.05)'
};

const viewBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    cursor: 'pointer'
};

const linksDropStyle = { marginTop: 10, background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid rgba(255, 255, 255, 0.04)', animation: 'fadeIn 0.2s' };
const linkRowStyle = { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.01)', padding: '6px 10px', borderRadius: '6px' };
const currBadgeStyle = { fontSize: '9px', fontWeight: '900', color: '#fbbf24', minWidth: 24 };
const linkPreviewStyle = { flex: 1, background: 'none', border: 'none', color: '#52525b', fontSize: '9px', outline: 'none', fontFamily: 'monospace' };
const copyIconBtnStyle = { background: 'none', border: 'none', padding: 4, color: '#3f3f46', cursor: 'pointer', display: 'flex', alignItems: 'center' };

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '9px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };

const actionBtnStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const emptyStateStyle = { padding: '40px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", backdropFilter: 'blur(12px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#050506", width: "480px", borderRadius: "24px", padding: '32px', border: '1px solid rgba(255, 255, 255, 0.04)', boxShadow: '0 32px 128px rgba(0, 0, 0, 0.8)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' };
const modalTitleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#3f3f46', cursor: 'pointer' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 };
const modalInputStyle = { width: "100%", padding: "12px 14px", background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.04)', color: 'white', borderRadius: 10, fontSize: '13px', outline: 'none' };
const checkboxWrapper = { display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 };
const checkboxStyle = { accentColor: '#fbbf24', width: 14, height: 14 };
const checkboxLabel = { color: '#71717a', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };
const modalFooterStyle = { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "8px" };

const saveBtnStyle = {
    padding: "12px 24px",
    background: "#fbbf24",
    color: '#000',
    border: "none",
    fontWeight: "900",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: '12px'
};

const cancelBtnStyle = {
    padding: "12px 24px",
    background: 'rgba(255, 255, 255, 0.02)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '800'
};

const historyTableWrapStyle = { overflowX: 'auto', maxHeight: '50vh', marginTop: 8 };
