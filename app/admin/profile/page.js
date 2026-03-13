'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/utils/api';
import {
    User,
    Mail,
    ShieldCheck,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Fingerprint,
    Upload,
    Trash2,
    Camera
} from 'lucide-react';

import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

export default function ProfileSettings() {
    const { refreshUser } = useUser();
    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [slug, setSlug] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await api.get('/user');
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setSlug(user.slug);
                setProfileImageUrl(user.profile_image_url);
                setImageError(false);
            } catch (err) {
                showToast('Failed to load profile data', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [showToast]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/user', { name, email, slug });
            showToast('Profile updated successfully.', 'success');
            await refreshUser();
        } catch (err) {
            showToast(err.response?.data?.message || 'Update synchronization failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToast('Invalid format. Please upload JPG, PNG or WEBP.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast('Image too large. Max size is 10MB.', 'error');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setImageError(false);
        };
        reader.readAsDataURL(file);

        uploadAvatar(file);
    };

    const uploadAvatar = async (file) => {
        setAvatarLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/user/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfileImageUrl(response.data.user.profile_image_url);
            setPreviewUrl(null);
            setImageError(false);
            showToast('Profile image updated successfully', 'success');
            await refreshUser();
        } catch (err) {
            showToast(err.response?.data?.message || 'Image upload failed', 'error');
            setPreviewUrl(null);
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!confirm('Remove your profile image?')) return;
        setAvatarLoading(true);
        try {
            await api.delete('/user/profile-image');
            setProfileImageUrl(null);
            setPreviewUrl(null);
            setImageError(false);
            showToast('Profile image removed', 'success');
            await refreshUser();
        } catch (err) {
            showToast('Failed to remove image', 'error');
        } finally {
            setAvatarLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div style={pageContainerStyle}>
            {/* Header Section */}
            <header style={headerWrapperStyle}>
                <div>
                    <h1 style={titleStyle}>Profile Settings</h1>
                    <p style={subtitleStyle}>Manage your personal account details and brand presence</p>
                </div>
            </header>

            {/* Profile Section */}
            <section style={formSectionStyle}>
                <div style={formCardStyle}>
                    
                    {/* Avatar Upload UI */}
                    <div style={avatarSectionStyle}>
                        <div style={avatarWrapperStyle}>
                            {avatarLoading ? (
                                <div style={{...avatarFallbackStyle, background: '#F8FAFC'}}>
                                    <Loader2 size={24} style={{ animation: 'spin 1.5s linear infinite', color: '#0070E0' }} />
                                </div>
                            ) : (
                                <>
                                    {(previewUrl || profileImageUrl) && !imageError ? (
                                        <img 
                                            src={previewUrl || profileImageUrl} 
                                            alt="Avatar" 
                                            style={avatarImageStyle} 
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div style={avatarFallbackStyle}>
                                            {name?.[0]?.toUpperCase() || 'A'}
                                        </div>
                                    )}
                                </>
                            )}
                            <button 
                                onClick={() => !avatarLoading && fileInputRef.current.click()} 
                                style={{
                                    ...cameraBtnStyle,
                                    opacity: avatarLoading ? 0.5 : 1,
                                    cursor: avatarLoading ? 'not-allowed' : 'pointer'
                                }}
                                title="Change Image"
                                disabled={avatarLoading}
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                        
                        <div style={avatarInfoStyle}>
                            <h3 style={avatarTitleStyle}>Profile Picture</h3>
                            <p style={avatarSubStyle}>JPG, PNG or WEBP. Max 10MB.</p>
                            <div style={avatarActionsStyle}>
                                <button 
                                    onClick={() => fileInputRef.current.click()} 
                                    style={uploadLinkStyle}
                                >
                                    <Upload size={14} />
                                    Upload New
                                </button>
                                {(profileImageUrl || previewUrl) && (
                                    <button 
                                        onClick={handleRemoveAvatar} 
                                        style={removeLinkStyle}
                                    >
                                        <Trash2 size={14} />
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/jpeg,image/png,image/webp" 
                            style={{ display: 'none' }} 
                        />
                    </div>

                    <div style={dividerStyle} />

                    {/* Basic Info Form */}
                    <form onSubmit={handleUpdate} style={formStyle}>
                        <h2 style={sectionTitleStyle}>General Information</h2>
                        <div style={inputGridStyle}>
                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputWrapperStyle}>
                                    <User size={14} style={inputIconStyle} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Email Address</label>
                                <div style={inputWrapperStyle}>
                                    <Mail size={14} style={inputIconStyle} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={inputScopeStyle}>
                                <label style={labelStyle}>Merchant Slug (Public URL)</label>
                                <div style={inputWrapperStyle}>
                                    <Fingerprint size={14} style={inputIconStyle} />
                                    <input
                                        type="text"
                                        required
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="merchant-slug"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={actionScopeStyle}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    ...submitButtonStyle,
                                    opacity: saving ? 0.7 : 1,
                                    cursor: saving ? 'wait' : 'pointer'
                                }}
                            >
                                {saving ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Save size={16} />
                                        <span>Save Profile</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div >
            </section >
        </div >
    );
}

// ──────────────────────────────────────────────
// STYLES DEFINITION
// ──────────────────────────────────────────────

const pageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.4s ease-out'
};

const headerWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px'
};

const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#001c64',
    letterSpacing: '-0.02em',
    fontFamily: "'Outfit', sans-serif"
};

const subtitleStyle = {
    fontSize: '14px',
    color: '#6B7C93',
    marginTop: '4px',
    fontWeight: '500'
};

const formSectionStyle = { marginTop: '4px' };

const formCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3E8EF',
    borderRadius: '24px',
    padding: '40px',
    position: 'relative',
    boxShadow: '0 4px 20px -1px rgba(0, 28, 100, 0.03)'
};

const avatarSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginBottom: '40px'
};

const avatarWrapperStyle = {
    position: 'relative',
    width: '100px',
    height: '100px',
    flexShrink: 0
};

const avatarImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '30px',
    objectFit: 'cover',
    border: '4px solid #FFF',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

const avatarFallbackStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
    border: '2px solid #E2E8F0',
    color: '#001C64',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '800',
    fontFamily: "'Outfit', sans-serif"
};

const avatarOverlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
};

const cameraBtnStyle = {
    position: 'absolute',
    right: '-8px',
    bottom: '-8px',
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: '#0070E0',
    color: '#FFF',
    border: '4px solid #FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease'
};

const avatarInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
};

const avatarTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1F36'
};

const avatarSubStyle = {
    fontSize: '13px',
    color: '#6B7C93'
};

const avatarActionsStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '12px'
};

const uploadLinkStyle = {
    background: 'transparent',
    border: 'none',
    color: '#0070E0',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: 0
};

const removeLinkStyle = {
    ...uploadLinkStyle,
    color: '#E74C3C'
};

const dividerStyle = {
    height: '1px',
    background: '#E3E8EF',
    width: '100%',
    margin: '32px 0'
};

const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1F36',
    marginBottom: '20px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const inputGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
};

const inputScopeStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4A5568'
};

const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
};

const inputIconStyle = {
    position: 'absolute',
    left: '14px',
    color: '#94A3B8'
};

const inputStyle = {
    width: '100%',
    background: '#F8FAFC',
    border: '1px solid #E3E8EF',
    borderRadius: '14px',
    padding: '14px 14px 14px 44px',
    color: '#1A1F36',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s ease',
};

const actionScopeStyle = {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end'
};

const submitButtonStyle = {
    background: '#0070E0',
    color: '#FFF',
    padding: '16px 36px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '700',
    boxShadow: '0 10px 15px -3px rgba(0, 112, 224, 0.2)',
    transition: 'all 0.2s ease',
};