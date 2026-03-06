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
        <div className="max-w-7xl mx-auto animate-fade-in pb-20 mt-10">
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 px-1">
                <div>
                    <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"></span>
                        Payment Links & Services
                    </p>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Products</h1>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="saas-btn-primary px-7 py-3.5 text-[10px] uppercase tracking-[0.2em] font-black self-start sm:self-auto whitespace-nowrap"
                >
                    + Add New Product
                </button>
            </header>

            {/* Stats bar */}
            {products.length > 0 && (
                <div className="flex items-center gap-6 mb-6 px-1">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {products.length} product{products.length !== 1 ? 's' : ''}
                    </span>
                    <span className="w-px h-3 bg-white/10"></span>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        {products.filter(p => p.active).length} active
                    </span>
                </div>
            )}

            {/* Product Grid */}
            <section>
                {products.length === 0 ? (
                    <div className="py-28 glass-card flex flex-col items-center justify-center text-center border-white/5">
                        <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-5 border border-white/5">
                            <svg className="w-7 h-7 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">No Products Yet</h3>
                        <p className="text-[11px] text-zinc-600 max-w-[240px] mb-8 font-medium leading-relaxed">
                            Create your first product to start accepting payments link-free.
                        </p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="saas-btn-secondary text-[10px] uppercase font-black tracking-[0.2em] px-8 py-3"
                        >
                            Create Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="glass-card p-6 group relative flex flex-col border-white/5 hover:border-white/10 transition-all duration-200"
                            >
                                {/* Action buttons */}
                                <div className="absolute top-5 right-5 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="p-1.5 bg-black/60 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white border border-white/5 transition-all"
                                        title="Edit"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-1.5 bg-black/60 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 border border-white/5 transition-all"
                                        title="Delete"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${product.active
                                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                        : 'bg-white/5 border-white/5 text-zinc-600'
                                        }`}>
                                        {product.active ? 'Active' : 'Hidden'}
                                    </span>
                                    <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="flex-1 min-h-0">
                                    <h3 className="text-base font-black text-white italic uppercase tracking-tight leading-snug mb-2 pr-10">
                                        {product.name}
                                    </h3>
                                    <p className="text-zinc-500 text-[12px] leading-relaxed font-medium line-clamp-2">
                                        {product.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Card Footer */}
                                <div className="pt-5 mt-5 border-t border-white/5 flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-white tracking-tighter">{product.amount}</span>
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{product.currency}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className=" fixed top-[0] left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card w-full max-w-lg shadow-2xl relative border-white/10 overflow-hidden p-10 left-[-145px] top-[-50px]">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-yellow-500"></div>

                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-8 pb-6 border-b border-white/5">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tighter text-white italic">
                                    {editingProduct ? 'Edit Product' : 'New Product'}
                                </h2>
                                <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1">
                                    Configure your product details
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-white/5 -mt-0.5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit}>
                            <div className="p-8 space-y-5">
                                <div>
                                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="saas-input py-3 px-4 text-sm font-bold w-full"
                                        placeholder="Enter product title"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                        Description
                                        <span className="ml-1.5 text-zinc-700 normal-case font-bold tracking-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        className="saas-input resize-none h-20 py-3 px-4 text-sm w-full"
                                        placeholder="Brief summary of what the customer is buying..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="saas-input font-bold text-sm py-3 px-4 w-full"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                                            Currency
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="saas-input appearance-none font-black text-white bg-white/5 py-3 px-4 pr-9 text-xs uppercase tracking-widest cursor-pointer w-full"
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="XCG">XCG (Crypto)</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all">
                                    <div className="relative flex items-center shrink-0">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-white/10 bg-black/50 text-yellow-500 focus:ring-yellow-500/20 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-yellow-500 transition-all peer"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        />
                                        <svg className="w-3 h-3 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight">Product Active</p>
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">
                                            Visible on your public payment link
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 p-8 pt-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="saas-btn-secondary flex-1 uppercase tracking-[0.2em] text-[10px] py-3.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="saas-btn-primary flex-1 uppercase tracking-[0.2em] text-[10px] py-3.5"
                                >
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}