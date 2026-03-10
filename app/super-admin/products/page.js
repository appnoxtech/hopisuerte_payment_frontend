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
    Shield
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
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #facc15', borderBottom: '2px solid #facc15', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <header style={headerSectionStyle}>
                <div>
                    <h1 style={titleStyle}>Products Management</h1>
                    <p style={subtitleStyle}>Create and assign services to active freelancers</p>
                </div>
                <button onClick={() => handleOpenModal()} style={addBtnStyle}>
                    <Plus size={18} />
                    <span>New Product</span>
                </button>
            </header>

            {/* Filters */}
            <div style={filterGridStyle}>
                <div style={filterItemStyle}>
                    <label style={filterLabelStyle}>Search Name</label>
                    <div style={searchWrapperStyle}>
                        <Search size={14} style={searchIconStyle} />
                        <input
                            type="text"
                            placeholder="Type product name..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            style={filterInputStyle}
                        />
                    </div>
                </div>
                <div style={filterItemStyle}>
                    <label style={filterLabelStyle}>Assigned To</label>
                    <div style={searchWrapperStyle}>
                        <User size={14} style={searchIconStyle} />
                        <input
                            type="text"
                            placeholder="Search freelancer..."
                            value={filterAssignedTo}
                            onChange={(e) => setFilterAssignedTo(e.target.value)}
                            style={filterInputStyle}
                        />
                    </div>
                </div>
            </div>

            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ ...thStyle, paddingLeft: '24px' }}>Product & Details</th>
                            <th style={thStyle}>Freelancer</th>
                            <th style={thStyle}>Currency Links</th>
                            <th style={thCenterStyle}>Status</th>
                            <th style={{ ...thStyle, paddingRight: '24px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const filtered = products.filter(p => {
                                const matchesName = p.name.toLowerCase().includes(filterName.toLowerCase());
                                const matchesAssigned = (p.user?.name || '').toLowerCase().includes(filterAssignedTo.toLowerCase());
                                return matchesName && matchesAssigned;
                            });

                            if (filtered.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan="5" style={emptyStateStyle}>No matching products in inventory</td>
                                    </tr>
                                );
                            }

                            return filtered.map((product) => {
                                const isExpanded = expandedProductId === product.id;

                                return (
                                    <tr key={product.id} style={trStyle}>
                                        <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                                <div style={iconBoxStyle}><Shield size={16} color="#fbbf24" /></div>
                                                <div>
                                                    <button onClick={() => fetchProductPayments(product)} style={nameLinkStyle}>
                                                        {product.name}
                                                    </button>
                                                    <div style={descTextStyle}>{product.description || 'No description provided'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={avatarCircleStyle}>{product.user?.name?.[0] || 'U'}</div>
                                                <span style={userTextStyle}>{product.user?.name || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                                                style={{ ...viewBtnStyle, color: isExpanded ? '#fbbf24' : '#71717a' }}
                                            >
                                                <LinkIcon size={14} strokeWidth={isExpanded ? 3 : 2} />
                                                <span>{isExpanded ? 'Hide Links' : 'View Links'}</span>
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
                                                                    {isCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
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
                                                background: product.active ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                                                color: product.active ? '#10b981' : '#f43f5e',
                                                borderColor: product.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                            }}>
                                                {product.active ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, paddingRight: '24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal(product)} style={actionBtnStyle}>
                                                    <Edit2 size={16} color="#fbbf24" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={actionBtnStyle}>
                                                    <Trash2 size={16} color="#f43f5e" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            });
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Modal Components */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>{editingProduct ? "Update Service" : "Register Product"}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={modalCloseBtnStyle}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Assign to Freelancer</label>
                                <CustomDropdown
                                    options={userOptions}
                                    value={formData.user_id}
                                    onChange={(val) => setFormData({ ...formData, user_id: val })}
                                    showSearch={true}
                                    placeholder="Click to select..."
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Product Label</label>
                                <input placeholder="e.g. Premium Subscription" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={modalInputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Internal Description</label>
                                <textarea placeholder="Details about this service..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...modalInputStyle, height: '100px', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                                <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} style={{ accentColor: '#fbbf24' }} />
                                <label htmlFor="active" style={{ color: '#fff', fontSize: 13, fontWeight: '600', cursor: 'pointer' }}>Enabled for processing</label>
                            </div>
                            <div style={modalFooterStyle}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Back</button>
                                <button type="submit" style={saveBtnStyle}>{editingProduct ? "Update Now" : "Complete Task"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPaymentModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalCardStyle, width: '900px' }}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>History: <span style={{ color: '#fbbf24' }}>{viewingProductName}</span></h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={modalCloseBtnStyle}><X size={20} /></button>
                        </div>
                        <div style={historyTableWrapStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderStyle}>
                                        <th style={thStyle}>Timestamp</th>
                                        <th style={thStyle}>Buyer</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Capital Move</th>
                                        <th style={thCenterStyle}>Outcome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductPayments.length === 0 ? (
                                        <tr><td colSpan="4" style={emptyStateStyle}>No transactional activity yet</td></tr>
                                    ) : (
                                        selectedProductPayments.map((p) => (
                                            <tr key={p.id} style={trStyle}>
                                                <td style={{ ...tdStyle, fontSize: 12, color: '#71717a' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                                                <td style={tdStyle}>
                                                    <div style={userTextStyle}>{p.customer_name}</div>
                                                    <div style={descTextStyle}>{p.customer_email}</div>
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right', color: '#fbbf24', fontWeight: '800' }}>
                                                    {Number(p.amount).toLocaleString()} {p.currency}
                                                </td>
                                                <td style={tdCenterStyle}>
                                                    <span style={{ color: p.status === 'success' ? '#10b981' : '#f43f5e', fontSize: 10, fontWeight: '800' }}>{p.status.toUpperCase()}</span>
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

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    animation: 'fadeIn 0.5s ease-out'
};

const headerSectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '30px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
};

const subtitleStyle = { fontSize: '14px', color: '#71717a', fontWeight: '500' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fbbf24',
    border: 'none',
    padding: '12px 24px',
    color: '#000',
    fontWeight: '800',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(251, 191, 36, 0.2)',
    fontSize: '14px'
};

const filterGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    padding: '24px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '20px'
};

const filterItemStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const filterLabelStyle = { fontSize: '10px', fontWeight: '900', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: 4 };
const searchWrapperStyle = { position: 'relative' };
const searchIconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#52525b' };

const filterInputStyle = {
    width: '100%',
    background: '#000',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px 16px 12px 40px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const tableContainerStyle = {
    background: 'rgba(15,15,20,0.4)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '24px',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)'
};

const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: 'rgba(255,255,255,0.015)', borderBottom: '1px solid rgba(255,255,255,0.04)' };

const thStyle = {
    padding: '20px 16px',
    fontSize: '10px',
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textAlign: 'left'
};

const thCenterStyle = { ...thStyle, textAlign: 'center' };

const trStyle = { borderBottom: '1px solid rgba(255,255,255,0.01)', transition: 'background 0.2s ease' };
const tdStyle = { padding: '20px 16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const nameLinkStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    color: '#fbbf24',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: 4,
    display: 'block'
};

const descTextStyle = { fontSize: '12px', color: '#52525b', fontWeight: '500' };

const iconBoxStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(251, 191, 36, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(251, 191, 36, 0.1)'
};

const userTextStyle = { fontSize: '14px', fontWeight: '700', color: '#fff' };

const avatarCircleStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    color: '#fbbf24',
    border: '1px solid rgba(255,255,255,0.1)'
};

const viewBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const linksDropStyle = {
    marginTop: 12,
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    border: '1px solid rgba(255,255,255,0.04)',
    animation: 'slideDown 0.2s ease-out'
};

const linkRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.02)',
    padding: '4px 8px',
    borderRadius: '6px'
};

const currBadgeStyle = {
    fontSize: '9px',
    fontWeight: '900',
    color: '#fbbf24',
    width: 24
};

const linkPreviewStyle = {
    flex: 1,
    background: 'none',
    border: 'none',
    color: '#71717a',
    fontSize: '10px',
    outline: 'none',
    fontFamily: 'monospace'
};

const copyIconBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '4px',
    color: '#52525b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '10px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const actionBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const emptyStateStyle = { padding: '48px', textAlign: 'center', color: '#52525b', fontSize: '13px', fontWeight: '600' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", backdropFilter: 'blur(8px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
const modalCardStyle = { background: "#09090b", padding: "40px", width: "540px", borderRadius: "24px", border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const modalTitleStyle = { fontSize: '22px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#52525b', cursor: 'pointer' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: 4 };
const modalInputStyle = { width: "100%", padding: "14px 18px", background: '#000', border: '1px solid rgba(255,255,255,0.08)', color: 'white', borderRadius: 12, fontSize: '14px', outline: 'none' };
const modalFooterStyle = { display: "flex", justifyContent: "flex-end", gap: 16, marginTop: "16px" };

const saveBtnStyle = {
    padding: "14px 28px",
    background: "#fbbf24",
    color: '#000',
    border: "none",
    fontWeight: "900",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: '14px'
};

const cancelBtnStyle = {
    padding: "14px 28px",
    background: 'rgba(255,255,255,0.03)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700'
};

const historyTableWrapStyle = { overflowX: 'auto', maxHeight: '60vh', marginTop: 8 };
