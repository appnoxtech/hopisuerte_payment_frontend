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
    Search,
    Camera,
    Image as ImageIcon,
    Loader2,
    Upload,
    ImageOff,
    Edit2
} from 'lucide-react';
import { useRef } from 'react';
import CustomDropdown from '@/components/CustomDropdown';

const getSuperAdminHeaders = () => ({
    headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('super_admin_token') : ''}`,
    },
});

import { useToast } from '@/context/ToastContext';

export default function UserManagement() {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayCurrency, setDisplayCurrency] = useState('USD');

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        slug: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [avatarLoadingId, setAvatarLoadingId] = useState(null);
    const [avatarModal, setAvatarModal] = useState(null); // holds the user object for avatar modal
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [imageErrors, setImageErrors] = useState(new Set());

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/super-admin/users', getSuperAdminHeaders());
            setUsers(response.data);
        } catch (err) {
            showToast('Nexus participant synchronization failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                slug: user.slug
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', slug: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', slug: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            if (editingUser) {
                const response = await api.put(`/super-admin/users/${editingUser.id}`, formData, getSuperAdminHeaders());
                showToast(response.data.message || 'Merchant updated successfully', 'success');
            } else {
                const response = await api.post('/super-admin/register-merchant', formData, getSuperAdminHeaders());
                showToast(response.data.message || 'Merchant provisioned successfully', 'success');
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            showToast(err.response?.data?.message || 'Operation failed', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const response = await api.patch(`/super-admin/users/${id}/status`, {}, getSuperAdminHeaders());
            setUsers(users.map(u => u.id === id ? { ...u, status: response.data.status } : u));
            showToast(`Merchant ${response.data.status} successfully.`, 'info');
        } catch (err) {
            showToast(err.response?.data?.message || 'Verification shift failed', 'error');
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete user '${name}'?`)) {
            return;
        }

        try {
            await api.delete(`/super-admin/users/${id}`, getSuperAdminHeaders());
            setUsers(users.filter(u => u.id !== id));
            showToast('Merchant deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Deletion failed', 'error');
        }
    };

    const handleAvatarClick = (userId) => {
        setSelectedUserId(userId);
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    };

    const openAvatarModal = (user) => {
        setAvatarModal(user);
        setAvatarPreview(null);
        document.body.style.overflow = 'hidden';
    };

    const closeAvatarModal = () => {
        setAvatarModal(null);
        setAvatarPreview(null);
        document.body.style.overflow = 'unset';
    };

    const handleUserAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedUserId) return;

        // Show local preview immediately
        const previewURL = URL.createObjectURL(file);
        setAvatarPreview(previewURL);

        setAvatarLoadingId(selectedUserId);
        const fd = new FormData();
        fd.append('image', file);

        try {
            const response = await api.post(`/super-admin/users/${selectedUserId}/profile-image`, fd, {
                ...getSuperAdminHeaders(),
                headers: { 
                    ...getSuperAdminHeaders().headers,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            showToast('Profile picture updated', 'success');
            const updatedImageUrl = response.data?.profile_image_url || response.data?.user?.profile_image_url;
            
            // Update the avatar modal's user data
            if (avatarModal && avatarModal.id === selectedUserId) {
                setAvatarModal(prev => ({ ...prev, profile_image_url: updatedImageUrl }));
            }
            
            // Remove from image errors set if it was there
            setImageErrors(prev => {
                const updated = new Set(prev);
                updated.delete(selectedUserId);
                return updated;
            });

            setAvatarPreview(null);
            fetchUsers();
        } catch (err) {
            showToast('Failed to update image', 'error');
            setAvatarPreview(null);
        } finally {
            setAvatarLoadingId(null);
            setSelectedUserId(null);
        }
    };

    const handleUserAvatarRemove = async (userId) => {
        if (!confirm('Remove this merchant\'s profile image?')) return;
        setAvatarLoadingId(userId);
        try {
            await api.delete(`/super-admin/users/${userId}/profile-image`, getSuperAdminHeaders());
            showToast('Merchant profile image removed', 'success');
            fetchUsers();
        } catch (err) {
            showToast('Failed to remove image', 'error');
        } finally {
            setAvatarLoadingId(null);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
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
                    <h1 style={titleStyle}>Merchants Portal</h1>
                    <p style={subtitleStyle}>Create and manage verified merchants</p>
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
                    <button onClick={() => handleOpenModal()} style={addBtnStyle}>
                        <UserPlus size={16} />
                        <span>Create Merchant</span>
                    </button>
                </div>
            </header>

            {/* Quick Filter Row */}
            <div style={filterRowStyle}>
                <div style={searchBoxStyle}>
                    <Search style={searchIconStyle} size={14} />
                    <input
                        placeholder="Search Merchant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={filterInputStyle}
                    />
                </div>
                {/* <div style={countBadgeWrap}>
                    <span>{filteredUsers.length} Active Participants</span>
                </div> */}
            </div>



            {/* Main Data Perspective */}
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderRowStyle}>
                            <th style={{ ...thStyle, paddingLeft: '24px' }}>Merchant Profiles</th>
                            <th style={thStyle}>Status</th>
                            <th style={thCenterStyle}>Products</th>
                            <th style={thCenterStyle}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center' }}>
                                    <div /> {/* Spacer */}
                                    <span style={{ whiteSpace: 'nowrap' }}>Earnings</span>
                                    <div style={{ width: 85, marginLeft: 8 }}>
                                        <CustomDropdown
                                            options={[
                                                { label: 'USD', value: 'USD' },
                                                { label: 'EUR', value: 'EUR' },
                                                { label: 'XCG', value: 'XCG' }
                                            ]}
                                            value={displayCurrency}
                                            onChange={setDisplayCurrency}
                                            showSearch={false}
                                            placeholder="CUR"
                                        />
                                    </div>
                                </div>
                            </th>
                            <th style={{ ...thStyle, textAlign: 'right', paddingRight: '24px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStateStyle}>Zero merchants found in active registry</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} style={trStyle}>
                                    <td style={{ ...tdStyle, paddingLeft: '24px' }}>
                                         <div style={userCellWrapperStyle}>
                                             <div style={tableAvatarStyle}>
                                                {avatarLoadingId === user.id ? (
                                                    <Loader2 key={`loader-${user.id}`} size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                ) : (user.profile_image_url && !imageErrors.has(user.id)) ? (
                                                    <img 
                                                        key={`avatar-${user.id}`}
                                                        src={user.profile_image_url} 
                                                        alt="" 
                                                        style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} 
                                                        onError={() => {
                                                            setImageErrors(prev => new Set(prev).add(user.id));
                                                        }}
                                                    />
                                                ) : (
                                                    <span key="fallback">{user.name[0].toUpperCase()}</span>
                                                )}
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
                                        <div style={earningsItemStyle}>
                                            <span style={currencySymbolStyle}>
                                                {displayCurrency === 'EUR' ? '€' : (displayCurrency === 'XCG' ? 'Cg' : '$')}
                                            </span>
                                            {(user.earnings?.[displayCurrency] || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', paddingRight: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                style={editPhotoBtnStyle}
                                                title="Edit Merchant Details"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => openAvatarModal(user)}
                                                style={editPhotoBtnStyle}
                                                title="Edit Profile Picture"
                                            >
                                                <Camera size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                style={deleteBtnStyle}
                                                title="Revoke Permission"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Hidden File Input for Avatar Management */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUserAvatarUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
            />

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>{editingUser ? 'Edit Merchant' : 'Add Merchant'}</h2>
                            </div>
                            <button onClick={handleCloseModal} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={modalFormStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputWrapperStyle}>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter Name"
                                        style={modalInputStyle}
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
                                        placeholder="Enter email"
                                        style={modalInputStyle}
                                    />
                                </div>
                            </div>
                            
                            {editingUser && (
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>Merchant Slug (Public URL)</label>
                                    <div style={inputWrapperStyle}>
                                        <input
                                            type="text"
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="merchant-slug"
                                            style={modalInputStyle}
                                        />
                                    </div>
                                    <p style={{fontSize: 12, color: '#6B7C93', marginTop: 2}}>
                                        Changing the slug will regenerate all product URLs for this merchant safely.
                                    </p>
                                </div>
                            )}

                            <div style={modalFooterStyle}>
                                <button type="button" onClick={handleCloseModal} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" disabled={formLoading} style={submitBtnStyle}>
                                    {formLoading ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Avatar Management Modal */}
            {avatarModal && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalCardStyle, width: '480px' }}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <h2 style={modalTitleStyle}>Edit Profile Picture</h2>
                                <p style={{ fontSize: '14px', color: '#6B7C93', marginTop: '4px' }}>{avatarModal.name} &middot; {avatarModal.email}</p>
                            </div>
                            <button onClick={closeAvatarModal} style={modalCloseBtnStyle}><X size={18} /></button>
                        </div>

                        {/* Current Avatar Preview */}
                        <div style={avatarModalPreviewSection}>
                            <div style={avatarModalLargeAvatar}>
                                {avatarLoadingId === avatarModal.id ? (
                                    <Loader2 key="loader" size={32} style={{ animation: 'spin 1s linear infinite', color: '#0070E0' }} />
                                ) : avatarPreview ? (
                                    <img key="preview" src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                                ) : (avatarModal.profile_image_url && !imageErrors.has(avatarModal.id)) ? (
                                    <img 
                                        key={`modal-avatar-${avatarModal.id}`} 
                                        src={avatarModal.profile_image_url} 
                                        alt="" 
                                        style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} 
                                        onError={() => {
                                            setImageErrors(prev => new Set(prev).add(avatarModal.id));
                                        }}
                                    />
                                ) : (
                                    <span key="fallback" style={{ fontSize: '40px', fontWeight: '800', color: '#0070E0' }}>{avatarModal.name?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <p style={{ fontSize: '12px', color: '#6B7C93', marginTop: '12px', textAlign: 'center' }}>
                                Accepted: JPG, PNG, WEBP &middot; Max 10MB
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={avatarModalActionsStyle}>
                            <button
                                onClick={() => {
                                    setSelectedUserId(avatarModal.id);
                                    fileInputRef.current.value = '';
                                    fileInputRef.current.click();
                                }}
                                disabled={avatarLoadingId === avatarModal.id}
                                style={avatarModalUploadBtn}
                            >
                                <Upload size={16} />
                                <span>Upload New Photo</span>
                            </button>
                            {avatarModal.profile_image_url && (
                                <button
                                    onClick={async () => {
                                        await handleUserAvatarRemove(avatarModal.id);
                                        setAvatarModal(prev => prev ? { ...prev, profile_image_url: null } : null);
                                        setAvatarPreview(null);
                                    }}
                                    disabled={avatarLoadingId === avatarModal.id}
                                    style={avatarModalRemoveBtn}
                                >
                                    <ImageOff size={16} />
                                    <span>Remove Photo</span>
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                            <button onClick={closeAvatarModal} style={cancelBtnStyle}>Close</button>
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

const pageContainerStyle = { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' };
const headerWrapperStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' };
const titleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const subtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };
const headerActionsStyle = { display: 'flex', alignItems: 'center', gap: '16px' };

const statsOverviewStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid #E3E8EF',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
};

const miniStatStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
const miniStatValueStyle = { fontSize: '15px', fontWeight: '700', color: '#1A1F36' };
const miniStatLabelStyle = { fontSize: '11px', color: '#6B7C93', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05e' };
const miniStatDividerStyle = { width: '1px', height: '16px', background: '#E3E8EF' };

const addBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#0070E0',
    border: 'none',
    padding: '12px 20px',
    color: '#FFF',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s'
};

const filterRowStyle = { display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '4px' };
const searchBoxStyle = { position: 'relative', width: '280px' };
const searchIconStyle = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7C93' };
const filterInputStyle = { width: '100%', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '10px', padding: '10px 12px 10px 36px', color: '#1A1F36', fontSize: '14px', outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };

const tableContainerStyle = { background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E3E8EF', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const tableHeaderRowStyle = { background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' };
const thStyle = { padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: '#6B7C93', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' };
const thCenterStyle = { ...thStyle, textAlign: 'center' };
const trStyle = { borderBottom: '1px solid #F7F9FC', transition: 'background 0.2s ease' };
const tdStyle = { padding: '20px 24px' };
const tdCenterStyle = { ...tdStyle, textAlign: 'center' };

const userCellWrapperStyle = { display: 'flex', alignItems: 'center', gap: '16px' };
const tableAvatarStyle = { 
    width: '40px', 
    height: '40px', 
    borderRadius: '12px', 
    background: '#F0F7FF', 
    border: '1px solid #E3E8EF', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: '700', 
    color: '#0070E0', 
    fontSize: '16px',
    overflow: 'hidden'
};

const editPhotoBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#F0F7FF',
    border: '1px solid #E3E8EF',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0070E0',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const avatarModalPreviewSection = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0 24px',
};

const avatarModalLargeAvatar = {
    width: '120px',
    height: '120px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #F0F7FF, #E8F4FD)',
    border: '3px solid #E3E8EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 28, 100, 0.08)',
};

const avatarModalActionsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
};

const avatarModalUploadBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#0070E0',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s',
};

const avatarModalRemoveBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#FEF2F2',
    color: '#EF4444',
    border: '1px solid #FEE2E2',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
};
const userNameTextStyle = { fontSize: '15px', fontWeight: '700', color: '#1A1F36' };
const userEmailTextStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };

const statusBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: '20px', border: '1px solid', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' };
const dotStyle = { width: '6px', height: '6px', borderRadius: '50%' };
const assetBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#F7F9FC', borderRadius: '8px', fontSize: '12px', color: '#4A5568', fontWeight: '600', border: '1px solid #E3E8EF' };
const earningsItemStyle = { fontSize: '16px', fontWeight: '700', color: '#1A1F36', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' };
const currencySymbolStyle = { color: '#6B7C93', fontSize: '14px', fontWeight: '600' };
const deleteBtnStyle = { width: '36px', height: '36px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E3E8EF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#E53E3E', cursor: 'pointer', transition: 'all 0.2s' };

const loadingContainerStyle = { padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' };
const spinnerStyle = { width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #F1F5F9', borderTop: '3px solid #0070E0', animation: 'spin 1s linear infinite' };
const loadingTextStyle = { fontSize: '12px', color: '#6B7C93', fontWeight: '600', textTransform: 'uppercase' };

const emptyStateStyle = { padding: '60px', textAlign: 'center', color: '#3f3f46', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 28, 100, 0.2)", backdropFilter: 'blur(8px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#FFFFFF", width: "450px", borderRadius: "24px", padding: '40px', border: '1px solid #E3E8EF', boxShadow: '0 25px 50px -12px rgba(0, 28, 100, 0.15)' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' };
const modalTitleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const modalCloseBtnStyle = { background: 'none', border: 'none', color: '#6B7C93', cursor: 'pointer', padding: '4px' };
const modalFormStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#4A5568', marginLeft: 4 };
const inputWrapperStyle = { position: 'relative' };
const modalInputStyle = { width: "100%", padding: "14px 16px", background: '#F8FAFC', border: '1px solid #E3E8EF', color: '#1A1F36', borderRadius: 12, fontSize: '15px', outline: 'none', transition: 'all 0.2s' };
const modalFooterStyle = { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: "12px" };

const submitBtnStyle = { padding: "14px 28px", background: "#0070E0", color: '#FFF', border: "none", fontWeight: "700", borderRadius: 12, cursor: "pointer", fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)' };
const cancelBtnStyle = { padding: "14px 28px", background: '#FFF', color: '#4A5568', border: '1px solid #E3E8EF', borderRadius: 12, cursor: 'pointer', fontSize: '14px', fontWeight: '600' };

const errorBannerStyle = { padding: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '10px', color: '#EF4444', fontSize: '13px', marginBottom: '16px', fontWeight: '600' };
const successBannerStyle = { padding: '12px', background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: '10px', color: '#10B981', fontSize: '13px', marginBottom: '16px', fontWeight: '600' };