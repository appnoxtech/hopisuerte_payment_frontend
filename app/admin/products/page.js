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

    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px"
            }}>
                Loading...
            </div>
        )
    }

    return (

        <div style={{
            maxWidth: "1200px",
            margin: "0px auto",
            paddingBottom: "20px"
        }}>

            {/* Header */}

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                alignItems: "center"
            }}>

                <div>
                    <p style={{
                        fontSize: "10px",
                        color: "#999",
                        letterSpacing: "3px",
                        marginBottom: "8px"
                    }}>
                        PAYMENT LINKS & SERVICES
                    </p>

                    <h1 style={{
                        fontSize: "28px",
                        color: "white",
                        fontWeight: "900"
                    }}>
                        Products
                    </h1>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        background: "#facc15",
                        border: "none",
                        padding: "12px 20px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    + Add New Product
                </button>

            </div>


            {/* Product Grid */}

            {products.length === 0 ? (

                <div style={{
                    textAlign: "center",
                    padding: "120px",
                    border: "1px solid #222",
                    borderRadius: "12px"
                }}>
                    No products yet
                </div>

            ) : (

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                    gap: "20px"
                }}>

                    {products.map((product) => (

                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #222",
                                padding: "20px",
                                borderRadius: "12px",
                                background: "#111",
                                color: "white",
                                position: "relative"
                            }}
                        >

                            {/* Actions */}

                            <div style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                display: "flex",
                                gap: "6px"
                            }}>

                                <button
                                    onClick={() => handleOpenModal(product)}
                                    style={{
                                        padding: "4px 8px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={{
                                        padding: "4px 8px",
                                        cursor: "pointer",
                                        color: "red"
                                    }}
                                >
                                    Delete
                                </button>

                            </div>


                            <div style={{
                                marginBottom: "12px"
                            }}>
                                <strong>{product.active ? "Active" : "Hidden"}</strong>
                            </div>


                            <h3 style={{
                                fontSize: "18px",
                                marginBottom: "10px"
                            }}>
                                {product.name}
                            </h3>

                            <p style={{
                                color: "#aaa",
                                fontSize: "13px"
                            }}>
                                {product.description || "No description"}
                            </p>

                            <div style={{
                                marginTop: "20px",
                                borderTop: "1px solid #333",
                                paddingTop: "10px",
                                fontSize: "22px",
                                fontWeight: "bold"
                            }}>
                                {product.amount} {product.currency}
                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* Modal */}

            {isModalOpen && (

                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999
                }}>

                    <div style={{
                        background: "#111",
                        padding: "30px",
                        width: "500px",
                        borderRadius: "10px"
                    }}>

                        <h2 style={{ marginBottom: "20px" }}>
                            {editingProduct ? "Edit Product" : "Create Product"}
                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div style={{ marginBottom: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Product name"
                                    value={formData.name}
                                    required
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })}
                                    style={{
                                        width: "100%",
                                        padding: "10px"
                                    }}
                                />
                            </div>


                            <div style={{ marginBottom: "15px" }}>
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        description: e.target.value
                                    })}
                                    style={{
                                        width: "100%",
                                        padding: "10px"
                                    }}
                                />
                            </div>


                            <div style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "15px"
                            }}>

                                <input
                                    type="number"
                                    value={formData.amount}
                                    required
                                    placeholder="Price"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        amount: e.target.value
                                    })}
                                    style={{
                                        flex: 1,
                                        padding: "10px"
                                    }}
                                />

                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        currency: e.target.value
                                    })}
                                    style={{
                                        flex: 1,
                                        padding: "10px"
                                    }}
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="XCG">XCG</option>
                                </select>

                            </div>


                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "20px"
                            }}>

                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        padding: "10px 20px"
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    style={{
                                        padding: "10px 20px",
                                        background: "#facc15",
                                        border: "none",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {editingProduct ? "Save" : "Create"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}