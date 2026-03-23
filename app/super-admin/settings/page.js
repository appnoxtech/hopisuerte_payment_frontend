'use client';

import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import {
    Settings,
    CreditCard,
    Percent,
    Save,
    RefreshCcw,
    AlertTriangle,
    ShieldCheck,
    Zap,
    Lock
} from 'lucide-react';

export default function SuperAdminSettings() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        fee_percentage: 10.00,
        apply_fee_to_all_products: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/super-admin/settings');
            if (res.data) {
                setSettings(prev => ({
                    ...prev,
                    fee_percentage: res.data.fee_percentage || 10.00
                }));
            }
        } catch (err) {
            showToast('Could not load changes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/super-admin/settings', settings);
            showToast('Changes saved successfully', 'success');
        } catch (err) {
            showToast('Changes failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
                <div style={spinnerStyle} />
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <header style={headerAreaStyle}>
                <div>
                    <h1 style={pageTitleStyle}>System Configuration</h1>
                    <p style={pageSubtitleStyle}>Govern global platform parameters and financial gateway integration.</p>
                </div>
            </header>

            <form onSubmit={handleSave} style={formStyle}>
                {/* Fee Configuration */}
                <div style={sectionCardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle}><Percent size={20} color="#0070E0" /></div>
                        <div>
                            <h2 style={sectionTitleStyle}>Revenue & Fees</h2>
                            <p style={sectionDescStyle}>Manage the exchange and processing percentage applied to all transactions.</p>
                        </div>
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Exchange & Processing Fee (%)</label>
                        <div style={inputWrapperStyle}>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.fee_percentage}
                                onChange={(e) => setSettings({ ...settings, fee_percentage: e.target.value })}
                                style={inputStyle}
                                className="no-spinner"
                                placeholder="10.00"
                            />
                            <div style={inputSuffixStyle}>%</div>
                        </div>
                        <p style={hintTextStyle}>This fee is added to the base amount entered by customers across all currencies.</p>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px', padding: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px' }}>
                            <input 
                                type="checkbox" 
                                id="applyGlobalFee" 
                                checked={settings.apply_fee_to_all_products} 
                                onChange={(e) => setSettings({ ...settings, apply_fee_to_all_products: e.target.checked })}
                                style={{ marginTop: '3px', cursor: 'pointer', width: '18px', height: '18px', accentColor: '#DC2626', flexShrink: 0 }} 
                            />
                            <div>
                                <label htmlFor="applyGlobalFee" style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#991B1B', cursor: 'pointer', marginBottom: '4px' }}>
                                    Apply this global processing fee to all products
                                </label>
                                <p style={{ fontSize: '12px', color: '#B91C1C', margin: 0, fontWeight: '500', lineHeight: 1.4 }}>
                                    Warning: This will permanently overwrite and erase any custom fee percentages currently set on individual products. They will inherit this new global fee.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stripe Gateway Management */}
                <div style={sectionCardStyle}>
                    <div style={sectionHeaderStyle}>
                        <div style={iconBoxStyle}><CreditCard size={20} color="#0070E0" /></div>
                        <div>
                            <h2 style={sectionTitleStyle}>Financial Gateways (Stripe)</h2>
                            <p style={sectionDescStyle}>Provision and manage primary and secondary payment infrastructure config via environment variables.</p>
                        </div>
                    </div>

                    <div style={warningBoxStyle}>
                        <AlertTriangle size={18} />
                        <p>Stripe financial gateways are now provisioned via environment variables for enhanced security. Contact system engineers for key rotations.</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={footerAreaStyle}>
                    <button type="button" onClick={fetchSettings} style={resetBtnStyle}>
                        <RefreshCcw size={16} /> <span>Revert Changes</span>
                    </button>
                    <button type="submit" disabled={saving} style={saveBtnStyle}>
                        {saving ? <div style={spinnerSmall} /> : <Save size={18} />}
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', animation: 'fadeIn 0.5s ease' };
const headerAreaStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const pageTitleStyle = { fontSize: '24px', fontWeight: '800', color: '#001C64', letterSpacing: '-0.02em', fontFamily: "'Outfit', sans-serif" };
const pageSubtitleStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500', marginTop: '4px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '24px' };

const sectionCardStyle = { background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 28, 100, 0.05)' };
const sectionHeaderStyle = { display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px', position: 'relative' };
const iconBoxStyle = { width: '44px', height: '44px', background: '#F0F7FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 112, 224, 0.1)' };
const sectionTitleStyle = { fontSize: '18px', fontWeight: '800', color: '#1A1F36', marginBottom: '4px', fontFamily: "'Outfit', sans-serif" };
const sectionDescStyle = { fontSize: '14px', color: '#6B7C93', fontWeight: '500' };

const fieldGroupStyle = { maxWidth: '400px' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#4A5568', marginBottom: '8px' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputStyle = { width: '100%', padding: '14px 16px', background: '#F8FAFC', border: '1px solid #E3E8EF', borderRadius: '12px', fontSize: '16px', color: '#1A1F36', fontWeight: '700', outline: 'none', transition: 'all 0.2s' };
const inputSuffixStyle = { position: 'absolute', right: '16px', fontSize: '16px', fontWeight: '800', color: '#0070E0' };
const hintTextStyle = { fontSize: '12px', color: '#718096', marginTop: '8px', lineHeight: '1.5' };

const activeToggleWrapStyle = { marginLeft: 'auto', textAlign: 'right' };
const activeSelectStyle = { padding: '10px 16px', background: '#001C64', color: '#FFF', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', outline: 'none' };

const columnsStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' };
const acctColStyle = { background: '#F8FAFC', border: '1px solid #E3E8EF', borderRadius: '20px', padding: '24px' };
const colHeaderStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' };
const statusDotStyle = { width: '8px', height: '8px', borderRadius: '50%' };
const colTitleStyle = { fontSize: '15px', fontWeight: '800', color: '#001C64' };
const activeBadgeStyle = { padding: '4px 10px', background: '#D1FAE5', color: '#059669', borderRadius: '100px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' };

const fieldStyle = { marginBottom: '16px' };
const smallLabelStyle = { display: 'block', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' };
const inputSmallStyle = { width: '100%', padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E3E8EF', borderRadius: '10px', fontSize: '14px', color: '#1A1F36', outline: 'none' };

const warningBoxStyle = { marginTop: '24px', padding: '16px', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', color: '#92400E', fontWeight: '500' };

const footerAreaStyle = { display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' };
const resetBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', background: '#FFFFFF', color: '#6B7C93', border: '1px solid #E3E8EF', borderRadius: '16px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' };
const saveBtnStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 32px', background: '#0070E0', color: '#FFF', border: 'none', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 112, 224, 0.2)' };

const spinnerStyle = { width: 32, height: 32, borderRadius: '50%', borderTop: '2px solid #0070E0', borderBottom: '2px solid rgba(0, 112, 224, 0.1)', animation: 'spin 1s linear infinite' };
const spinnerSmall = { width: 18, height: 18, borderRadius: '50%', borderTop: '2px solid #FFF', borderBottom: '2px solid rgba(255,255,255,0.2)', animation: 'spin 1s linear infinite' };
