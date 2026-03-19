'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { formatLocalTime } from '@/utils/date';
import {
    ShieldCheck,
    Plus,
    X,
    Edit2,
    Trash2,
    Users,
    Activity,
    Lock,
    Unlock,
    Search,
    Clock,
    UserCircle,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';

export default function SuperAdminRoleManagement() {
    const { user: currentUser } = useUser();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState('admins'); // 'admins' | 'logs'
    const [admins, setAdmins] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        status: 'active'
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAdmins();
        fetchLogs();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/super-admin/admins');
            setAdmins(res.data);
        } catch (err) {
            showToast('Failed to sync Super Admins', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/super-admin/activity-logs');
            setLogs(res.data);
        } catch (err) {
            // silent fail
        }
    };

    const handleOpenModal = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                name: admin.name,
                email: admin.email,
                password: '', // blank intentionally for edit
                status: admin.status
            });
        } else {
            setEditingAdmin(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                status: 'active'
            });
        }
        setIsModalOpen(true);
        setIsPasswordVisible(false); // Reset visibility on open
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAdmin) {
                await api.put(`/super-admin/admins/${editingAdmin.id}`, formData);
                showToast('Super Admin profile updated', 'success');
            } else {
                await api.post('/super-admin/admins', formData);
                showToast('Super Admin created successfully', 'success');
            }
            setIsModalOpen(false);
            fetchAdmins();
            fetchLogs();
        } catch (err) {
            showToast(err.response?.data?.message || 'Configuration failed', 'error');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/super-admin/admins/${id}/status`);
            fetchAdmins();
            fetchLogs();
            showToast('Super Admin status toggled', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Status toggle failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you absolutely sure you want to permanently delete this Super Admin?')) return;
        try {
            await api.delete(`/super-admin/admins/${id}`);
            fetchAdmins();
            fetchLogs();
            showToast('Super Admin deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Deletion failed', 'error');
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={spinnerStyle} />
            </div>
        )
    }

    const filteredAdmins = admins.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={containerStyle}>
            {/* Header Area */}
            <header style={headerAreaStyle}>
                <div>
                    <h1 style={pageTitleStyle}>Access Management</h1>
                    <p style={pageSubtitleStyle}>Govern super administrative roles and audit platform activity.</p>
                </div>
                {activeTab === 'admins' && currentUser?.id === 1 && (
                    <button onClick={() => handleOpenModal()} style={actionCreateBtnStyle}>
                        <Plus size={16} />
                        <span>Add Super Admin</span>
                    </button>
                )}
            </header>

            {/* Tab Navigation */}
            <div style={tabContainerStyle}>
                <button
                    onClick={() => setActiveTab('admins')}
                    style={activeTab === 'admins' ? activeTabBtnStyle : inactiveTabBtnStyle}
                >
                    <Users size={16} />
                    <span>Administrators</span>
                </button>
                {currentUser?.id === 1 && (
                    <button
                        onClick={() => setActiveTab('logs')}
                        style={activeTab === 'logs' ? activeTabBtnStyle : inactiveTabBtnStyle}
                    >
                        <Activity size={16} />
                        <span>Audit Log</span>
                    </button>
                )}
            </div>

            {/* Body */}
            {activeTab === 'admins' ? (
                <>
                    <div style={searchWrapStyle}>
                        <Search size={14} style={searchIconStyle} />
                        <input
                            placeholder="Search administrators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>

                    <div style={gridStyle}>
                        {filteredAdmins.map(admin => {
                            const isMe = currentUser?.id === admin.id;
                            const isOriginal = admin.id === 1;

                            return (
                                <div key={admin.id} style={cardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <div style={{ ...statusPillStyle, background: admin.status === 'active' ? '#ECFDF5' : '#FEF2F2', color: admin.status === 'active' ? '#10B981' : '#EF4444' }}>
                                            <div style={{ ...dotStyle, background: 'currentColor' }} />
                                            {admin.status}
                                        </div>
                                        {isMe && <div style={meBadgeStyle}>You</div>}
                                        {isOriginal && !isMe && <div style={originalBadgeStyle}>Root</div>}
                                    </div>
                                    <div style={cardBodyStyle}>
                                        <div style={avatarStyle}>
                                            <ShieldCheck size={28} color="#0070E0" />
                                        </div>
                                        <div>
                                            <h3 style={adminNameStyle}>{admin.name}</h3>
                                            <p style={adminEmailStyle}>{admin.email}</p>
                                        </div>
                                    </div>

                                    <div style={statsWrapStyle}>
                                        <div style={statBoxStyle}>
                                            <div style={statLabelStyle}>Status</div>
                                            <div style={statValueStyle}>{admin.status === 'active' ? 'Authorized' : 'Suspended'}</div>
                                        </div>
                                        <div style={statBoxStyle}>
                                            <div style={statLabelStyle}>Last Login</div>
                                            <div style={statValueStyle}>{admin.last_login_at ? formatLocalTime(admin.last_login_at) : 'Never'}</div>
                                        </div>
                                    </div>

                                    <div style={actionsWrapStyle}>
                                        {currentUser?.id === 1 && (
                                            <button onClick={() => handleOpenModal(admin)} style={editBtnStyle}>
                                                <Edit2 size={14} /> Edit
                                            </button>
                                        )}

                                        {currentUser?.id === 1 && !isMe && !isOriginal && (
                                            <>
                                                <button
                                                    onClick={() => handleToggleStatus(admin.id)}
                                                    style={{ ...toggleBtnStyle, color: admin.status === 'active' ? '#F59E0B' : '#10B981', borderColor: admin.status === 'active' ? '#FEF3C7' : '#D1FAE5', background: admin.status === 'active' ? '#FFFBEB' : '#ECFDF5' }}
                                                >
                                                    {admin.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                                                </button>
                                                <button onClick={() => handleDelete(admin.id)} style={deleteBtnStyle}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div style={logTableWrapStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr style={thRowStyle}>
                                <th style={thStyle}>Date & Time</th>
                                <th style={thStyle}>Operator</th>
                                <th style={thStyle}>Action Executed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={emptyTdStyle}>No events recorded in ledger</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} style={trStyle}>
                                        <td style={tdTimeStyle}>
                                            <div style={timeTagStyle}>
                                                <Clock size={12} />
                                                <span>{formatLocalTime(log.created_at)}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={logAvatarStyle}><UserCircle size={16} /></div>
                                                <span style={logOperatorStyle}>{log.user?.name || 'Unknown Node'}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={logActionStyle}>{log.action}</div>
                                            {log.details && <div style={logDetailsStyle}>{log.details}</div>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalCardStyle}>
                        <div style={modalHeaderStyle}>
                            <h2 style={modalTitleStyle}>{editingAdmin ? "Edit Details" : "Add Details"}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={closeBtnStyle}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={formStyle}>
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} placeholder="E.g., John Doe" />
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Email Address (Login ID)</label>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} placeholder="admin@paysigur.com" />
                            </div>

                            {editingAdmin && (
                                <div style={formGroupStyle}>
                                    <label style={labelStyle}>New Password (Optional)</label>
                                    <div style={passwordInputWrapperStyle}>
                                        <input
                                            type={isPasswordVisible ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            style={{ ...inputStyle, paddingRight: '48px' }}
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                                            style={passwordToggleBtnStyle}
                                        >
                                            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div style={passHintStyle}>Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.</div>
                                </div>
                            )}

                            <div style={formGroupStyle}>
                                <label style={labelStyle}>Network Status</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={selectStyle}>
                                    <option value="active">Active (Authorized)</option>
                                    <option value="inactive">Inactive (Suspended)</option>
                                </select>
                            </div>

                            <div style={submitRowStyle}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                                <button type="submit" style={submitBtnStyle}>{editingAdmin ? "Save" : "Add"}</button>
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

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease' };
const headerAreaStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const pageTitleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const pageSubtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };

const actionCreateBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0070E0', color: '#FFF',
    border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)', transition: 'all 0.2s'
};

const tabContainerStyle = { display: 'flex', gap: '8px', borderBottom: '1px solid #E3E8EF', paddingBottom: '12px' };
const activeTabBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#001C64', color: '#FFF',
    border: 'none', borderRadius: '100px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
};
const inactiveTabBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', color: '#6B7C93',
    border: '1px solid #E3E8EF', borderRadius: '100px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
};

const searchWrapStyle = { position: 'relative', width: '320px' };
const searchIconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' };
const searchInputStyle = { width: '100%', padding: '12px 14px 12px 40px', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '12px', outline: 'none', fontSize: '14px', color: '#1A1F36', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' };
const cardStyle = { background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)', transition: 'all 0.3s ease' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const statusPillStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' };
const dotStyle = { width: '6px', height: '6px', borderRadius: '50%' };
const meBadgeStyle = { padding: '4px 10px', background: '#F0F7FF', color: '#0070E0', borderRadius: '100px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', border: '1px solid rgba(0, 112, 224, 0.1)' };
const originalBadgeStyle = { padding: '4px 10px', background: '#FEF2F2', color: '#EF4444', borderRadius: '100px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', border: '1px solid rgba(239, 68, 68, 0.1)' };

const cardBodyStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' };
const avatarStyle = { width: '56px', height: '56px', borderRadius: '16px', background: '#F0F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 112, 224, 0.1)' };
const adminNameStyle = { fontSize: '18px', fontWeight: '800', color: '#1A1F36', marginBottom: '2px', fontFamily: "'Outfit', sans-serif" };
const adminEmailStyle = { fontSize: '13px', color: '#6B7C93', fontWeight: '500' };

const statsWrapStyle = { display: 'flex', gap: '12px', marginBottom: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E3E8EF' };
const statBoxStyle = { flex: 1 };
const statLabelStyle = { fontSize: '11px', color: '#6B7C93', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' };
const statValueStyle = { fontSize: '14px', color: '#001C64', fontWeight: '800' };

const actionsWrapStyle = { display: 'flex', gap: '8px', marginTop: 'auto' };
const editBtnStyle = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: '#FFFFFF', color: '#0070E0', border: '1px solid #0070E0', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' };
const toggleBtnStyle = { width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' };
const deleteBtnStyle = { width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' };

const logTableWrapStyle = { background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E3E8EF', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thRowStyle = { background: '#F8FAFC', borderBottom: '1px solid #E3E8EF' };
const thStyle = { padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#6B7C93', textTransform: 'uppercase', letterSpacing: '0.05em' };
const trStyle = { borderBottom: '1px solid #F1F5F9' };
const tdStyle = { padding: '20px 24px' };
const tdTimeStyle = { padding: '20px 24px', width: '220px' };
const timeTagStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#F1F5F9', color: '#475569', borderRadius: '100px', fontSize: '12px', fontWeight: '600' };
const logAvatarStyle = { color: '#0070E0', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const logOperatorStyle = { fontSize: '14px', fontWeight: '700', color: '#1A1F36' };
const logActionStyle = { fontSize: '14px', color: '#4A5568', fontWeight: '500' };
const logDetailsStyle = { fontSize: '12px', color: '#718096', marginTop: '2px', fontStyle: 'italic' };
const emptyTdStyle = { padding: '60px 24px', textAlign: 'center', fontSize: '13px', color: '#6B7C93', fontWeight: '600' };

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 28, 100, 0.2)", backdropFilter: 'blur(8px)', display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalCardStyle = { background: "#FFFFFF", width: "100%", maxWidth: "460px", borderRadius: "24px", padding: '40px', border: '1px solid #E3E8EF', boxShadow: '0 25px 50px -12px rgba(0, 28, 100, 0.1)', animation: 'slideUp 0.3s ease-out' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const modalTitleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const closeBtnStyle = { background: '#F1F5F9', border: 'none', color: '#6B7C93', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#4A5568' };
const inputStyle = { width: '100%', padding: '14px 16px', background: '#F8FAFC', border: '1px solid #E3E8EF', borderRadius: '12px', fontSize: '15px', color: '#1A1F36', outline: 'none', transition: 'all 0.2s' };
const selectStyle = { ...inputStyle, appearance: 'none' };
const passHintStyle = { fontSize: '11px', color: '#A0AEC0', fontWeight: '500', marginTop: '2px' };
const passwordInputWrapperStyle = { position: 'relative', width: '100%' };
const passwordToggleBtnStyle = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7C93', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', padding: '4px' };

const submitRowStyle = { display: 'flex', gap: '12px', marginTop: '12px' };
const cancelBtnStyle = { flex: 1, padding: '14px', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '12px', color: '#4A5568', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const submitBtnStyle = { flex: 1, padding: '14px', background: '#0070E0', border: 'none', borderRadius: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)' };

const spinnerStyle = { width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' };
