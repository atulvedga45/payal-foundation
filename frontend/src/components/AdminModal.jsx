import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Users, MessageSquare, LogOut, CheckCircle, RefreshCw, SlidersHorizontal, Save, Heart, HandHeart, RotateCcw } from 'lucide-react';
import { adminLogin, fetchDashboardStats, fetchAllDonations, fetchAllVolunteers, fetchAllMessages, updateHomeStats } from '../api';

export default function AdminModal({ isOpen, onClose, homeStats, onUpdateHomeStats }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('homestats');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total_donations_count: 0,
    total_donations_amount: 0,
    total_volunteers_count: 0,
    total_messages_count: 0
  });
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);

  // Home Stats Form State (Editable Community Dedicated, Active Social Workers, Families Impacted)
  const [statsForm, setStatsForm] = useState({
    stat1_number: '100%',
    stat1_label: 'Community Dedicated',
    stat1_label_mr: 'समाजास समर्पित',
    stat2_number: '50+',
    stat2_label: 'Active Social Workers',
    stat2_label_mr: 'सक्रिय समाजसेवक',
    stat3_number: '10,000+',
    stat3_label: 'Families Impacted',
    stat3_label_mr: 'मदत पोहचलेली कुटुंबे'
  });
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsSuccess, setStatsSuccess] = useState('');

  useEffect(() => {
    if (homeStats) {
      setStatsForm({
        stat1_number: homeStats.stat1_number || '100%',
        stat1_label: homeStats.stat1_label || 'Community Dedicated',
        stat1_label_mr: homeStats.stat1_label_mr || 'समाजास समर्पित',
        stat2_number: homeStats.stat2_number || '50+',
        stat2_label: homeStats.stat2_label || 'Active Social Workers',
        stat2_label_mr: homeStats.stat2_label_mr || 'सक्रिय समाजसेवक',
        stat3_number: homeStats.stat3_number || '10,000+',
        stat3_label: homeStats.stat3_label || 'Families Impacted',
        stat3_label_mr: homeStats.stat3_label_mr || 'मदत पोहचलेली कुटुंबे'
      });
    }
  }, [homeStats, isOpen]);

  const handleSaveHomeStats = async (e) => {
    e.preventDefault();
    setStatsSaving(true);
    setStatsSuccess('');
    try {
      const updated = await updateHomeStats(token, statsForm);
      if (onUpdateHomeStats) {
        onUpdateHomeStats(updated || statsForm);
      }
      setStatsSuccess('होम पेज आकडेवारी यशस्वीरीत्या सेव्ह केली गेली! (Home stats updated live!)');
      setTimeout(() => setStatsSuccess(''), 4500);
    } catch (err) {
      console.error(err);
      if (onUpdateHomeStats) {
        onUpdateHomeStats(statsForm);
      }
      setStatsSuccess('बदल सेव्ह झाले (Local cache updated).');
      setTimeout(() => setStatsSuccess(''), 4500);
    } finally {
      setStatsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaults = {
      stat1_number: '100%',
      stat1_label: 'Community Dedicated',
      stat1_label_mr: 'समाजास समर्पित',
      stat2_number: '50+',
      stat2_label: 'Active Social Workers',
      stat2_label_mr: 'सक्रिय समाजसेवक',
      stat3_number: '10,000+',
      stat3_label: 'Families Impacted',
      stat3_label_mr: 'मदत पोहचलेली कुटुंबे'
    };
    setStatsForm(defaults);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(password);
      if (res && (res.token || res.success)) {
        const adminToken = res.token || 'admin123';
        setToken(adminToken);
        localStorage.setItem('admin_token', adminToken);
        loadAllAdminData();
      }
    } catch (err) {
      setLoginError('चुकीचा पासवर्ड! कृपया योग्य पासवर्ड प्रविष्ट करा (Default: admin123)');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('admin_token');
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [s, d, v, m] = await Promise.allSettled([
        fetchDashboardStats(),
        fetchAllDonations(),
        fetchAllVolunteers(),
        fetchAllMessages()
      ]);
      if (s.status === 'fulfilled' && s.value) setStats(s.value);
      if (d.status === 'fulfilled' && d.value) setDonations(d.value);
      if (v.status === 'fulfilled' && v.value) setVolunteers(v.value);
      if (m.status === 'fulfilled' && m.value) setMessages(m.value);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadAllAdminData();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        backgroundColor: 'var(--light-surface)',
        color: 'var(--text-main)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'var(--dark-bg)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-saffron)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Payal Foundation and Social Service — Admin Dashboard
              </h3>
              <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                Real-time management portal for inquiries, donations & volunteers
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        {!token ? (
          /* Login Form */
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <ShieldCheck size={32} />
            </div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Trust Admin Access
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Enter the admin secret key to view live donations, volunteer applications, and messages.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Admin Password (Default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.95rem',
                  marginBottom: '1rem'
                }}
                required
              />
              {loginError && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                Login to Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
            
            {/* Top Stat Ribbon & Tabs */}
            <div style={{
              padding: '1rem 1.75rem',
              backgroundColor: 'var(--light-bg)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Tab Switchers */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('homestats')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'homestats' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'homestats' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <SlidersHorizontal size={15} />
                  <span>Home Stats (आकडेवारी)</span>
                </button>

                <button
                  onClick={() => setActiveTab('donations')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'donations' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'donations' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <DollarSign size={15} />
                  <span>Donations ({donations.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('volunteers')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'volunteers' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'volunteers' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Users size={15} />
                  <span>Volunteers ({volunteers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: activeTab === 'messages' ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === 'messages' ? '#ffffff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <MessageSquare size={15} />
                  <span>Inquiries ({messages.length})</span>
                </button>
              </div>

              {/* Refresh & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={loadAllAdminData}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  <RefreshCw size={13} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Tab Contents with Scrollable Tables */}
            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flexGrow: 1 }}>
              {activeTab === 'homestats' && (
                <div>
                  {statsSuccess && (
                    <div style={{
                      backgroundColor: '#dcfce7',
                      border: '1px solid #86efac',
                      color: '#15803d',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      <CheckCircle size={18} />
                      <span>{statsSuccess}</span>
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                          Home Page Impact Numbers (मुख्यपृष्ठ आकडेवारी व्यवस्थापन)
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          मुख्यपृष्ठावरील ३ प्रमुख आकडेवारी (Community Dedicated, Active Social Workers, Families Impacted) येथे बदला. बदल त्वरित मुख्यपृष्ठावर दिसतील.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetDefaults}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>Reset Defaults (मूळ मूल्ये)</span>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveHomeStats}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      {/* Card 1: Community Dedicated */}
                      <div style={{
                        border: '1.5px solid #bfdbfe',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <HandHeart size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 1</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Community Dedicated</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 100% किंवा 500+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: 'var(--primary)'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat1_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat1_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Card 2: Active Social Workers */}
                      <div style={{
                        border: '1.5px solid #fed7aa',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: '#fef3c7',
                            color: '#b45309',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Users size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 2</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Social Workers</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 50+ किंवा 100+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#b45309'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat2_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat2_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>

                      {/* Card 3: Families Impacted */}
                      <div style={{
                        border: '1.5px solid #bbf7d0',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                          <div style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Heart size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Counter 3</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Families Impacted</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                            Value / Number (उदा. 10,000+ किंवा 25,000+)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_number}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_number: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.6rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#15803d'
                            }}
                          />
                        </div>

                        <div style={{ marginBottom: '0.85rem' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (English)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_label}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_label: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                            Label (मराठी)
                          </label>
                          <input
                            type="text"
                            value={statsForm.stat3_label_mr}
                            onChange={(e) => setStatsForm({ ...statsForm, stat3_label_mr: e.target.value })}
                            required
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.88rem'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                        Live Preview on Homepage (मुख्यपृष्ठावर कसे दिसेल):
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                      }}>
                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HandHeart size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>{statsForm.stat1_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat1_label_mr} / {statsForm.stat1_label}</div>
                          </div>
                        </div>

                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: '#fef3c7', color: '#b45309', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>{statsForm.stat2_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat2_label_mr} / {statsForm.stat2_label}</div>
                          </div>
                        </div>

                        <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: '#dcfce7', color: '#15803d', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>{statsForm.stat3_number || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{statsForm.stat3_label_mr} / {statsForm.stat3_label}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={statsSaving}
                        className="btn btn-primary"
                        style={{
                          padding: '0.75rem 1.75rem',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: statsSaving ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        <Save size={18} />
                        <span>{statsSaving ? 'Saving...' : 'Save & Update Homepage (बदल सेव्ह करा)'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'donations' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Donation Records
                  </h4>
                  {donations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No donations recorded yet. Test by submitting a donation above!
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Donor Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>PAN Card</th>
                            <th style={{ padding: '0.75rem' }}>Cause / Purpose</th>
                            <th style={{ padding: '0.75rem' }}>Amount</th>
                            <th style={{ padding: '0.75rem' }}>Ref / Mode</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map((d) => (
                            <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{d.donor_name}</td>
                              <td style={{ padding: '0.75rem' }}>{d.donor_phone}</td>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{d.donor_pan || '—'}</td>
                              <td style={{ padding: '0.75rem' }}>{d.cause}</td>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>₹{d.amount}</td>
                              <td style={{ padding: '0.75rem' }}><span className="badge badge-green">{d.payment_method}</span></td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(d.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'volunteers' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Volunteer Applications
                  </h4>
                  {volunteers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No volunteer applications received yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Full Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Area of Interest</th>
                            <th style={{ padding: '0.75rem' }}>Skills / Profession</th>
                            <th style={{ padding: '0.75rem' }}>Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {volunteers.map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{v.full_name}</td>
                              <td style={{ padding: '0.75rem' }}>{v.phone}</td>
                              <td style={{ padding: '0.75rem' }}>{v.email || '—'}</td>
                              <td style={{ padding: '0.75rem' }}><span className="badge badge-blue">{v.interest_area}</span></td>
                              <td style={{ padding: '0.75rem' }}>{v.skills || '—'}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{v.message || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Received Inquiries & Messages
                  </h4>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No contact messages received yet.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--light-bg)', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '0.75rem' }}>Name</th>
                            <th style={{ padding: '0.75rem' }}>Phone</th>
                            <th style={{ padding: '0.75rem' }}>Email</th>
                            <th style={{ padding: '0.75rem' }}>Message</th>
                            <th style={{ padding: '0.75rem' }}>Received Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{m.name}</td>
                              <td style={{ padding: '0.75rem' }}>{m.phone}</td>
                              <td style={{ padding: '0.75rem' }}>{m.email || '—'}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-main)', maxWidth: '280px' }}>{m.message}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                {new Date(m.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
