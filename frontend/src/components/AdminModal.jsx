import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Users, MessageSquare, LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { adminLogin, fetchDashboardStats, fetchAllDonations, fetchAllVolunteers, fetchAllMessages } from '../api';

export default function AdminModal({ isOpen, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('donations');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await adminLogin(password);
      if (res.token) {
        setToken(res.token);
        localStorage.setItem('admin_token', res.token);
        loadAllAdminData();
      }
    } catch (err) {
      setLoginError('Invalid password. Default password is: admin123');
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
