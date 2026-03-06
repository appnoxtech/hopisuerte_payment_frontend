'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/users', getSuperAdminHeaders());
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');
        setFormSuccess('');

        try {
            const response = await api.post('/super-admin/register-freelancer', formData, getSuperAdminHeaders());
            setFormSuccess(response.data.message);
            setFormData({ name: '', email: '' });
            fetchUsers();

            setTimeout(() => {
                setShowForm(false);
                setFormSuccess('');
            }, 5000);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create user account');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await api.patch(`/super-admin/users/${id}/status`, {}, getSuperAdminHeaders());
            setUsers(users.map(u => u.id === id ? { ...u, status: response.data.status } : u));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete user '${name}'?`)) {
            return;
        }

        try {
            await api.delete(`/super-admin/users/${id}`, getSuperAdminHeaders());
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading && users.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    border: '4px solid #eab308',
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            paddingBottom: '80px'
        }}>

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '40px',
                flexWrap: 'wrap'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 900,
                        color: '#fff'
                    }}>
                        User Management
                    </h1>

                    <p style={{
                        color: '#71717a',
                        fontSize: '12px',
                        marginTop: '6px'
                    }}>
                        Platform User Directory
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: '#eab308',
                        border: 'none',
                        padding: '12px 20px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '6px'
                    }}
                >
                    {showForm ? 'Cancel Registration' : 'Add New User'}
                </button>
            </div>

            {/* Registration Form */}
            {showForm && (
                <div style={{
                    background: '#111',
                    padding: '40px',
                    borderRadius: '12px',
                    marginBottom: '40px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>

                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#fff',
                        marginBottom: '20px'
                    }}>
                        Create New User
                    </h2>

                    {formError && (
                        <div style={{
                            background: '#7f1d1d',
                            padding: '12px',
                            marginBottom: '16px',
                            borderRadius: '6px',
                            color: '#f87171'
                        }}>
                            {formError}
                        </div>
                    )}

                    {formSuccess && (
                        <div style={{
                            background: '#064e3b',
                            padding: '12px',
                            marginBottom: '16px',
                            borderRadius: '6px',
                            color: '#4ade80'
                        }}>
                            {formSuccess}
                        </div>
                    )}

                    <form onSubmit={handleCreateUser}>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>

                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa' }}>Full Name</label>

                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginTop: '6px',
                                        borderRadius: '6px',
                                        border: '1px solid #333',
                                        background: '#000',
                                        color: '#fff'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: '#aaa' }}>Email</label>

                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="user@example.com"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginTop: '6px',
                                        borderRadius: '6px',
                                        border: '1px solid #333',
                                        background: '#000',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#27272a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={formLoading}
                                style={{
                                    padding: '10px 20px',
                                    background: '#eab308',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                {formLoading ? 'Creating...' : 'Register User'}
                            </button>

                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div style={{
                background: '#111',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>

                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                }}>

                    <thead>
                        <tr style={{
                            background: 'rgba(255,255,255,0.03)',
                            color: '#aaa',
                            fontSize: '12px'
                        }}>
                            <th style={{ padding: '16px' }}>User</th>
                            <th>Status</th>
                            <th>Products</th>
                            <th>Total Earnings</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{
                                    padding: '60px',
                                    textAlign: 'center',
                                    color: '#666'
                                }}>
                                    No Users Found
                                </td>
                            </tr>
                        ) : (

                            users.map(user => (
                                <tr key={user.id} style={{
                                    borderTop: '1px solid rgba(255,255,255,0.05)'
                                }}>

                                    <td style={{ padding: '20px', color: '#fff' }}>
                                        {user.name}
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: user.status === 'active' ? '#16a34a' : '#dc2626',
                                                color: '#fff',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {user.status || 'active'}
                                        </button>
                                    </td>

                                    <td style={{ textAlign: 'center' }}>
                                        {user.products_count || 0}
                                    </td>

                                    <td style={{ textAlign: 'center', color: '#fff' }}>
                                        {(user.total_earnings || 0).toLocaleString()}
                                    </td>

                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                            style={{
                                                background: '#dc2626',
                                                border: 'none',
                                                color: '#fff',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}