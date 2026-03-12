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
    ExternalLink,
    Repeat,
    Clock,
    ArrowRight
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

    // Reassignment state
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [reassignProduct, setReassignProduct] = useState(null);
    const [reassignUserId, setReassignUserId] = useState('');
    const [reassignReason, setReassignReason] = useState('');
    const [reassignLoading, setReassignLoading] = useState(false);

    // Reassignment history state
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [reassignmentHistory, setReassignmentHistory] = useState([]);
    const [historyProductName, setHistoryProductName] = useState('');

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
                showToast('Product edited successfully.', 'success');
            } else {
                await api.post('/super-admin/products', formData);
                showToast('New product added successfully.', 'success');
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || 'Configuration failed', 'error');
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

    // ── Reassignment handlers ──
    const openReassignModal = (product) => {
        setReassignProduct(product);
        setReassignUserId('');
        setReassignReason('');
        setIsReassignModalOpen(true);
    };

    const handleReassign = async () => {
        if (!reassignUserId) {
            showToast('Please select a freelancer to reassign to.', 'error');
            return;
        }
        if (reassignUserId == reassignProduct?.user_id) {
            showToast('Product is already assigned to this freelancer.', 'error');
            return;
        }
        setReassignLoading(true);
        try {
            const res = await api.post(`/super-admin/products/${reassignProduct.id}/reassign`, {
                new_user_id: reassignUserId,
                reason: reassignReason,
            });
            showToast(res.data.message || 'Product reassigned successfully.', 'success');
            setIsReassignModalOpen(false);
            fetchProducts();
        } catch (err) {
            showToast(err.response?.data?.message || 'Reassignment failed.', 'error');
        } finally {
            setReassignLoading(false);
        }
    };

    const fetchReassignmentHistory = async (product) => {
        try {
            const res = await api.get(`/super-admin/products/${product.id}/reassignment-history`);
            setReassignmentHistory(res.data);
            setHistoryProductName(product.name);
            setIsHistoryModalOpen(true);
        } catch (err) {
            showToast('Failed to load reassignment history.', 'error');
        }
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
                    <h1 style={titleStyle}>Products Management</h1>

                </div>
                <button onClick={() => handleOpenModal()} style={addBtnStyle}>
                    <Plus size={14} />
                    <span>Add Product</span>
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
                        placeholder="Search Freelancer..."
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
                            <th style={thStyle}>Freelancer</th>
                            <th style={thStyle}>Links</th>
                            <th style={thCenterStyle}>Status</th>
                            <th style={{ ...thStyle, paddingRight: '24px', textAlign: 'right' }}>Actions</th>
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
                                                <span>{isExpanded ? 'Collapse' : 'View Links'}</span>
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
                                                <button onClick={() => openReassignModal(product)} style={actionBtnStyle} title="Reassign Freelancer">
                                                    <Repeat size={12} color="#38bdf8" />
                                                </button>
                                                <button onClick={() => handleOpenModal(product)} style={actionBtnStyle} title="Edit Product">
                                                    <Edit2 size={12} color="#fbbf24" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={actionBtnStyle} title="Delete Product">
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
                                <h2 style={modalTitleStyle}>{editingProduct ? "Edit Product" : "New Product"}</h2>

                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Freelancer</label>
                                <CustomDropdown
                                    options={userOptions}
                                    value={formData.user_id}
                                    onChange={(val) => setFormData({ ...formData, user_id: val })}
                                    showSearch={true}
                                    placeholder="Search freelancer..."
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
                    <div style={{ ...modalCardStyle, width: '800px' }}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Review: <span style={{ color: '#fbbf24' }}>{viewingProductName}</span></h2>
                                <p style={{ fontSize: 11, color: '#a1a1aa', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 }}>Transaction Records Analytics</p>
                            </div>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <div style={historyTableWrapStyle}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderStyle}>
                                        <th style={thStyle}>Timestamp</th>
                                        <th style={thStyle}>Freelancer</th>
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
                                                <td style={{ ...tdStyle, fontSize: 11, color: '#a1a1aa' }}>{new Date(p.created_at).toLocaleString('en-GB')}</td>
                                                <td style={tdStyle}>
                                                    <div style={userTextStyle}>{p.customer_name}</div>
                                                    <div style={{ fontSize: 11, color: '#a1a1aa' }}>{p.customer_email}</div>
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

            {/* Reassign Product Modal */}
            {isReassignModalOpen && reassignProduct && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Reassign Product</h2>
                                <p style={{ fontSize: 11, color: '#a1a1aa', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 }}>
                                    Transfer ownership to another freelancer
                                </p>
                            </div>
                            <button onClick={() => setIsReassignModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>

                        {/* Current Assignment Info */}
                        <div style={reassignInfoCardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={iconBoxStyle}><Box size={14} color="#fbbf24" /></div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>{reassignProduct.name}</div>
                                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: 2 }}>Currently assigned to</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                                <div style={avatarCircleStyle}>{reassignProduct.user?.name?.[0] || 'A'}</div>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>{reassignProduct.user?.name || 'Unknown'}</span>
                                <ArrowRight size={14} color="#52525b" style={{ margin: '0 4px' }} />
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8' }}>
                                    {reassignUserId ? (users.find(u => u.id == reassignUserId)?.name || 'Select...') : '?'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>New Freelancer</label>
                                <CustomDropdown
                                    options={userOptions.filter(u => u.value != reassignProduct.user_id)}
                                    value={reassignUserId}
                                    onChange={(val) => setReassignUserId(val)}
                                    showSearch={true}
                                    placeholder="Search freelancer..."
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Reason (Optional)</label>
                                <textarea
                                    placeholder="Provide a reason for this reassignment..."
                                    value={reassignReason}
                                    onChange={(e) => setReassignReason(e.target.value)}
                                    style={{ ...modalInputStyle, height: '70px', resize: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.1)', borderRadius: 10 }}>
                                <Shield size={14} color="#fbbf24" />
                                <p style={{ fontSize: '11px', color: '#a1a1aa', lineHeight: 1.5 }}>
                                    The new freelancer will start with <strong style={{ color: '#fff' }}>0 balance</strong> for this product. Previous payment history will be preserved but not visible to the new assignee.
                                </p>
                            </div>
                            <div style={modalFooterStyle}>
                                <button onClick={() => fetchReassignmentHistory(reassignProduct)} style={{ ...cancelBtnStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Clock size={12} />
                                    <span>History</span>
                                </button>
                                <button type="button" onClick={() => setIsReassignModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button
                                    onClick={handleReassign}
                                    disabled={reassignLoading || !reassignUserId}
                                    style={{
                                        ...saveBtnStyle,
                                        background: reassignLoading || !reassignUserId ? '#52525b' : '#38bdf8',
                                        cursor: reassignLoading || !reassignUserId ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {reassignLoading ? 'Reassigning...' : 'Confirm Reassignment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reassignment History Modal */}
            {isHistoryModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalCardStyle, width: '680px' }}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Reassignment History</h2>
                                <p style={{ fontSize: 11, color: '#a1a1aa', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 }}>
                                    {historyProductName}
                                </p>
                            </div>
                            <button onClick={() => setIsHistoryModalOpen(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>
                        <div style={historyTableWrapStyle}>
                            {reassignmentHistory.length === 0 ? (
                                <div style={emptyStateStyle}>No reassignment records found for this product.</div>
                            ) : (
                                <table style={tableStyle}>
                                    <thead>
                                        <tr style={tableHeaderStyle}>
                                            <th style={thStyle}>Date</th>
                                            <th style={thStyle}>From</th>
                                            <th style={thStyle}>To</th>
                                            <th style={thStyle}>By</th>
                                            <th style={thStyle}>Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reassignmentHistory.map((entry) => (
                                            <tr key={entry.id} style={trStyle}>
                                                <td style={{ ...tdStyle, fontSize: 11, color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                                                    {new Date(entry.reassigned_at).toLocaleString('en-GB')}
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f87171' }}>{entry.previous_user?.name || 'N/A'}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#4ade80' }}>{entry.new_user?.name || 'N/A'}</div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#a1a1aa' }}>{entry.performed_by_admin?.name || 'System'}</div>
                                                </td>
                                                <td style={{ ...tdStyle, fontSize: 11, color: '#71717a', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {entry.reason || '\u2014'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
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
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fbbf24',
    border: 'none',
    padding: '10px 18px',
    color: '#000',
    fontWeight: '600',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px'
};

const filterRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px'
};

const searchBoxStyle = { position: 'relative', width: '200px' };
const searchIconStyle = { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' };

const filterInputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '8px 12px 8px 30px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const countBadgeWrap = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#7f7f88ff',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginLeft: 'auto'
};

const tableContainerStyle = { background: 'rgba(15, 15, 20, 0.4)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderStyle = { background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' };

const thStyle = { padding: '16px', fontSize: '12px', fontWeight: '900', color: '#7f7f88ff', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.01)', transition: 'background 0.2s ease' };
const tdStyle = { padding: '16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const nameLinkStyle = { background: 'none', border: 'none', padding: 0, color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', textAlign: 'left', display: 'block' };
const descTextStyle = { fontSize: '11px', color: '#52525b', fontWeight: '600', marginTop: 2 };
const iconBoxStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251, 191, 36, 0.05)' };
const userTextStyle = { fontSize: '14px', fontWeight: '800', color: '#a1a1aa' };

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
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    cursor: 'pointer'
};

const linksDropStyle = { marginTop: 10, background: 'rgba(0, 0, 0, 0.4)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid rgba(255, 255, 255, 0.2)', animation: 'fadeIn 0.2s' };
const linkRowStyle = { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.05)', padding: '6px 10px', borderRadius: '6px' };
const currBadgeStyle = { fontSize: '12px', fontWeight: '900', color: '#fbbf24', minWidth: 24 };
const linkPreviewStyle = { flex: 1, background: 'none', border: 'none', color: '#cbd5e1', fontSize: '12px', outline: 'none', fontFamily: 'monospace' };
const copyIconBtnStyle = { background: 'none', border: 'none', padding: 4, color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center' };

const statusLevelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };

const actionBtnStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
};

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", backdropFilter: 'blur(12px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#050506", width: "480px", borderRadius: "24px", padding: '32px', border: '1px solid rgba(255, 255, 255, 0.19)', boxShadow: '0 32px 128px rgba(0, 0, 0, 0.8)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' };
const modalTitleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 };
const modalInputStyle = { width: "100%", padding: "12px 14px", background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', borderRadius: 10, fontSize: '13px', outline: 'none' };
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
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '800'
};

const historyTableWrapStyle = { overflowX: 'auto', maxHeight: '50vh', marginTop: 8 };

const reassignInfoCardStyle = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '16px',
};
