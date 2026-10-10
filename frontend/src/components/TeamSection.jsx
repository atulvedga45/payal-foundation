import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, Shield, Phone, Copy, Check, QrCode, X, Download, Sparkles, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

const TRUSTEE_CARD_THEMES = [
  {
    bg: 'linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)',
    border: '#bfdbfe',
    accent: '#2563eb',
    tagBg: 'rgba(37, 99, 235, 0.1)',
    tagText: '#1d4ed8',
    glow: 'rgba(37, 99, 235, 0.16)'
  },
  {
    bg: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
    border: '#fde68a',
    accent: '#d97706',
    tagBg: 'rgba(217, 119, 6, 0.12)',
    tagText: '#b45309',
    glow: 'rgba(217, 119, 6, 0.16)'
  },
  {
    bg: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
    border: '#bbf7d0',
    accent: '#16a34a',
    tagBg: 'rgba(22, 163, 74, 0.12)',
    tagText: '#15803d',
    glow: 'rgba(22, 163, 74, 0.16)'
  },
  {
    bg: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
    border: '#e9d5ff',
    accent: '#9333ea',
    tagBg: 'rgba(147, 51, 234, 0.12)',
    tagText: '#7e22ce',
    glow: 'rgba(147, 51, 234, 0.16)'
  },
  {
    bg: 'linear-gradient(180deg, #fff1f2 0%, #ffffff 100%)',
    border: '#fecdd3',
    accent: '#e11d48',
    tagBg: 'rgba(225, 29, 72, 0.12)',
    tagText: '#be123c',
    glow: 'rgba(225, 29, 72, 0.16)'
  },
  {
    bg: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)',
    border: '#a5f3fc',
    accent: '#0891b2',
    tagBg: 'rgba(8, 145, 178, 0.12)',
    tagText: '#0e7490',
    glow: 'rgba(8, 145, 178, 0.16)'
  }
];

export default function TeamSection({ t, trustees, lang, trustInfo }) {
  const [selectedTrustee, setSelectedTrustee] = useState(null);
  const [modalQrUrl, setModalQrUrl] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Keep strictly 6 trustees (3 per row)
  const displayTrustees = (trustees && trustees.length > 0 ? trustees : []).slice(0, 6);

  const defaultUpi = trustInfo?.upi_id || 'payalfoundation@ybl';
  const orgName = trustInfo?.name || 'Payal Foundation and Social Service';

  // Generate QR code whenever a trustee is selected
  useEffect(() => {
    if (!selectedTrustee) {
      setModalQrUrl('');
      return;
    }

    // If trustee already has custom QR image URL, we can use it
    if (selectedTrustee.upi_qr_url) {
      setModalQrUrl(selectedTrustee.upi_qr_url);
      return;
    }

    const upiId = selectedTrustee.upi_id || defaultUpi;
    const payeeName = selectedTrustee.name || orgName;
    const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&cu=INR`;

    QRCode.toDataURL(upiDeepLink, {
      width: 420,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setModalQrUrl(url))
      .catch(err => {
        console.error('Failed to generate Trustee UPI QR:', err);
      });
  }, [selectedTrustee, defaultUpi, orgName]);

  // Handle escape key to close modal & toggle .modal-open on body
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedTrustee(null);
    };
    if (selectedTrustee) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTrustee]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (_) {}
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleDownloadQr = () => {
    if (!modalQrUrl) return;
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = modalQrUrl;
    link.download = `${(selectedTrustee?.name || 'trustee').toLowerCase().replace(/\s+/g, '_')}_upi_scanner.png`;
    link.click();
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (_) {}
    setTimeout(() => setIsDownloading(false), 800);
  };

  return (
    <section id="team" className="section section-bg-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal">
          <h2 className="section-title">{t.team.title}</h2>
          <p className="section-subtitle">{t.team.subtitle}</p>
        </div>

        {/* 3 Columns Grid (Exactly 3 per line, 6 cards total) */}
        <div className="trustees-grid">
          {displayTrustees.map((member, idx) => {
            const displayName = member.name || 'Sonya Oghe';
            const photoSrc = member.photo_url || '/sonya.jpg';
            const phoneNumber = member.phone || '1234567890';
            const hasPhoto = Boolean(photoSrc);
            const theme = TRUSTEE_CARD_THEMES[idx % TRUSTEE_CARD_THEMES.length];

            return (
              <div
                key={member.id || idx}
                className={`trustee-card reveal stagger-${(idx % 3) + 1}`}
                onClick={() => setSelectedTrustee(member)}
                role="button"
                tabIndex={0}
                style={{
                  background: theme.bg,
                  borderColor: theme.border,
                  borderTop: `4px solid ${theme.accent}`,
                  boxShadow: `0 4px 18px ${theme.glow}`
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTrustee(member);
                  }
                }}
              >
                {/* Click indicator badge at top */}
                <div
                  className="card-top-tag"
                  style={{
                    background: theme.tagBg,
                    color: theme.tagText
                  }}
                >
                  <QrCode size={13} />
                  <span>UPI QR & Info</span>
                </div>

                {/* Avatar Icon / Profile Photo */}
                <div className={`trustee-avatar ${hasPhoto ? 'has-photo' : ''}`}>
                  {hasPhoto ? (
                    <img
                      src={photoSrc}
                      alt={displayName}
                      className="trustee-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackIcon = e.target.parentElement.querySelector('.trustee-fallback-icon');
                        if (fallbackIcon) fallbackIcon.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <UserCheck
                    size={52}
                    color="#ffffff"
                    strokeWidth={2.2}
                    className="trustee-fallback-icon"
                    style={{ display: hasPhoto ? 'none' : 'block' }}
                  />
                </div>

                {/* Name */}
                <h3 className="trustee-name">
                  {displayName}
                </h3>

                {/* Phone Preview */}
                <div className="trustee-phone-pill">
                  <Phone size={14} />
                  <span>{phoneNumber}</span>
                </div>

                {/* Open details CTA */}
                <div className="trustee-click-hint">
                  <span>{lang === 'mr' ? 'QR स्कॅनर व माहिती उघडा' : 'Click to Open QR & Details'}</span>
                  <ExternalLink size={15} />
                </div>

                {/* Organization Label */}
                <div className="trustee-org">
                  Payal Foundation and Social Service
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Trustee Detail & UPI Scanner Modal Portaled to document.body */}
      {selectedTrustee && createPortal(
        <div
          className="trustee-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTrustee(null);
          }}
        >
          <div className="trustee-modal-card">
            {/* Close Button */}
            <button
              className="trustee-modal-close"
              onClick={() => setSelectedTrustee(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Body */}
            <div className="trustee-modal-body">
              {/* Header with Photo/Logo & Name */}
              <div className="trustee-modal-profile">
                <div className="modal-avatar-container">
                  <img
                    src={selectedTrustee.photo_url || '/sonya.jpg'}
                    alt={selectedTrustee.name || 'Trustee'}
                    className="modal-avatar-img"
                    onError={(e) => {
                      e.target.src = '/sonya.jpg';
                    }}
                  />
                  <div className="modal-avatar-badge">
                    <Shield size={16} color="#ffffff" />
                  </div>
                </div>

                <div className="modal-profile-text">
                  <h3 className="modal-trustee-name">{selectedTrustee.name || 'Sonya Oghe'}</h3>
                  <p className="modal-org-title">
                    {lang === 'mr'
                      ? 'पायल फाउंडेशन अँड सोशल सर्व्हिस'
                      : 'Payal Foundation and Social Service'}
                  </p>
                </div>
              </div>

              {/* Mobile Number Box */}
              <div className="trustee-contact-card">
                <div className="contact-card-left">
                  <div className="contact-icon-circle">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="contact-label">
                      {lang === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
                    </div>
                    <div className="contact-val">
                      {selectedTrustee.phone || '1234567890'}
                    </div>
                  </div>
                </div>
                <div className="contact-actions">
                  <a
                    href={`tel:${selectedTrustee.phone || '1234567890'}`}
                    className="btn-contact-action btn-call"
                  >
                    <Phone size={14} />
                    <span>{lang === 'mr' ? 'कॉल करा' : 'Call'}</span>
                  </a>
                  <button
                    className="btn-contact-action btn-copy"
                    onClick={() => copyToClipboard(selectedTrustee.phone || '1234567890', 'phone')}
                  >
                    {copiedField === 'phone' ? (
                      <>
                        <Check size={14} color="#16a34a" />
                        <span style={{ color: '#16a34a' }}>{lang === 'mr' ? 'कॉपी झाले!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>{lang === 'mr' ? 'कॉपी' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* UPI Scanner Section */}
              <div className="trustee-scanner-section">
                {/* QR Code Container with Scanner Frame */}
                <div className="qr-scanner-box">
                  <div className="scanner-frame-corner top-left"></div>
                  <div className="scanner-frame-corner top-right"></div>
                  <div className="scanner-frame-corner bottom-left"></div>
                  <div className="scanner-frame-corner bottom-right"></div>
                  <div className="scanner-laser-line"></div>

                  <div className="qr-image-wrapper">
                    {modalQrUrl ? (
                      <img
                        src={modalQrUrl}
                        alt={`UPI QR Scanner for ${selectedTrustee.name}`}
                        className="modal-qr-img"
                      />
                    ) : (
                      <div className="qr-loading-box">
                        <QrCode size={48} className="qr-pulse-icon" />
                        <span>Generating Scanner...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UPI ID Pill */}
                <div className="upi-id-pill">
                  <span className="upi-id-label">UPI ID:</span>
                  <span className="upi-id-value">{selectedTrustee.upi_id || defaultUpi}</span>
                  <button
                    className="upi-copy-btn"
                    onClick={() => copyToClipboard(selectedTrustee.upi_id || defaultUpi, 'upi')}
                    title="Copy UPI ID"
                  >
                    {copiedField === 'upi' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Scanner Actions (Download & Pay App) */}
                <div className="scanner-actions-grid">
                  <a
                    href={`upi://pay?pa=${encodeURIComponent(selectedTrustee.upi_id || defaultUpi)}&pn=${encodeURIComponent(selectedTrustee.name || orgName)}&cu=INR`}
                    className="btn btn-primary btn-scanner-pay"
                  >
                    <QrCode size={16} />
                    <span>{lang === 'mr' ? 'UPI ॲपद्वारे पैसे पाठवा' : 'Pay via UPI App'}</span>
                  </a>

                  <button
                    className="btn btn-outline btn-scanner-download"
                    onClick={handleDownloadQr}
                    disabled={isDownloading || !modalQrUrl}
                  >
                    <Download size={16} />
                    <span>
                      {isDownloading
                        ? (lang === 'mr' ? 'डाउनलोड होत आहे...' : 'Downloading...')
                        : (lang === 'mr' ? 'स्कॅनर डाउनलोड करा' : 'Download Scanner')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Scoped CSS for 3-per-line Grid, Hover Effects, & Modal */}
      <style>{`
        .trustees-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 980px) {
          .trustees-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.4rem;
          }
        }

        @media (max-width: 620px) {
          .trustees-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .trustee-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          border-top: 4px solid var(--primary);
          padding: 2.35rem 1.4rem 1.85rem 1.4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
        }

        .trustee-card.in-view {
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .card-top-tag {
          position: absolute;
          top: 0.75rem;
          right: 0.85rem;
          background: rgba(11, 98, 164, 0.08);
          color: var(--primary);
          padding: 0.26rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.25s ease;
        }

        /* Hover Effect: Elevation, border glow and smooth scale */
        .trustee-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px -8px rgba(11, 98, 164, 0.22), 0 8px 16px -4px rgba(0, 0, 0, 0.05);
          border-color: rgba(11, 98, 164, 0.45);
          border-top-color: #0b62a4;
        }

        .trustee-card:hover .card-top-tag {
          background: var(--primary);
          color: #ffffff;
        }

        .trustee-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0b62a4 0%, #1e40af 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 10px 24px rgba(11, 98, 164, 0.32);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
          overflow: hidden;
          position: relative;
        }

        .trustee-avatar.has-photo {
          border: 4px solid #ffffff;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
          background: #e2e8f0;
        }

        .trustee-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 10%;
          border-radius: 50%;
          transform: scale(1.18);
          display: block;
        }

        .trustee-card:hover .trustee-avatar {
          transform: scale(1.08) rotate(1deg);
          box-shadow: 0 14px 30px rgba(11, 98, 164, 0.45);
        }

        .trustee-name {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.55rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .trustee-card:hover .trustee-name {
          color: var(--primary);
        }

        .trustee-phone-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.85);
          padding: 0.35rem 0.95rem;
          border-radius: 9999px;
          margin-bottom: 0.95rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .trustee-click-hint {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.94rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(11, 98, 164, 0.08);
          border: 1px solid rgba(11, 98, 164, 0.2);
          padding: 0.55rem 1.25rem;
          border-radius: 9999px;
          transition: all 0.25s ease;
          margin-top: 0.25rem;
          box-shadow: 0 2px 8px rgba(11, 98, 164, 0.08);
        }

        .trustee-card:hover .trustee-click-hint {
          background: var(--primary);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(11, 98, 164, 0.28);
        }

        .trustee-org {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.85rem;
          font-weight: 500;
        }

        /* Modal Styles */
        .trustee-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          animation: modalFadeIn 0.25s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .trustee-modal-card {
          background: #ffffff;
          border-radius: var(--radius-lg, 1.25rem);
          width: 100%;
          max-width: 560px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45);
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.15);
          animation: modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalScaleUp {
          from { transform: scale(0.92) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .trustee-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.06);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .trustee-modal-close:hover {
          background: #fee2e2;
          color: #dc2626;
          transform: rotate(90deg);
        }

        .trustee-modal-body {
          padding: 2rem 1.75rem 1.75rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .trustee-modal-profile {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .modal-avatar-container {
          position: relative;
          width: 96px;
          height: 96px;
          flex-shrink: 0;
        }

        .modal-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: center 10%;
          border: 4px solid var(--primary);
          box-shadow: 0 8px 18px rgba(11, 98, 164, 0.3);
        }

        .modal-avatar-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #16a34a;
          border: 2.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-profile-text {
          flex: 1;
        }

        .modal-trustee-name {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
          margin-bottom: 0.35rem;
        }

        .modal-org-title {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 600;
        }

        /* Contact Details Card */
        .trustee-contact-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 1rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .contact-card-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .contact-icon-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #1e40af 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(11, 98, 164, 0.25);
        }

        .contact-label {
          font-size: 0.74rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }

        .contact-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: 0.02em;
        }

        .contact-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-contact-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .btn-call {
          background: #16a34a;
          color: #ffffff;
        }

        .btn-call:hover {
          background: #15803d;
          transform: translateY(-1px);
        }

        .btn-copy {
          background: #ffffff;
          border-color: #cbd5e1;
          color: var(--text-main);
        }

        .btn-copy:hover {
          background: #f1f5f9;
        }

        /* Scanner Section */
        .trustee-scanner-section {
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1.5px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .scanner-header {
          margin-bottom: 1.15rem;
        }

        .scanner-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(11, 98, 164, 0.1);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }

        .scanner-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .scanner-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin: 0;
          max-width: 380px;
        }

        /* Realistic Camera Scanner Frame */
        .qr-scanner-box {
          position: relative;
          padding: 14px;
          background: #ffffff;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .scanner-frame-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          border-color: var(--primary);
          border-style: solid;
        }

        .scanner-frame-corner.top-left {
          top: 6px;
          left: 6px;
          border-width: 3.5px 0 0 3.5px;
          border-top-left-radius: 6px;
        }

        .scanner-frame-corner.top-right {
          top: 6px;
          right: 6px;
          border-width: 3.5px 3.5px 0 0;
          border-top-right-radius: 6px;
        }

        .scanner-frame-corner.bottom-left {
          bottom: 6px;
          left: 6px;
          border-width: 0 0 3.5px 3.5px;
          border-bottom-left-radius: 6px;
        }

        .scanner-frame-corner.bottom-right {
          bottom: 6px;
          right: 6px;
          border-width: 0 3.5px 3.5px 0;
          border-bottom-right-radius: 6px;
        }

        .scanner-laser-line {
          position: absolute;
          left: 14px;
          right: 14px;
          height: 2.5px;
          background: linear-gradient(90deg, transparent 0%, #38bdf8 50%, transparent 100%);
          box-shadow: 0 0 10px #38bdf8;
          animation: laserScan 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: 2;
        }

        @keyframes laserScan {
          0% { top: 16px; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: calc(100% - 18px); opacity: 0; }
        }

        .qr-image-wrapper {
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }

        .modal-qr-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .qr-loading-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .qr-pulse-icon {
          animation: pulse 1.5s infinite;
          color: var(--primary);
        }

        /* UPI ID Pill */
        .upi-id-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 9999px;
          padding: 0.35rem 0.85rem;
          font-size: 0.84rem;
          margin-bottom: 1.15rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        }

        .upi-id-label {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.76rem;
        }

        .upi-id-value {
          font-weight: 700;
          color: var(--text-main);
          font-family: monospace;
          letter-spacing: 0.02em;
        }

        .upi-copy-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.2rem;
          transition: color 0.2s ease;
        }

        .upi-copy-btn:hover {
          color: var(--primary);
        }

        /* Scanner Action Buttons */
        .scanner-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          width: 100%;
        }

        @media (max-width: 480px) {
          .scanner-actions-grid {
            grid-template-columns: 1fr;
          }
        }

        .btn-scanner-pay {
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          text-decoration: none;
        }

        .btn-scanner-download {
          padding: 0.65rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          background: #ffffff;
          border-color: #cbd5e1;
          color: var(--text-main);
          cursor: pointer;
        }

        .btn-scanner-download:hover {
          background: #f1f5f9;
        }

        /* Dark Mode Support */
        [data-theme="dark"] .trustee-card {
          background: #1e293b !important;
          border-color: #334155 !important;
          border-top-color: #38bdf8 !important;
        }

        [data-theme="dark"] .card-top-tag {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        [data-theme="dark"] .trustee-card:hover {
          border-color: #38bdf8 !important;
          box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.7) !important;
        }

        [data-theme="dark"] .trustee-card:hover .card-top-tag {
          background: #0284c7;
          color: #ffffff;
        }

        [data-theme="dark"] .trustee-avatar.has-photo {
          border-color: #38bdf8;
        }

        [data-theme="dark"] .trustee-name {
          color: #f8fafc !important;
        }

        [data-theme="dark"] .trustee-card:hover .trustee-name {
          color: #38bdf8 !important;
        }

        [data-theme="dark"] .trustee-badge {
          background: rgba(14, 165, 233, 0.18) !important;
          color: #38bdf8 !important;
          border-color: rgba(56, 189, 248, 0.35) !important;
        }

        [data-theme="dark"] .trustee-card:hover .trustee-badge {
          background: #0284c7 !important;
          color: #ffffff !important;
        }

        [data-theme="dark"] .trustee-phone-pill {
          background: rgba(255, 255, 255, 0.06);
          color: #cbd5e1;
          border-color: #475569;
        }

        [data-theme="dark"] .trustee-click-hint {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        [data-theme="dark"] .trustee-card:hover .trustee-click-hint {
          background: #0284c7;
          color: #ffffff;
        }

        [data-theme="dark"] .trustee-org {
          color: #94a3b8 !important;
        }

        [data-theme="dark"] .trustee-modal-card {
          background: #0f172a;
          border-color: #334155;
        }

        [data-theme="dark"] .trustee-modal-close {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
        }

        [data-theme="dark"] .trustee-modal-profile {
          border-color: #1e293b;
        }

        [data-theme="dark"] .modal-trustee-name {
          color: #f8fafc;
        }

        [data-theme="dark"] .modal-role-pill {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }

        [data-theme="dark"] .modal-org-title {
          color: #94a3b8;
        }

        [data-theme="dark"] .trustee-contact-card {
          background: #1e293b;
          border-color: #334155;
        }

        [data-theme="dark"] .contact-val {
          color: #f8fafc;
        }

        [data-theme="dark"] .contact-label {
          color: #94a3b8;
        }

        [data-theme="dark"] .btn-copy {
          background: #334155;
          border-color: #475569;
          color: #f8fafc;
        }

        [data-theme="dark"] .trustee-scanner-section {
          background: #1e293b;
          border-color: #334155;
        }

        [data-theme="dark"] .scanner-badge {
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }

        [data-theme="dark"] .scanner-title {
          color: #f8fafc;
        }

        [data-theme="dark"] .scanner-subtitle {
          color: #94a3b8;
        }

        [data-theme="dark"] .upi-id-pill {
          background: #0f172a;
          border-color: #334155;
        }

        [data-theme="dark"] .upi-id-value {
          color: #38bdf8;
        }

        [data-theme="dark"] .btn-scanner-download {
          background: #334155;
          border-color: #475569;
          color: #f8fafc;
        }
      `}</style>
    </section>
  );
}
