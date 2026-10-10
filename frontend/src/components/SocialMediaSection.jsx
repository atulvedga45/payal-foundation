import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  Sparkles,
  ArrowUpRight,
  Heart
} from 'lucide-react';

export default function SocialMediaSection({ t, lang }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const platforms = [
    {
      id: 'instagram',
      name: t.social?.platforms?.instagram?.name || 'Instagram',
      handle: '@its_sonyaa1113',
      tag: lang === 'mr' ? 'छायाचित्रे व रील्स' : 'Photos & Reels',
      desc: lang === 'mr' ? 'दैनंदिन व्हिडिओ, ग्राउंड रील्स आणि सेवाकार्याचे फोटो पाहण्यासाठी इन्स्टाग्रामवर फॉलो करा.' : 'Watch daily video stories, ground relief reels, and photo highlights of our field missions.',
      btnText: t.social?.platforms?.instagram?.btnText || 'Follow on Instagram',
      url: 'https://www.instagram.com/its_sonyaa1113/?hl=en',
      stats: 'Follow Us',
      stats_mr: 'फॉलो करा',
      gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      accentColor: '#e1306c',
      glowColor: 'rgba(225, 48, 108, 0.35)',
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      id: 'facebook',
      name: t.social?.platforms?.facebook?.name || 'Facebook',
      handle: 'Payal Foundation',
      tag: lang === 'mr' ? 'कम्युनिटी व लाईव्ह' : 'Community & Events',
      desc: lang === 'mr' ? 'फेसबुक पेजवर लाईव्ह उपक्रम, मदत मोहिमांचे अपडेट्स आणि जनकल्याणकारी पोस्ट्स मिळवा.' : 'Join our official Facebook page for live updates, community announcements, and social discussions.',
      btnText: t.social?.platforms?.facebook?.btnText || 'Connect on Facebook',
      url: 'https://www.facebook.com/share/1BttVwMWrV/',
      stats: 'Connect',
      stats_mr: 'कनेक्ट व्हा',
      gradient: 'linear-gradient(135deg, #1877F2 0%, #0d5cb6 100%)',
      accentColor: '#1877F2',
      glowColor: 'rgba(24, 119, 242, 0.35)',
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      id: 'whatsapp',
      name: t.social?.platforms?.whatsapp?.name || 'WhatsApp',
      handle: '+91 92252 43552',
      tag: lang === 'mr' ? 'थेट मदत व सेवा' : 'Direct Helpline & Chat',
      desc: lang === 'mr' ? 'थेट मदत मागण्यासाठी किंवा सेवाकार्यात सहभागी होण्यासाठी व्हॉट्सॲपवर संपर्क करा.' : 'Reach out directly for assistance, immediate help, or joining our official seva broadcasts.',
      btnText: t.social?.platforms?.whatsapp?.btnText || 'Chat on WhatsApp',
      url: 'https://wa.me/919225243552',
      stats: '9225243552',
      stats_mr: '९२२५२४३५५२',
      gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      accentColor: '#25D366',
      glowColor: 'rgba(37, 211, 102, 0.35)',
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.84C8.94 6.84 8.78 6.84 8.64 6.84C8.5 6.84 8.28 6.9 8.1 7.1C7.91 7.3 7.37 7.81 7.37 8.86C7.37 9.91 8.14 10.93 8.25 11.07C8.36 11.21 9.73 13.33 11.83 14.24C12.33 14.45 12.72 14.58 13.02 14.68C13.52 14.84 13.98 14.81 14.34 14.76C14.74 14.7 15.57 14.26 15.74 13.77C15.91 13.29 15.91 12.87 15.86 12.79C15.81 12.71 15.67 12.66 15.46 12.55C15.25 12.45 14.21 11.94 14.02 11.87C13.82 11.8 13.68 11.77 13.54 11.98C13.39 12.19 12.98 12.66 12.85 12.8C12.73 12.94 12.6 12.96 12.39 12.85C12.18 12.75 11.51 12.53 10.71 11.82C10.09 11.27 9.67 10.59 9.55 10.38C9.43 10.17 9.54 10.06 9.64 9.95C9.74 9.85 9.85 9.71 9.96 9.58C10.07 9.45 10.11 9.35 10.18 9.21C10.25 9.07 10.21 8.95 10.16 8.85C10.11 8.74 9.68 7.69 9.5 7.25C9.33 6.82 9.15 6.88 9.02 6.87L8.64 6.84H9.11Z" />
        </svg>
      )
    },
    {
      id: 'youtube',
      name: t.social?.platforms?.youtube?.name || 'YouTube',
      handle: '@its_sonyaa1113-t8b',
      tag: lang === 'mr' ? 'व्हिडिओ व सेवाकार्य' : 'Videos & Documentaries',
      desc: lang === 'mr' ? 'गरजूंचे उपचार, सेवाकार्याची दृश्ये आणि प्रेरणादायी व्हिडिओ पाहण्यासाठी सबस्क्राईब करा.' : 'Watch inspiring patient recovery stories, on-ground rescue documentaries, and community events.',
      btnText: t.social?.platforms?.youtube?.btnText || 'Subscribe on YouTube',
      url: 'https://www.youtube.com/@its_sonyaa1113-t8b',
      stats: 'Subscribe',
      stats_mr: 'सबस्क्राईब करा',
      gradient: 'linear-gradient(135deg, #FF0000 0%, #b30000 100%)',
      accentColor: '#FF0000',
      glowColor: 'rgba(255, 0, 0, 0.35)',
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      id: 'instagram_payal',
      name: 'Instagram (Payal Foundation)',
      handle: '@payal_foundation04',
      tag: lang === 'mr' ? 'अधिकृत संस्था पेज' : 'Official Trust Page',
      desc: lang === 'mr' ? 'पायल फाउंडेशनच्या अधिकृत कार्याचे अपडेट्स, सेवाकार्य व ताज्या घडामोडी पाहण्यासाठी फॉलो करा.' : 'Follow Payal Foundation official page for regular updates, relief missions and announcements.',
      btnText: lang === 'mr' ? 'Instagram वर फॉलो करा' : 'Follow on Instagram',
      url: 'https://www.instagram.com/payal_foundation04/?hl=en',
      stats: 'Official',
      stats_mr: 'अधिकृत पेज',
      gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      accentColor: '#e1306c',
      glowColor: 'rgba(225, 48, 108, 0.35)',
      icon: (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    }
  ];

  return (
    <section id="social-media" className="section social-media-section" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Background Glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(225, 48, 108, 0.12) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(24, 119, 242, 0.12) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <div className="section-badge badge-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Share2 size={16} />
            <span>{t.social?.badge || 'Official Social Media'}</span>
          </div>

          <h2 className="section-title text-gradient" style={{ marginBottom: '1.2rem', fontSize: 'clamp(1.9rem, 4vw, 2.7rem)' }}>
            {t.social?.title || 'Connect with Us Online'}
          </h2>

          <p className="section-subtitle" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
            {t.social?.subtitle || 'Join our vibrant community online. Get live updates on our welfare missions, relief drives, and community transformation across Palghar.'}
          </p>
        </div>

        {/* 4 Social Cards Grid */}
        <div className="social-grid">
          {platforms.map((item) => (
            <div 
              key={item.id} 
              className="social-card glass-panel tilt-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '24px',
                padding: '2rem 1.6rem',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle top brand color accent line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: item.gradient
              }} />

              {/* Card Header: Icon + Verified Badge */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.4rem' }}>
                  {/* Glowing Brand Icon Badge */}
                  <div 
                    className="social-icon-box"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '18px',
                      background: item.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: `0 8px 24px ${item.glowColor}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Status / Tag Pill */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.35rem'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(15, 118, 110, 0.1)',
                      color: '#0f766e',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      border: '1px solid rgba(15, 118, 110, 0.2)'
                    }}>
                      <CheckCircle2 size={12} />
                      <span>{t.social?.verified || 'Verified'}</span>
                    </span>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      background: 'rgba(0,0,0,0.04)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px'
                    }}>
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Name & Handle */}
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
                  {item.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: item.accentColor,
                    letterSpacing: '-0.01em',
                    wordBreak: 'break-all'
                  }}>
                    {item.handle}
                  </span>

                  <button
                    onClick={() => handleCopy(item.handle, item.id)}
                    title={lang === 'mr' ? 'कॉपी करा' : 'Copy'}
                    aria-label={`Copy ${item.handle}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      color: copiedId === item.id ? '#16a34a' : 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Platform Description */}
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'var(--text-muted)',
                  marginBottom: '1.6rem',
                  minHeight: '48px'
                }}>
                  {item.desc}
                </p>
              </div>

              {/* Card Footer: Metrics & Follow CTA Button */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  fontWeight: 600
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} style={{ color: item.accentColor }} />
                    <span>{lang === 'mr' ? item.stats_mr : item.stats}</span>
                  </span>
                  <span style={{ color: item.accentColor, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span>{t.social?.followNow || 'Connect'}</span>
                    <ArrowUpRight size={13} />
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn btn-shine"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    width: '100%',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '14px',
                    background: item.gradient,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    textDecoration: 'none',
                    boxShadow: `0 6px 18px ${item.glowColor}`,
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>{item.btnText}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Community Highlight Ribbon */}
        <div 
          className="social-highlight-box glass-panel"
          style={{
            marginTop: '3.5rem',
            padding: '2rem 2.5rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(11, 98, 164, 0.06) 0%, rgba(245, 130, 32, 0.06) 100%)',
            border: '1px solid rgba(11, 98, 164, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 6px 18px rgba(11, 98, 164, 0.3)'
            }}>
              <Sparkles size={26} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {lang === 'mr' ? 'एकत्र येऊया, समाजसेवेत हातभार लावूया!' : 'Together, We Create a Better Society!'}
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
                {lang === 'mr' 
                  ? 'सोशल मीडियावर आमच्या सर्व मोहिमा शेअर करा आणि अधिकाधिक लोकांपर्यंत मदत पोहोचवा.'
                  : 'Share our missions on social media and help us reach more families in need.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/919225243552?text=Namaskar%20Payal%20Foundation%2C%20I%20want%20to%20join%20your%20community"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-sm btn-glow-pulse btn-shine"
              style={{
                borderRadius: '9999px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Heart size={16} />
              <span>{lang === 'mr' ? 'कम्युनिटीमध्ये सामील व्हा' : 'Join Our Community'}</span>
            </a>
          </div>
        </div>

      </div>

      <style>{`
        .social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .social-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }

        @media (max-width: 640px) {
          .social-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .social-highlight-box {
            padding: 1.5rem !important;
            flex-direction: column;
            text-align: center;
          }
          .social-highlight-box > div {
            flex-direction: column;
            text-align: center;
          }
        }

        .social-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        }

        .social-card:hover .social-icon-box {
          transform: scale(1.08) rotate(3deg);
        }

        .social-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
