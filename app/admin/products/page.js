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
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20 px-4 sm:px-0">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Products</h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        Manage your active payment links and services
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="saas-btn-primary px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-black h-fit"
                >
                    Add New Product
                </button>
            </header>

            {/* Product Grid */}
            <section>
                {products.length === 0 ? (
                    <div className="py-24 glass-card flex flex-col items-center justify-center text-center border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">No Products Found</h3>
                        <p className="text-xs text-zinc-600 max-w-xs mb-8 font-medium">Create your first product to start accepting payments link-free.</p>
                        <button onClick={() => handleOpenModal()} className="saas-btn-secondary text-[10px] uppercase font-black tracking-[0.2em] px-8">Create Product</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="glass-card p-8 group relative flex flex-col h-full border-white/5 hover:border-white/10 transition-all">
                                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleOpenModal(product)} className="p-2 bg-black/60 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 transition-all" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-black/60 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5 transition-all" title="Delete">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <div className="mb-6 flex justify-between items-center">
                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${product.active ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                                        {product.active ? 'Active' : 'Hidden'}
                                    </span>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black mb-2 text-white italic uppercase">{product.name}</h3>
                                <p className="text-zinc-500 text-[13px] mb-8 leading-relaxed line-clamp-2 font-medium flex-1">{product.description || 'No description provided.'}</p>

                                <div className="pt-6 border-t border-white/5 flex items-baseline gap-2 mt-auto">
                                    <span className="text-3xl font-black text-white tracking-tighter">{product.amount}</span>
                                    <span className="text-[10px] font-black text-zinc-700 uppercase">{product.currency}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card w-full max-w-xl p-8 md:p-10 shadow-2xl relative border-white/10">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-500"></div>
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">
                                {editingProduct ? 'Edit Product' : 'New Product'}
                            </h2>
                            <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1">Configure your product details</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="saas-input py-3 px-5 text-base font-bold"
                                        placeholder="Enter product title"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Description (Optional)</label>
                                    <textarea
                                        className="saas-input resize-none h-24 py-3 px-5 text-sm"
                                        placeholder="Brief summary of what the customer is buying..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="saas-input font-bold text-base py-3 px-5"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 ml-1">Currency</label>
                                        <div className="relative">
                                            <select
                                                className="saas-input appearance-none font-black text-white bg-white/5 py-3 px-5 pr-10 text-xs uppercase tracking-widest cursor-pointer"
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="XCG">XCG (Crypto)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center space-x-4 p-5 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-white/10 bg-black/50 text-yellow-500 focus:ring-yellow-500/20 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-yellow-500 transition-all peer"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    />
                                    <svg className="w-3.5 h-3.5 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div className="select-none">
                                    <p className="text-sm font-black text-white uppercase tracking-tighter">Product Active</p>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Show this product on your public payment link</p>
                                </div>
                            </label>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="saas-btn-secondary flex-1 uppercase tracking-[0.2em] text-[10px] py-4"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="saas-btn-primary flex-1 uppercase tracking-[0.2em] text-[10px] py-4"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
