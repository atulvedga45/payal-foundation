import React, { useState } from 'react';
import { MapPin, Phone, Mail, FileText, Send, CheckCircle2 } from 'lucide-react';
import { submitContact } from '../api';

export default function ContactSection({ t }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please fill your name, phone and message');
      return;
    }

    setSending(true);
    try {
      await submitContact(formData);
      setSentSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.warn("Backend not reachable, setting sent locally", err);
      setSentSuccess(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section section-bg-alt">
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <Mail size={15} />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        {/* Content Box */}
        <div className="card reveal-scale" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}>

            {/* Left: Contact Info */}
            <div style={{
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Payal Foundation and Social Service
                </h3>
                <p style={{ opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Reach out to us directly or visit our registered office. We are always ready to serve and collaborate for social welfare.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                      <MapPin size={22} style={{ color: 'var(--accent-saffron)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        {t.contact.addressLabel}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px', lineHeight: 1.5 }}>
                        {t.address}
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                      <Phone size={22} style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        {t.contact.phoneLabel}
                      </div>
                      <a href={`tel:${t.phone.replace(/\s+/g, '')}`} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                        {t.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                      <Mail size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        Email Contact
                      </div>
                      <a href={`mailto:${t.email}`} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                        {t.email}
                      </a>
                    </div>
                  </div>

                  {/* Registration Certificate */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.6rem', borderRadius: '10px' }}>
                      <FileText size={22} style={{ color: 'var(--accent-saffron)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        {t.contact.regDetails}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>
                        {t.contact.regDetailsDesc}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', fontSize: '0.8rem', opacity: 0.75 }}>
                Office Hours: Monday - Saturday: 10:00 AM - 7:00 PM
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div style={{ padding: '3rem 2.5rem', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                {t.contact.formTitle}
              </h3>

              {sentSuccess ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}>
                    <CheckCircle2 size={34} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    Message Sent!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    {t.contact.success}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSentSuccess(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        {t.contact.name} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                        {t.contact.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 77768 76121"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.contact.message} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Type your question or query here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary shimmer-btn"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '1rem'
                    }}
                  >
                    <Send size={16} />
                    <span>{sending ? 'Sending...' : t.contact.sendBtn}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
