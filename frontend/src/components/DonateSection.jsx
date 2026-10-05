import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Smartphone, Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function DonateSection({ t, trustInfo }) {
  const [copiedField, setCopiedField] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const upiId = trustInfo?.upi_id || '7776876121@ybl';
  const orgName = trustInfo?.name || 'Payal Foundation and Social Service';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // UPI QR String (Open amount so donors can send ₹1 or any amount directly)
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(orgName)}&cu=INR`;

  // Generate QR code locally and instantly (no external API dependence)
  useEffect(() => {
    QRCode.toDataURL(upiDeepLink, {
      width: 400,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR Code:', err));
  }, [upiDeepLink]);

  // Fast, instant branded scanner download using local canvas
  const handleDownloadScanner = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 840;
      const ctx = canvas.getContext('2d');

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 720, 840);

      // 2. Header gradient
      const gradient = ctx.createLinearGradient(0, 0, 720, 180);
      gradient.addColorStop(0, '#0b62a4');
      gradient.addColorStop(1, '#1e40af');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 720, 180);

      // 3. Header text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText('PAYAL FOUNDATION SCANNER', 360, 56);

      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(orgName, 360, 108);

      ctx.font = '16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#86efac';
      ctx.fillText('✓ अधिकृत धर्मादाय सामाजिक संस्था', 360, 148);

      // 4. Quote banner
      ctx.fillStyle = '#fff7ed';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(45, 205, 630, 60, 14);
        ctx.fill();
      } else {
        ctx.fillRect(45, 205, 630, 60);
      }
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#c2410c';
      ctx.font = 'bold 23px system-ui, -apple-system, sans-serif';
      ctx.fillText('❝ तुमची १ रुपयाची मदत पण १ जीवन वाचवू शकते ❞', 360, 243);

      // 5. Generate high-res QR code on an offscreen canvas
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, upiDeepLink, {
        width: 380,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // QR Code container box
      ctx.fillStyle = '#ffffff';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(155, 290, 410, 410, 20);
        ctx.fill();
      } else {
        ctx.fillRect(155, 290, 410, 410);
      }
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corner scan accents
      ctx.strokeStyle = '#0b62a4';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(155, 330); ctx.lineTo(155, 290); ctx.lineTo(195, 290); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(525, 290); ctx.lineTo(565, 290); ctx.lineTo(565, 330); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(155, 660); ctx.lineTo(155, 700); ctx.lineTo(195, 700); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(525, 700); ctx.lineTo(565, 700); ctx.lineTo(565, 660); ctx.stroke();

      ctx.drawImage(qrCanvas, 170, 305, 380, 380);

      // 6. UPI ID Pill Box
      ctx.fillStyle = '#f8fafc';
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath();
        ctx.roundRect(130, 725, 460, 50, 25);
        ctx.fill();
      } else {
        ctx.fillRect(130, 725, 460, 50);
      }
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 21px system-ui, -apple-system, sans-serif';
      ctx.fillText(`UPI ID: ${upiId}`, 360, 757);

      // Instant download via Data URL
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'payal-foundation-qr-scanner.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Instant download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="donate" className="section section-bg-alt" style={{ padding: '4.5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            {t.donate?.title || 'Payal Foundation Scanner'}
          </h2>

          {/* Special Marathi Quote Banner with Slow Gentle Pulse */}
          <div className="slow-pulse" style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '2px solid #fdba74',
            padding: '0.7rem clamp(0.85rem, 3vw, 1.75rem)',
            borderRadius: '9999px',
            marginTop: '0.5rem',
            marginBottom: '0.75rem',
            maxWidth: '100%'
          }}>
            <Sparkles size={18} color="#ea580c" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: 'clamp(0.92rem, 3.2vw, 1.25rem)',
              fontWeight: 800,
              color: '#9a3412',
              letterSpacing: '0.01em',
              textAlign: 'center'
            }}>
              "तुमची १ रुपयाची मदत पण १ जीवन वाचवू शकते"
            </span>
            <Sparkles size={18} color="#ea580c" style={{ flexShrink: 0 }} />
          </div>

          <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0.8rem auto 0 auto', fontSize: '1.02rem' }}>
            {t.donate?.subtitle || 'समाजातील गरजू आणि अडचणीत असणाऱ्या बांधवांना मदतीचा हात देण्यासाठी थेट UPI स्कॅनरद्वारे सहकार्य करा.'}
          </p>
        </div>

        {/* Centered Payal Foundation Scanner Card with Slow Breathing Movement */}
        <div className="reveal-scale slow-breathe" style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 45px -10px rgba(11, 98, 164, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          
          {/* Card Top Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #0b62a4 0%, #1e40af 100%)',
            padding: '1.5rem 1.5rem',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0', color: '#ffffff' }}>
              {orgName}
            </h3>
          </div>

          {/* Card Body */}
          <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem) clamp(0.85rem, 3.5vw, 1.75rem)', textAlign: 'center' }}>

            {/* QR Code Container with Stylized Camera Scan Frame */}
            <div style={{
              position: 'relative',
              display: 'inline-block',
              padding: 'clamp(0.75rem, 3vw, 1.25rem)',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e2e8f0',
              marginBottom: '1.25rem',
              maxWidth: '100%'
            }}>
              {/* Corner scan brackets */}
              <div style={{ position: 'absolute', top: '6px', left: '6px', width: '20px', height: '20px', borderTop: '3.5px solid #0b62a4', borderLeft: '3.5px solid #0b62a4', borderTopLeftRadius: '6px' }} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderTop: '3.5px solid #0b62a4', borderRight: '3.5px solid #0b62a4', borderTopRightRadius: '6px' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '20px', height: '20px', borderBottom: '3.5px solid #0b62a4', borderLeft: '3.5px solid #0b62a4', borderBottomLeftRadius: '6px' }} />
              <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '20px', height: '20px', borderBottom: '3.5px solid #0b62a4', borderRight: '3.5px solid #0b62a4', borderBottomRightRadius: '6px' }} />

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Payal Foundation Scanner QR Code"
                  style={{
                    width: 'clamp(180px, 55vw, 230px)',
                    height: 'clamp(180px, 55vw, 230px)',
                    display: 'block',
                    borderRadius: '10px',
                    margin: '0 auto'
                  }}
                />
              ) : (
                <div style={{
                  width: 'clamp(180px, 55vw, 230px)',
                  height: 'clamp(180px, 55vw, 230px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '0.9rem'
                }}>
                  स्कॅनर लोड होत आहे...
                </div>
              )}
            </div>

            {/* DOWNLOAD SCANNER BUTTON */}
            <div style={{ maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
              <button
                type="button"
                className="shimmer-btn"
                onClick={handleDownloadScanner}
                disabled={isDownloading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  borderRadius: '14px',
                  background: downloadSuccess 
                    ? '#16a34a' 
                    : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)',
                  cursor: isDownloading ? 'wait' : 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {downloadSuccess ? (
                  <>
                    <Check size={20} />
                    <span>{t.donate?.downloadSuccess || 'डाउनलोड झाले! ✓'}</span>
                  </>
                ) : isDownloading ? (
                  <>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      border: '2.5px solid #ffffff',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span>{t.donate?.downloading || 'डाउनलोड होत आहे...'}</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>{t.donate?.downloadScanner || 'QR स्कॅनर डाउनलोड करा'}</span>
                  </>
                )}
              </button>
            </div>

            {/* UPI ID Copy Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              maxWidth: '420px',
              margin: '0 auto 1.25rem auto'
            }}>
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Official UPI ID
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.02rem', color: '#0f172a', wordBreak: 'break-all' }}>
                  {upiId}
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(upiId, 'upi')}
                style={{
                  background: copiedField === 'upi' ? '#16a34a' : 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {copiedField === 'upi' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedField === 'upi' ? (t.donate?.copySuccess || 'कॉपी झाले!') : (t.donate?.copyUpi || 'कॉपी करा')}</span>
              </button>
            </div>

            {/* Mobile Direct Pay Action */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <a
                href={upiDeepLink}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(11, 98, 164, 0.25)',
                  textDecoration: 'none'
                }}
              >
                <Smartphone size={18} />
                <span>{t.donate?.directUpi || 'थेट UPI ॲपद्वारे देणगी द्या (Mobile)'}</span>
              </a>
            </div>

          </div>
        </div>

        {/* Emotional Gratitude Card under Scanner */}
        <div style={{
          maxWidth: '560px',
          margin: '1.5rem auto 0 auto',
          textAlign: 'center',
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1',
          color: 'var(--text-muted)',
          fontSize: '0.88rem'
        }}>
          🙏 <strong style={{ color: 'var(--text-main)' }}>पायल फाउंडेशनतर्फे मनःपूर्वक धन्यवाद!</strong> आपल्या १ रुपयाच्या छोट्याशा मदतीमुळे सुद्धा एका गरजू बालकाला अन्न, शिक्षण किंवा रुग्णाला जीवनदान मिळू शकते.
        </div>

      </div>
    </section>
  );
}
