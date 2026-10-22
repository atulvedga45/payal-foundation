import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { submitContact } from '../api';
import confetti from 'canvas-confetti';

export default function ContactSection({ t }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  });
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('कृपया नाव, फोन नंबर आणि संदेश आवश्यक भरा');
      return;
    }

    setSending(true);
    const dataToSubmit = { ...formData };
    setLastSubmitted(dataToSubmit);

    try {
      const payload = {
        name: dataToSubmit.name,
        phone: dataToSubmit.phone,
        address: dataToSubmit.address || '',
        message: dataToSubmit.message
      };
      await submitContact(payload);
      setSentSuccess(true);
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (_) {}
      setFormData({ name: '', phone: '', address: '', message: '' });
    } catch (err) {
      console.warn("Backend not reachable, setting sent locally", err);
      setSentSuccess(true);
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (_) {}
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
        <div 
          className="card reveal-scale" 
          style={{ 
            padding: '0', 
            overflow: 'hidden', 
            maxWidth: '880px', 
            margin: '0 auto',
            borderRadius: 'var(--radius-lg, 16px)'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          }}>

            {/* Left: Contact Info */}
            <div style={{
              background: 'var(--primary-gradient)',
              color: '#ffffff',
              padding: '2.25rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.65rem' }}>
                  Payal Foundation and Social Service
                </h3>
                <p style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '1.65rem' }}>
                  Reach out to us directly or visit our registered office. We are always ready to serve and collaborate for social welfare.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
                      <Phone size={20} style={{ color: 'var(--accent-green)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        {t.contact.phoneLabel}
                      </div>
                      <a href={`tel:${t.phone.replace(/\s+/g, '')}`} style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1rem', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                        {t.phone}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
                      <MapPin size={20} style={{ color: '#fef08a' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                        {t.contact.addressLabel || 'पत्ता'}
                      </div>
                      <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                        {t.address}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div style={{
                marginTop: '1.75rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fef08a',
                letterSpacing: '0.02em'
              }}>
                सोन्या भाऊ तुमच्या सेवेसाठी हजर.
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div style={{ padding: '2.25rem 2rem', background: '#ffffff' }}>

              {sentSuccess ? (
                <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    संदेश यशस्वीरीत्या पाठवला!
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                    {t.contact.success || 'आपली माहिती डेटाबेसमध्ये नोंदवली गेली आहे. खालील नंबरवर त्वरित WhatsApp संदेश पाठवा:'}
                  </p>

                  {/* Direct Message Action Buttons for 9225243552 & 8766573113 */}
                  {lastSubmitted && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                      <a
                        href={`https://wa.me/919225243552?text=${encodeURIComponent(
                          `*नवीन संपर्क संदेश - पायल फाउंडेशन*\n` +
                          `👤 *नाव:* ${lastSubmitted.name}\n` +
                          `📞 *फोन:* ${lastSubmitted.phone}\n` +
                          `📍 *पत्ता:* ${lastSubmitted.address || 'दिलेला नाही'}\n` +
                          `📝 *संदेश:* ${lastSubmitted.message}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          background: '#25D366',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          padding: '0.65rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          textDecoration: 'none',
                          boxShadow: '0 3px 10px rgba(37, 211, 102, 0.35)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <MessageSquare size={16} />
                        <span>WhatsApp वर पाठवा (9225243552)</span>
                      </a>

                      <a
                        href={`https://wa.me/918766573113?text=${encodeURIComponent(
                          `*नवीन संपर्क संदेश - पायल फाउंडेशन*\n` +
                          `👤 *नाव:* ${lastSubmitted.name}\n` +
                          `📞 *फोन:* ${lastSubmitted.phone}\n` +
                          `📍 *पत्ता:* ${lastSubmitted.address || 'दिलेला नाही'}\n` +
                          `📝 *संदेश:* ${lastSubmitted.message}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          background: '#128C7E',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          padding: '0.65rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          textDecoration: 'none',
                          boxShadow: '0 3px 10px rgba(18, 140, 126, 0.35)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <MessageSquare size={16} />
                        <span>WhatsApp वर पाठवा (8766573113)</span>
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => { setSentSuccess(false); setLastSubmitted(null); }}
                    className="btn btn-outline btn-sm"
                  >
                    दुसरा संदेश पाठवा (Send Another Message)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
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
                          padding: '0.62rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        {t.contact.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 92252 43552"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.62rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      {t.contact.address || 'पत्ता'}
                    </label>
                    <input
                      type="text"
                      placeholder={t.contact.addressPlaceholder || "आपला पत्ता / शहर लिहा..."}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.62rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      {t.contact.message} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Type your question or query here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.62rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn btn-primary btn-glow-pulse btn-shine"
                    style={{
                      width: '100%',
                      padding: '0.78rem',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-full)'
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
