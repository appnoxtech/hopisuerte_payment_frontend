'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        amount: '',
        currency: 'USD',
        active: true
    });

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

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                amount: product.amount,
                currency: product.currency,
                active: !!product.active
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                amount: '',
                currency: 'USD',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/admin/products', formData);
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
                >
                    Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.active ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                                }`}>
                                {product.active ? 'Active' : 'Inactive'}
                            </span>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => handleOpenModal(product)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-blue-400">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-red-400">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="text-2xl font-bold text-white mb-4">
                            {product.amount} <span className="text-sm font-normal text-slate-400">{product.currency}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl p-8 border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="XCG">XCG</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    className="w-4 h-4 rounded border-slate-700 bg-[#0f172a]"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                                <label htmlFor="active" className="text-sm font-medium text-slate-300">Active and visible to customers</label>
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
