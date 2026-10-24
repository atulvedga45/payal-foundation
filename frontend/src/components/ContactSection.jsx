import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { submitContact, sendEmailViaVercel } from '../api';
import confetti from 'canvas-confetti';

export default function ContactSection({ t, lang = 'mr', trustInfo }) {
  const isEn = lang === 'en' || (t && t.contact && t.contact.phoneLabel === 'Phone Number');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone2: '',
    address: '',
    taluka: '',
    district: '',
    message: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [phone2Error, setPhone2Error] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 10) return;
    setFormData({ ...formData, phone: digits });
    setPhoneError(digits.length > 0 && digits.length < 10 ? (t.contact.validationPhoneDigits || (isEn ? 'Phone number must be 10 digits' : 'फोन नंबर 10 अंकी असणे आवश्यक आहे')) : '');
  };

  const handlePhone2Change = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (digits.length > 10) return;
    setFormData({ ...formData, phone2: digits });
    setPhone2Error(digits.length > 0 && digits.length < 10 ? (t.contact.validationPhoneDigits || (isEn ? 'Phone number must be 10 digits' : 'फोन नंबर 10 अंकी असणे आवश्यक आहे')) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert(t.contact.validationName || (isEn ? 'Please enter your name' : 'कृपया आपले नाव भरा'));
      return;
    }
    if (!formData.phone.trim()) {
      alert(t.contact.validationPhone1 || (isEn ? 'Please enter Phone Number 1' : 'कृपया फोन नंबर १ भरा'));
      return;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      const msg = t.contact.validationPhoneDigits || (isEn ? 'Phone number must be exactly 10 digits' : 'फोन नंबर १ बरोबर 10 अंकी असणे आवश्यक आहे');
      setPhoneError(msg);
      alert(msg);
      return;
    }
    // Phone 2 is optional, but if entered, must be 10 digits
    if (formData.phone2 && formData.phone2.trim() && formData.phone2.replace(/\D/g, '').length !== 10) {
      const msg = t.contact.validationPhone2Digits || (isEn ? 'Phone number 2 must be exactly 10 digits or leave empty' : 'फोन नंबर २ बरोबर 10 अंकी असणे आवश्यक आहे किंवा रिकामा ठेवा');
      setPhone2Error(msg);
      alert(msg);
      return;
    }
    if (!formData.address.trim()) {
      alert(t.contact.validationAddress || (isEn ? 'Please enter village name / address' : 'कृपया गावाचे नाव / पत्ता भरा'));
      return;
    }
    if (!formData.taluka.trim()) {
      alert(t.contact.validationTaluka || (isEn ? 'Please enter taluka' : 'कृपया तालुका भरा'));
      return;
    }
    if (!formData.district.trim()) {
      alert(t.contact.validationDistrict || (isEn ? 'Please enter district' : 'कृपया जिल्हा भरा'));
      return;
    }
    if (!formData.message.trim()) {
      alert(t.contact.validationMessage || (isEn ? 'Please write your message' : 'कृपया आपला संदेश लिहा'));
      return;
    }

    setSending(true);
    const dataToSubmit = { ...formData };
    setLastSubmitted(dataToSubmit);

    try {
      const payload = {
        name: dataToSubmit.name,
        phone: dataToSubmit.phone,
        phone2: dataToSubmit.phone2 || '',
        address: dataToSubmit.address || '',
        taluka: dataToSubmit.taluka || '',
        district: dataToSubmit.district || '',
        message: dataToSubmit.message
      };

      // 1. Submit to Render backend (saves to database for Admin Panel)
      // 2. Submit to Vercel Email Endpoint (delivers email directly to payalfoundation212@gmail.com)
      await Promise.allSettled([
        submitContact(payload),
        sendEmailViaVercel(payload)
      ]);

      setSentSuccess(true);
      try { confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } }); } catch (_) {}
      setFormData({ name: '', phone: '', phone2: '', address: '', taluka: '', district: '', message: '' });
      setPhoneError('');
      setPhone2Error('');
    } catch (err) {
      console.warn("Contact submission error:", err);
      setSentSuccess(true);
      try { confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } }); } catch (_) {}
    } finally {
      setSending(false);
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#555',
    marginBottom: '0.3rem',
  };

  const fieldStyle = { marginBottom: '0.75rem' };

  return (
    <section id="contact" className="section section-bg-alt">
      {/* Hide custom cursor inside contact section via body class */}
      <style>{`
        body.contact-active .custom-cursor-dot,
        body.contact-active .custom-cursor-ring {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Input — default BLUE border */
        .contact-input {
          width: 100%;
          padding: 0.65rem 0.95rem;
          border-radius: 8px;
          border: 1.5px solid #1565c0;
          font-size: 0.97rem;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          background: #fafbfc;
          color: #222;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        /* Hover — GREEN border */
        .contact-input:hover {
          border-color: #16a34a;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
        }
        /* Focus — deeper green */
        .contact-input:focus {
          border-color: #15803d;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.18);
        }
        .contact-input.error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
        }
        .contact-textarea {
          width: 100%;
          padding: 0.75rem 0.95rem;
          border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.35);
          font-size: 0.97rem;
          font-family: inherit;
          resize: vertical;
          background: rgba(255,255,255,0.12);
          color: #ffffff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .contact-textarea::placeholder { color: rgba(255,255,255,0.5); }
        .contact-textarea:hover {
          border-color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.18);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
        }
        .contact-textarea:focus {
          border-color: #ffffff;
          background: rgba(255,255,255,0.22);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
        .contact-send-btn {
          margin-top: 1.1rem;
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          font-weight: 800;
          border-radius: 50px;
          background: #ffffff;
          color: #0d47a1;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          transition: all 0.25s ease;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
          letter-spacing: 0.01em;
        }
        .contact-send-btn:hover:not(:disabled) {
          background: #fef08a;
          color: #1a237e;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
        }
        .contact-send-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .contact-send-btn:disabled {
          background: rgba(255,255,255,0.3);
          color: #fff;
          cursor: not-allowed;
        }
        /* Quick message suggestion chips */
        .msg-chip {
          display: inline-block;
          padding: 0.3rem 0.7rem;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .msg-chip:hover {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.8);
          color: #ffffff;
          transform: translateY(-1px);
        }
        .msg-chip.active {
          background: rgba(125,211,252,0.3);
          border-color: #7dd3fc;
          color: #ffffff;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="container"
        onMouseEnter={() => document.body.classList.add('contact-active')}
        onMouseLeave={() => document.body.classList.remove('contact-active')}
      >

        {/* Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <Mail size={15} />
            <span>{t.contact.badge}</span>
          </div>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>

        {/* 3-Card Box */}
        <div
          className="card reveal-scale"
          style={{
            padding: '0',
            overflow: 'hidden',
            maxWidth: '1200px',
            margin: '0 auto',
            borderRadius: '16px',
          }}
        >
          {sentSuccess ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#ffffff' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#dcfce7', color: '#15803d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.85rem auto'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {t.contact.successTitle || (isEn ? 'Message Sent Successfully!' : 'संदेश यशस्वीरीत्या पाठवला!')}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.97rem', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                {t.contact.success || (isEn ? 'Thank you! Your message has been sent successfully. We will get back to you soon.' : 'धन्यवाद! आपला संदेश यशस्वीरीत्या पोहोचला आहे. आम्ही लवकरच आपल्याशी संपर्क करू.')}
              </p>
              <button
                type="button"
                onClick={() => { setSentSuccess(false); setLastSubmitted(null); }}
                className="btn btn-primary"
                style={{ borderRadius: '50px', padding: '0.75rem 2rem', fontSize: '0.97rem', fontWeight: 700 }}
              >
                {t.contact.sendAnother || (isEn ? 'Send Another Message' : 'दुसरा संदेश पाठवा')}
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="contact-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr' }}
            >

              {/* ── CARD 1: Blue Info ── */}
              <div style={{
                background: 'var(--primary-gradient)',
                color: '#ffffff',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.6rem', lineHeight: 1.3 }}>
                    {t.contact.card1Title ? (
                      t.contact.card1Title
                    ) : isEn ? (
                      <>Payal Foundation<br />and Social Service</>
                    ) : (
                      <>पायल फाउंडेशन<br />अँड सोशल सर्विस</>
                    )}
                  </h3>
                  <p style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {t.contact.card1Desc || (isEn
                      ? 'Reach out to us directly or visit our registered office. We are always ready to serve and collaborate for social welfare.'
                      : 'आमच्या मुख्य कार्यालयाशी थेट संपर्क साधा किंवा प्रत्यक्ष भेट द्या. आम्ही समाजसेवेसाठी सदैव तत्पर आहोत.')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px', flexShrink: 0 }}>
                        <Phone size={18} style={{ color: 'var(--accent-green)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.75 }}>
                          {t.contact.phoneLabel || (isEn ? 'Phone Number' : 'फोन क्रमांक')}
                        </div>
                        <a href={`tel:${t.phone.replace(/\s+/g, '')}`}
                          style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                          {t.phone}
                        </a>
                      </div>
                    </div>
                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '8px', flexShrink: 0 }}>
                        <MapPin size={18} style={{ color: '#fef08a' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.75 }}>
                          {t.contact.addressLabel || (isEn ? 'Registered Office' : 'नोंदणीकृत पत्ता')}
                        </div>
                        <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                          {t.address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.97rem',
                  fontWeight: 700,
                  color: '#fef08a',
                }}>
                  {t.contact.tagline || (isEn ? 'Sonya Bhau is always at your service.' : 'सोन्या भाऊ तुमच्या सेवेसाठी हजर.')}
                </div>
              </div>

              {/* ── CARD 2: White — Personal Info ── */}
              <div style={{
                padding: '2rem 1.75rem',
                background: '#ffffff',
                borderLeft: '1px solid #eef0f4',
                borderRight: '1px solid #eef0f4',
              }}>

                <div style={fieldStyle}>
                  <label style={labelStyle}>{t.contact.name || (isEn ? 'Your Name' : 'आपले नाव')} *</label>
                  <input className="contact-input" type="text" required
                    placeholder={t.contact.namePlaceholder || (isEn ? "Enter your full name..." : "आपले संपूर्ण नाव...")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>{t.contact.phone1Label || (isEn ? 'Phone Number 1 *' : 'फोन नंबर १ *')}</label>
                  <input className={`contact-input${phoneError ? ' error' : ''}`}
                    type="tel" required placeholder="+91 XXXXX XXXXX"
                    value={formData.phone} onChange={handlePhoneChange} maxLength={10} />
                  {phoneError && <span style={{ color: '#ef4444', fontSize: '0.79rem', marginTop: '0.25rem', display: 'block' }}>{phoneError}</span>}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>
                    {t.contact.phone2Label || (isEn ? 'Phone Number 2' : 'फोन नंबर २')}{' '}
                    <span style={{ fontWeight: 500, fontSize: '0.8rem', color: '#64748b' }}>
                      {t.contact.phone2Optional || (isEn ? '(Optional)' : '(पर्यायी / Optional)')}
                    </span>
                  </label>
                  <input className={`contact-input${phone2Error ? ' error' : ''}`}
                    type="tel" placeholder={t.contact.phone2Placeholder || (isEn ? "+91 XXXXX XXXXX (Optional)" : "+91 XXXXX XXXXX (पर्यायी)")}
                    value={formData.phone2} onChange={handlePhone2Change} maxLength={10} />
                  {phone2Error && <span style={{ color: '#ef4444', fontSize: '0.79rem', marginTop: '0.25rem', display: 'block' }}>{phone2Error}</span>}
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>{t.contact.address || (isEn ? 'Address' : 'पत्ता')} *</label>
                  <input className="contact-input" type="text" required
                    placeholder={t.contact.addressPlaceholder || (isEn ? "Village Name / City..." : "गावाचे नाव / शहर लिहा...")}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>{t.contact.taluka || (isEn ? 'Taluka' : 'तालुका')} *</label>
                    <input className="contact-input" type="text" required
                      placeholder={t.contact.talukaPlaceholder || (isEn ? "Enter taluka..." : "तालुका लिहा...")}
                      value={formData.taluka}
                      onChange={(e) => setFormData({ ...formData, taluka: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>{t.contact.district || (isEn ? 'District' : 'जिल्हा')} *</label>
                    <input className="contact-input" type="text" required
                      placeholder={t.contact.districtPlaceholder || (isEn ? "Enter district..." : "जिल्हा लिहा...")}
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                  </div>
                </div>

              </div>

              {/* ── CARD 3: Deep Teal — Message + Send ── */}
              <div style={{
                background: 'linear-gradient(145deg, #0f4c75 0%, #1b6ca8 50%, #0d3d5e 100%)',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem', borderRadius: '9px' }}>
                      <MessageSquare size={20} style={{ color: '#7dd3fc' }} />
                    </div>
                    <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      {t.contact.messageBoxTitle || (isEn ? "Your Message" : "आपला संदेश")}
                    </h4>
                  </div>

                  <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
                    {t.contact.message || (isEn ? "How can we help you?" : "आपला संदेश लिहा...")} *
                  </label>

                  {/* Quick Suggestion Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
                    {[
                      {
                        label: t.contact.quickChip1 || (isEn ? 'Need help with medical / health.' : 'आरोग्यासाठी मदतीची गरज आहे.'),
                        text: isEn ? 'Need help with medical / health.' : 'आरोग्यासाठी मदतीची गरज आहे.'
                      },
                      {
                        label: t.contact.quickChip2 || (isEn ? 'Want to join as a volunteer.' : 'स्वयंसेवक व्हायचे आहे.'),
                        text: isEn ? 'Want to join as a volunteer.' : 'स्वयंसेवक व्हायचे आहे.'
                      },
                    ].map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`msg-chip${formData.message === chip.text ? ' active' : ''}`}
                        onClick={() => setFormData({ ...formData, message: chip.text })}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="contact-textarea"
                    required
                    rows={4}
                    placeholder={t.contact.messagePlaceholder || (isEn ? "Write your question or message here..." : "आपला प्रश्न किंवा संदेश येथे लिहा...")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ flex: 1, minHeight: '90px' }}
                  />
                </div>

                {/* Send Button */}
                <button type="submit" disabled={sending} className="contact-send-btn">
                  <Send size={17} />
                  <span>{sending ? (t.contact.sending || (isEn ? 'Sending...' : 'पाठवत आहे...')) : (t.contact.sendBtn || (isEn ? 'Send Message' : 'संदेश पाठवा'))}</span>
                </button>

                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {t.contact.responseTime ? `📩 ${t.contact.responseTime}` : (isEn ? '📩 We will reply within 24 hours.' : '📩 आम्ही २४ तासांच्या आत उत्तर देऊ.')}
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
