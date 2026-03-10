'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function SuperAdminProducts() {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

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
            alert('Failed to fetch payments for this product');
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
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/super-admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                Loading...
            </div>
        )
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0px auto", paddingBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "28px", color: "white", fontWeight: "900" }}>Products Management</h1>
                    <p style={{ color: '#71717a', fontSize: '14px', marginTop: '8px' }}>Create and manage products assigned to freelancers.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{ background: "#facc15", border: "none", padding: "12px 20px", fontWeight: "bold", cursor: "pointer", borderRadius: '8px' }}
                >
                    + Add New Product
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Filter by Product Name</label>
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '13px', outline: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '10px', fontWeight: '900', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px' }}>Filter by Assigned To</label>
                    <input
                        type="text"
                        placeholder="Search freelancer..."
                        value={filterAssignedTo}
                        onChange={(e) => setFilterAssignedTo(e.target.value)}
                        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '13px', outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: 10, textTransform: 'uppercase', color: '#71717a' }}>
                            <th style={{ padding: 16, textAlign: 'left' }}>Product Name</th>
                            <th style={{ padding: 16, textAlign: 'left' }}>Assigned To</th>
                            <th style={{ padding: 16, textAlign: 'left' }}>Payment Link</th>
                            <th style={{ padding: 16, textAlign: 'center' }}>Status</th>
                            <th style={{ padding: 16, textAlign: 'right' }}>Actions</th>
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
                                        <td colSpan="5" style={{ padding: 48, textAlign: 'center', color: '#71717a', fontSize: 13 }}>No products found matching your filters.</td>
                                    </tr>
                                );
                            }

                            return filtered.map((product) => (
                                <tr key={product.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: 16 }}>
                                        <button
                                            onClick={() => fetchProductPayments(product)}
                                            style={{ background: 'transparent', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', outline: 'none' }}
                                        >
                                            <div style={{ color: '#facc15', fontWeight: 700, textDecoration: 'underline' }}>{product.name}</div>
                                        </button>
                                        <div style={{ fontSize: 12, color: '#71717a' }}>{product.description || 'No description'}</div>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <span style={{ fontSize: 12, color: '#eab308' }}>{product.user?.name || 'Unknown User'}</span>
                                    </td>
                                    <td style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            {['USD', 'EUR', 'XCG'].map(curr => {
                                                const identifier = product.slug || product.unique_payment_id;
                                                const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${identifier}-${curr.toLowerCase()}`;
                                                return (
                                                    <div key={curr} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <span style={{ fontSize: 9, fontWeight: '900', color: '#facc15', width: 24 }}>{curr}</span>
                                                        <input
                                                            readOnly
                                                            value={url}
                                                            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: '#71717a', fontSize: 10, padding: '4px 8px', borderRadius: 4, flex: 1 }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(url);
                                                                alert(`${curr} link copied!`);
                                                            }}
                                                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#facc15', fontSize: 10, padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td style={{ padding: 16, textAlign: 'center' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 10, background: product.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: product.active ? '#22c55e' : '#ef4444', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                            {product.active ? 'Active' : 'Archived'}
                                        </span>
                                    </td>
                                    <td style={{ padding: 16, textAlign: 'right' }}>
                                        <button onClick={() => handleOpenModal(product)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: 12, fontSize: 12, fontWeight: 'bold' }}>Edit</button>
                                        <button onClick={() => handleDelete(product.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Product Edit/Create Modal */}
            {isModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <div style={{ background: "#111", padding: "30px", width: "500px", borderRadius: "10px", border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ marginBottom: "20px", color: 'white' }}>{editingProduct ? "Edit Product" : "Create Product"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#71717a', marginBottom: 6, textTransform: 'uppercase', fontWeight: 'bold' }}>Assign to User</label>
                                <select value={formData.user_id} required onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} style={{ width: "100%", padding: "12px", background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 6 }}>
                                    <option value="" disabled>Select User</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#71717a', marginBottom: 6, textTransform: 'uppercase', fontWeight: 'bold' }}>Product Name</label>
                                <input type="text" placeholder="Product name" value={formData.name} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "12px", background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 6 }} />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: 'block', fontSize: 11, color: '#71717a', marginBottom: 6, textTransform: 'uppercase', fontWeight: 'bold' }}>Description</label>
                                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "12px", background: '#000', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 6 }} />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} /> Active Status
                                </label>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "20px" }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: "10px 20px", background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: "10px 20px", background: "#facc15", color: 'black', border: "none", fontWeight: "bold", borderRadius: 6, cursor: 'pointer' }}>{editingProduct ? "Save Changes" : "Create Product"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payments History Modal */}
            {isPaymentModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div style={{ background: "#111", padding: "30px", width: "900px", maxWidth: '95%', borderRadius: "10px", border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 style={{ color: 'white' }}>Payments Received for: <span style={{ color: '#facc15' }}>{viewingProductName}</span></h2>
                            <button onClick={() => setIsPaymentModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: 24, cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: 10, textTransform: 'uppercase', color: '#71717a' }}>
                                        <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: 12, textAlign: 'left' }}>Customer</th>
                                        <th style={{ padding: 12, textAlign: 'right' }}>Amount</th>
                                        <th style={{ padding: 12, textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProductPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: 32, textAlign: 'center', color: '#71717a' }}>No payments found for this product.</td>
                                        </tr>
                                    ) : (
                                        selectedProductPayments.map((p) => (
                                            <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: 12, fontSize: 12, color: '#a1a1aa' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                                                <td style={{ padding: 12, fontSize: 12, color: 'white' }}>
                                                    <div>{p.customer_name}</div>
                                                    <div style={{ fontSize: 10, color: '#71717a' }}>{p.customer_email}</div>
                                                </td>
                                                <td style={{ padding: 12, fontSize: 12, color: '#facc15', fontWeight: 'bold', textAlign: 'right' }}>
                                                    {p.amount} {p.currency}
                                                </td>
                                                <td style={{ padding: 12, textAlign: 'center' }}>
                                                    <span style={{ fontSize: 10, color: p.status === 'success' ? '#22c55e' : '#ef4444' }}>{p.status.toUpperCase()}</span>
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
