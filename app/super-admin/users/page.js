'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Trash2,
    Mail,
    Activity,
    TrendingUp,
    Package,
    DollarSign,
    X,
    Filter,
    Search
} from 'lucide-react';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
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
                setShowModal(false);
                setFormSuccess('');
            }, 3000);
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
                <p style={loadingTextStyle}>Accessing Registry...</p>
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={pageContainerStyle}>
            {/* Professional Header */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Freelancer Nexus</h1>
                    <p style={subtitleStyle}>Manage and provision authorized merchant identities</p>
                </div>

                <div style={headerActionsStyle}>
                    <div style={statsOverviewStyle}>
                        <div style={miniStatStyle}>
                            <span style={miniStatValueStyle}>{users.length}</span>
                            <span style={miniStatLabelStyle}>Registry</span>
                        </div>
                        <div style={miniStatDividerStyle} />
                        <div style={miniStatStyle}>
                            <span style={miniStatValueStyle}>{users.filter(u => u.status === 'active').length}</span>
                            <span style={miniStatLabelStyle}>Active</span>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)} style={addBtnStyle}>
                        <UserPlus size={14} />
                        <span>Register Agent</span>
                    </button>
                </div>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder="Search registry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                <div style={countBadgeWrap}>
                    <span>{filteredUsers.length} Active Participants</span>
                </div>
            </div>

            {/* Main Data Perspective */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderRowStyle}>
                            <th style={{ ...thStyle, paddingLeft: '24px' }}>Agent Profile</th>
                            <th style={thStyle}>Verification</th>
                            <th style={thCenterStyle}>Assets</th>
                            <th style={thCenterStyle}>Net Volume</th>
                            <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>Zero agents found in active registry</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} style={trStyle}>
                                    <td style={{ ...tdStyle, paddingLeft: '24px' }}>
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
                                                background: user.status === 'active' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                                                color: user.status === 'active' ? '#10b981' : '#f43f5e',
                                                borderColor: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                            }}
                                        >
                                            <div style={{ ...dotStyle, background: user.status === 'active' ? '#10b981' : '#f43f5e' }} />
                                            {user.status || 'Active'}
                                        </div>
                                    </td>
                                    <td style={tdCenterStyle}>
                                        <div style={assetBadgeStyle}>
                                            <Package size={10} strokeWidth={3} />
                                            <span>{user.products_count || 0} Modules</span>
                                        </div>
                                    </td>
                                    <td style={{ ...tdCenterStyle }}>
                                        <div style={earningsStyle}>
                                            <span style={currencySymbolStyle}>$</span>
                                            {(user.total_earnings || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                            style={deleteBtnStyle}
                                            title="Revoke Permission"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Agent Provisioning</h2>
                                <p style={modalSubTitle}>Enter identity parameters for new agent</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>

                        {formError && <div style={errorBannerStyle}>{formError}</div>}
                        {formSuccess && <div style={successBannerStyle}>{formSuccess}</div>}

                        <form onSubmit={handleCreateUser} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Full Identity Name</label>
                                <div style={inputWrapperStyle}>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Marcus Aurelius"
                                        style={modalInputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Secure Email Address</label>
                                <div style={inputWrapperStyle}>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="nexus.agent@secure.net"
                                        style={modalInputStyle}
                                    />
                                </div>
                            </div>

                            <div style={modalFooterStyle}>
                                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>Discard</button>
                                <button type="submit" disabled={formLoading} style={submitBtnStyle}>
                                    {formLoading ? 'Synchronizing...' : 'Finalize Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const pageContainerStyle = { display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const subtitleStyle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' };
const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '16px' };

const statsOverviewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.01)',
    padding: '6px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.04)'
};

const miniStatStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const miniStatValueStyle = { fontSize: '13px', fontWeight: '900', color: '#fff' };
const miniStatLabelStyle = { fontSize: '8px', color: '#3f3f46', fontWeight: '800', textTransform: 'uppercase' };
const miniStatDividerStyle = { width: '1px', height: '16px', background: 'rgba(255,255,255,0.05)' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#fbbf24',
    border: 'none',
    padding: '10px 18px',
    color: '#000',
    fontWeight: '900',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '11px'
};

const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '8px' };
const searchBoxStyle = { position: 'relative', width: '200px' };
const searchIconStyle = { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#3f3f46' };
const filterInputStyle = { width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 12px 8px 30px', color: '#fff', fontSize: '12px', outline: 'none' };
const countBadgeWrap = { fontSize: '10px', fontWeight: '800', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 'auto' };

const tableContainerStyle = { background: 'rgba(15, 15, 20, 0.4)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.04)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRowStyle = { background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' };
const thStyle = { padding: '16px', fontSize: '9px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid rgba(255, 255, 255, 0.01)', transition: 'background 0.2s ease' };
const tdStyle = { padding: '16px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const userCellWrapperStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const tableAvatarStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '12px' };
const userNameTextStyle = { fontSize: '13px', fontWeight: '800', color: '#fff' };
const userEmailTextStyle = { fontSize: '10px', color: '#3f3f46', fontWeight: '600' };

const statusBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '20px', border: '1px solid', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' };
const dotStyle = { width: '4px', height: '4px', borderRadius: '50%' };
const assetBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '9px', color: '#a1a1aa', fontWeight: '800' };
const earningsStyle = { fontSize: '14px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 };
const currencySymbolStyle = { color: '#3f3f46', fontSize: '11px' };
const deleteBtnStyle = { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer' };

const loadingContainerStyle = { padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' };
const spinnerStyle = { width: '30px', height: '30px', borderRadius: '50%', border: '3px solid rgba(251, 191, 36, 0.05)', borderTop: '3px solid #fbbf24', animation: 'spin 1s linear infinite' };
const loadingTextStyle = { fontSize: '10px', color: '#3f3f46', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' };

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", backdropFilter: 'blur(12px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#050506", width: "420px", borderRadius: "24px", padding: '32px', border: '1px solid rgba(255, 255, 255, 0.04)', boxShadow: '0 32px 128px rgba(0, 0, 0, 0.8)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' };
const modalTitleStyle = { fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em' };
const modalSubTitle = { fontSize: '11px', color: '#52525b', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#3f3f46', cursor: 'pointer' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '16px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#3f3f46', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 };
const inputWrapperStyle = { position: 'relative' };
const modalInputStyle = { width: "100%", padding: "12px 14px", background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.04)', color: 'white', borderRadius: 10, fontSize: '13px', outline: 'none' };
const modalFooterStyle = { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "8px" };

const submitBtnStyle = { padding: "12px 24px", background: "#fbbf24", color: '#000', border: "none", fontWeight: "900", borderRadius: 10, cursor: "pointer", fontSize: '12px' };
const cancelBtnStyle = { padding: "12px 24px", background: 'rgba(255, 255, 255, 0.02)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: 10, cursor: 'pointer', fontSize: '12px', fontWeight: '800' };

const errorBannerStyle = { padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#f87171', fontSize: '12px', marginBottom: '16px', fontWeight: '700' };
const successBannerStyle = { padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#4ade80', fontSize: '12px', marginBottom: '16px', fontWeight: '700' };