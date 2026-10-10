import React from 'react';
import { Heart, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer({ t, onOpenAdmin }) {
  const socialLinks = [
    {
      name: 'Instagram (@its_sonyaa1113)',
      url: 'https://www.instagram.com/its_sonyaa1113/?hl=en',
      color: '#e1306c',
      bgGradient: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1BttVwMWrV/',
      color: '#1877F2',
      bgGradient: 'linear-gradient(135deg, #1877F2 0%, #0d5cb6 100%)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp (9225243552)',
      url: 'https://wa.me/919225243552',
      color: '#25D366',
      bgGradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.84C8.94 6.84 8.78 6.84 8.64 6.84C8.5 6.84 8.28 6.9 8.1 7.1C7.91 7.3 7.37 7.81 7.37 8.86C7.37 9.91 8.14 10.93 8.25 11.07C8.36 11.21 9.73 13.33 11.83 14.24C12.33 14.45 12.72 14.58 13.02 14.68C13.52 14.84 13.98 14.81 14.34 14.76C14.74 14.7 15.57 14.26 15.74 13.77C15.91 13.29 15.91 12.87 15.86 12.79C15.81 12.71 15.67 12.66 15.46 12.55C15.25 12.45 14.21 11.94 14.02 11.87C13.82 11.8 13.68 11.77 13.54 11.98C13.39 12.19 12.98 12.66 12.85 12.8C12.73 12.94 12.6 12.96 12.39 12.85C12.18 12.75 11.51 12.53 10.71 11.82C10.09 11.27 9.67 10.59 9.55 10.38C9.43 10.17 9.54 10.06 9.64 9.95C9.74 9.85 9.85 9.71 9.96 9.58C10.07 9.45 10.11 9.35 10.18 9.21C10.25 9.07 10.21 8.95 10.16 8.85C10.11 8.74 9.68 7.69 9.5 7.25C9.33 6.82 9.15 6.88 9.02 6.87L8.64 6.84H9.11Z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@its_sonyaa1113-t8b',
      color: '#FF0000',
      bgGradient: 'linear-gradient(135deg, #FF0000 0%, #b30000 100%)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: 'Instagram (@payal_foundation04)',
      url: 'https://www.instagram.com/payal_foundation04/?hl=en',
      color: '#e1306c',
      bgGradient: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    }
  ];

  const renderSocialBtn = (item, isGridItem = false) => (
    <a
      key={item.name}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isGridItem ? '0.5rem 0.65rem' : '0.5rem 0.85rem',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '0.86rem',
        fontWeight: 600,
        transition: 'all 0.25s ease',
        minWidth: 0
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        e.currentTarget.style.borderColor = item.color;
        e.currentTarget.style.transform = isGridItem ? 'translateY(-2px)' : 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: isGridItem ? '0.45rem' : '0.65rem', minWidth: 0 }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: item.bgGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0
        }}>
          {item.icon}
        </div>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
      </div>
      <ArrowUpRight size={14} style={{ color: '#94a3b8', flexShrink: 0, marginLeft: '4px' }} />
    </a>
  );

  return (
    <footer style={{
      backgroundColor: 'var(--dark-bg)',
      color: '#ffffff',
      padding: '3.25rem 0 1.25rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '1.75rem'
        }}>
          
          {/* Col 1: Trust Profile */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <img
                src="/logo.png"
                alt="Payal Foundation and Social Service Logo"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Payal Foundation and Social Service
              </span>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {t.footer.aboutText}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><a href="#home" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>{t.nav.home}</a></li>
              <li><a href="#about" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>{t.nav.about}</a></li>
              <li><a href="#initiatives" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>{t.nav.initiatives}</a></li>
              <li><a href="#team" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>{t.nav.team}</a></li>
              <li><a href="#gallery" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>{t.nav.gallery}</a></li>
              <li><a href="#donate" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>{t.nav.donate}</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              {t.nav.contact}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94a3b8', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <MapPin size={18} style={{ color: 'var(--accent-saffron)', flexShrink: 0 }} />
                <span>Palghar</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                <a href={`tel:${t.phone.replace(/\s+/g, '')}`} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 600 }}>
                  {t.phone}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                <a href={`mailto:${t.email}`} style={{ color: '#ffffff', textDecoration: 'none' }}>
                  {t.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Social Media Channels */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              {t.nav.social}
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              {t.social?.subtitle || 'Connect with us on official platforms for real-time updates.'}
            </p>
            
            {/* Social Icon Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* 1. Instagram (Sonya) */}
              {renderSocialBtn(socialLinks[0])}

              {/* 2. Facebook and YouTube in 1 row (2 columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                {renderSocialBtn(socialLinks[1], true)}
                {renderSocialBtn(socialLinks[3], true)}
              </div>

              {/* 3. WhatsApp */}
              {renderSocialBtn(socialLinks[2])}

              {/* 4. Instagram (Payal Foundation) */}
              {renderSocialBtn(socialLinks[4])}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          fontSize: '0.84rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Payal Foundation and Social Service. {t.footer.rights}
          </div>
        </div>

      </div>
    </footer>
  );
}
