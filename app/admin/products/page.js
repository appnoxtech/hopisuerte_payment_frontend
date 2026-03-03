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
        <div className="space-y-8 bg-black min-h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black italic tracking-tight">Product Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-900/10 uppercase tracking-widest text-xs"
                >
                    Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                    <div className="col-span-full py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center">
                        <div className="text-4xl mb-4">📦</div>
                        <p className="text-neutral-500 font-medium">No products created yet.</p>
                        <button onClick={() => handleOpenModal()} className="mt-4 text-yellow-500 hover:text-yellow-400 font-bold underline underline-offset-4">Create your first service</button>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-neutral-900 p-8 rounded-3xl border border-neutral-800 hover:border-yellow-400/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                <button onClick={() => handleOpenModal(product)} className="p-2 bg-black rounded-xl hover:bg-neutral-800 text-yellow-500 border border-neutral-800 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 bg-black rounded-xl hover:bg-red-500/10 text-red-500 border border-neutral-800 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.active ? 'bg-yellow-400 text-black' : 'bg-neutral-800 text-neutral-500'}`}>
                                    {product.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">{product.name}</h3>
                            <p className="text-neutral-500 text-sm mb-8 leading-relaxed line-clamp-2 h-10">{product.description || 'No description provided.'}</p>

                            <div className="pt-6 border-t border-neutral-800 flex items-baseline gap-2">
                                <span className="text-3xl font-black text-white">{product.amount}</span>
                                <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{product.currency}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-neutral-900 w-full max-w-xl rounded-[2.5rem] p-10 border border-neutral-800 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black italic">{editingProduct ? 'Edit service' : 'New service'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Service Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                                    placeholder="Personal Branding Session"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Description (Optional)</label>
                                <textarea
                                    className="w-full px-5 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all resize-none"
                                    rows="3"
                                    placeholder="Describe what the customer will receive..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-5 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all font-mono"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Currency</label>
                                    <select
                                        className="w-full px-5 py-4 bg-black border border-neutral-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all appearance-none"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="XCG">XCG (Crypto)</option>
                                    </select>
                                </div>
                            </div>

                            <label className="flex items-center space-x-4 p-4 bg-black rounded-2xl border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                                <input
                                    type="checkbox"
                                    id="active"
                                    className="w-5 h-5 rounded-md border-neutral-800 bg-black text-yellow-400 focus:ring-yellow-400/50 cursor-pointer"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                                <span className="text-sm font-bold text-neutral-300">Set as public and visible to clients</span>
                            </label>

                            <div className="flex space-x-4 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-[1.5rem] transition-all shadow-xl shadow-yellow-900/10 uppercase tracking-widest text-sm"
                                >
                                    {editingProduct ? 'Save Changes' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
