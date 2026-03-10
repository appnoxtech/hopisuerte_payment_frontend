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
            <div style={loadingContainerStyle}>
                <div style={spinnerStyle} />
                <p style={loadingTextStyle}>Accessing User Directory...</p>
            </div>
        );
    }

    return (
        <div style={pageContainerStyle}>
            {/* Header Section */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>User Management</h1>
                    <p style={subtitleStyle}>Command center for platform participants</p>
                </div>

                <div style={headerActionsStyle}>
                    <div style={statsOverviewStyle}>
                        <div style={miniStatStyle}>
                            <span style={miniStatValueStyle}>{users.length}</span>
                            <span style={miniStatLabelStyle}>Total</span>
                        </div>
                        <div style={miniStatDividerStyle} />
                        <div style={miniStatStyle}>
                            <span style={miniStatValueStyle}>{users.filter(u => u.status === 'active').length}</span>
                            <span style={miniStatLabelStyle}>Active</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            ...addBtnStyle,
                            background: showForm ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary, #fbbf24)',
                            color: showForm ? '#f43f5e' : '#000',
                            borderColor: showForm ? 'rgba(239, 68, 68, 0.2)' : 'transparent'
                        }}
                    >
                        {showForm ? (
                            <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> Close Registration</>
                        ) : (
                            <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Add Participant</>
                        )}
                    </button>
                </div>
            </header>

            {/* Registration Form - Animated/Drawer Style */}
            {showForm && (
                <div style={formCardStyle}>
                    <div style={formHeaderStyle}>
                        <h2 style={formTitleStyle}>Register New User</h2>
                        <p style={formSubtitleStyle}>Invite a new freelancer to the platform</p>
                    </div>

                    {formError && <div style={errorBannerStyle}>{formError}</div>}
                    {formSuccess && <div style={successBannerStyle}>{formSuccess}</div>}

                    <form onSubmit={handleCreateUser}>
                        <div style={formGridStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputWrapperStyle}>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Alexander Pierce"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Email Address</label>
                                <div style={inputWrapperStyle}>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="pierce@example.com"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={formFooterStyle}>
                            <button type="submit" disabled={formLoading} style={submitBtnStyle}>
                                {formLoading ? 'Synchronizing...' : 'Finalize Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Main Data Table */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderRowStyle}>
                            <th style={{ ...thStyle, paddingLeft: '32px' }}>Participant Profile</th>
                            <th style={thStyle}>Verification Status</th>
                            <th style={thCenterStyle}>Inventory</th>
                            <th style={thCenterStyle}>Net Earnings</th>
                            <th style={{ ...thStyle, textAlign: 'right', paddingRight: '32px' }}>Command</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>
                                    <div style={emptyIconWrapperStyle}>
                                        <svg width="40" height="40" fill="none" stroke="#27272a" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 style={emptyTitleStyle}>Database Empty</h3>
                                    <p style={emptyDescStyle}>No registered participants found in the system</p>
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} style={trStyle}>
                                    <td style={{ ...tdStyle, paddingLeft: '32px' }}>
                                        <div style={userCellWrapperStyle}>
                                            <div style={tableAvatarStyle}>
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={userNameTextStyle}>{user.name}</div>
                                                <div style={userEmailTextStyle}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div
                                            onClick={() => handleToggleStatus(user.id)}
                                            style={{
                                                ...statusBadgeStyle,
                                                background: user.status === 'active' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                                                color: user.status === 'active' ? '#10b981' : '#f43f5e',
                                                borderColor: user.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                            }}
                                        >
                                            <div style={{ ...dotStyle, background: user.status === 'active' ? '#10b981' : '#f43f5e' }} />
                                            {user.status || 'Active'}
                                        </div>
                                    </td>
                                    <td style={tdCenterStyle}>
                                        <span style={countBadgeStyle}>{user.products_count || 0} Products</span>
                                    </td>
                                    <td style={{ ...tdCenterStyle, fontWeight: '800', color: '#fff' }}>
                                        <span style={currencySymbolStyle}>$</span>
                                        {(user.total_earnings || 0).toLocaleString()}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '32px' }}>
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                            style={deleteBtnStyle}
                                            title="Revoke Access"
                                        >
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
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

/* ────────────────────────────────────────────── */
/*                  STYLES                          */
/* ────────────────────────────────────────────── */

const pageContainerStyle = {
    animation: 'fadeIn 0.4s ease-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
};

const headerWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px'
};

const titleStyle = {
    fontSize: '32px',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#71717a',
    marginTop: '4px'
};

const headerActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
};

const statsOverviewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255,255,255,0.02)',
    padding: '8px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.04)'
};

const miniStatStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const miniStatValueStyle = {
    fontSize: '16px',
    fontWeight: '900',
    color: '#fff'
};

const miniStatLabelStyle = {
    fontSize: '10px',
    color: '#52525b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const miniStatDividerStyle = {
    width: '1px',
    height: '20px',
    background: 'rgba(255,255,255,0.1)'
};

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid transparent',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
};

const formCardStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const formHeaderStyle = { marginBottom: '32px' };

const formTitleStyle = {
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff'
};

const formSubtitleStyle = {
    fontSize: '13px',
    color: '#71717a',
    marginTop: '4px'
};

const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const labelStyle = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const inputWrapperStyle = { position: 'relative' };

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease'
};

const formFooterStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
};

const submitBtnStyle = {
    background: 'var(--primary, #fbbf24)',
    color: '#000',
    padding: '14px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '900',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const tableContainerStyle = {
    background: 'rgba(15, 15, 20, 0.4)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '20px',
    overflow: 'hidden'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
};

const tableHeaderRowStyle = {
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
};

const thStyle = {
    padding: '20px 16px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const thCenterStyle = {
    ...thStyle,
    textAlign: 'center'
};

const trStyle = {
    borderBottom: '1px solid rgba(255,255,255,0.01)',
    transition: 'background 0.2s ease'
};

const tdStyle = {
    padding: '24px 16px'
};

const tdCenterStyle = {
    ...tdStyle,
    textAlign: 'center'
};

const userCellWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
};

const tableAvatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    color: '#fff',
    fontSize: '14px'
};

const userNameTextStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#fff'
};

const userEmailTextStyle = {
    fontSize: '12px',
    color: '#52525b'
};

const statusBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const dotStyle = {
    width: '5px',
    height: '5px',
    borderRadius: '50%'
};

const countBadgeStyle = {
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '6px',
    fontSize: '11px',
    color: '#a1a1aa'
};

const currencySymbolStyle = {
    color: '#52525b',
    marginRight: '2px',
    fontSize: '12px'
};

const deleteBtnStyle = {
    padding: '10px',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '10px',
    color: '#f87171',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
};

const loadingContainerStyle = {
    padding: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px'
};

const spinnerStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '3px solid rgba(251, 191, 36, 0.1)',
    borderTop: '3px solid #fbbf24',
    animation: 'spin 1s linear infinite'
};

const loadingTextStyle = {
    fontSize: '13px',
    color: '#71717a',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
};

const errorBannerStyle = {
    padding: '12px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '20px'
};

const successBannerStyle = {
    padding: '12px 20px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '10px',
    color: '#4ade80',
    fontSize: '13px',
    marginBottom: '20px'
};

const emptyStateStyle = {
    padding: '100px 40px',
    textAlign: 'center'
};

const emptyIconWrapperStyle = {
    marginBottom: '20px',
    opacity: 0.5
};

const emptyTitleStyle = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px'
};

const emptyDescStyle = {
    fontSize: '13px',
    color: '#52525b'
};