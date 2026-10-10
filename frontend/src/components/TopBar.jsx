import { Phone, Globe, ShieldCheck } from 'lucide-react';

export default function TopBar({ lang, setLang, t, onOpenAdmin, theme, toggleTheme }) {
  return (
    <div 
      className="top-bar"
      style={{
        backgroundColor: 'var(--primary-dark)',
        color: '#ffffff',
        fontSize: '0.82rem',
        padding: '0.35rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Social Media Quick Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          {[
            {
              name: 'Instagram (@its_sonyaa1113)',
              url: 'https://www.instagram.com/its_sonyaa1113/?hl=en',
              hoverBg: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
              icon: (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              )
            },
            {
              name: 'Facebook',
              url: 'https://www.facebook.com/share/1BttVwMWrV/',
              hoverBg: '#1877F2',
              icon: (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )
            },
            {
              name: 'WhatsApp (9225243552)',
              url: 'https://wa.me/919225243552',
              hoverBg: '#25D366',
              icon: (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.84C8.94 6.84 8.78 6.84 8.64 6.84C8.5 6.84 8.28 6.9 8.1 7.1C7.91 7.3 7.37 7.81 7.37 8.86C7.37 9.91 8.14 10.93 8.25 11.07C8.36 11.21 9.73 13.33 11.83 14.24C12.33 14.45 12.72 14.58 13.02 14.68C13.52 14.84 13.98 14.81 14.34 14.76C14.74 14.7 15.57 14.26 15.74 13.77C15.91 13.29 15.91 12.87 15.86 12.79C15.81 12.71 15.67 12.66 15.46 12.55C15.25 12.45 14.21 11.94 14.02 11.87C13.82 11.8 13.68 11.77 13.54 11.98C13.39 12.19 12.98 12.66 12.85 12.8C12.73 12.94 12.6 12.96 12.39 12.85C12.18 12.75 11.51 12.53 10.71 11.82C10.09 11.27 9.67 10.59 9.55 10.38C9.43 10.17 9.54 10.06 9.64 9.95C9.74 9.85 9.85 9.71 9.96 9.58C10.07 9.45 10.11 9.35 10.18 9.21C10.25 9.07 10.21 8.95 10.16 8.85C10.11 8.74 9.68 7.69 9.5 7.25C9.33 6.82 9.15 6.88 9.02 6.87L8.64 6.84H9.11Z" />
                </svg>
              )
            },
            {
              name: 'YouTube',
              url: 'https://www.youtube.com/@its_sonyaa1113-t8b',
              hoverBg: '#FF0000',
              icon: (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              )
            },
            {
              name: 'Instagram (@payal_foundation04)',
              url: 'https://www.instagram.com/payal_foundation04/?hl=en',
              hoverBg: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
              icon: (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              )
            }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.hoverBg;
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Right side: Phone, Language Toggle, Admin & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* Contact Number */}
          <a 
            href={`tel:${t.phone.replace(/\s+/g, '')}`} 
            style={{ 
              color: '#ffffff', 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '0.28rem 0.7rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            title="Call Us"
          >
            <Phone size={13} style={{ color: '#22c55e' }} />
            <span>{t.phone}</span>
          </a>

          {/* Language Toggle Button with Selected Green Background */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: 'rgba(0, 0, 0, 0.28)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            padding: '2px 4px',
            gap: '2px',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            <Globe size={13} style={{ marginLeft: '4px', marginRight: '2px', color: '#4ade80' }} />
            <button
              type="button"
              onClick={() => setLang('en')}
              style={{
                background: lang === 'en' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '3px 9px',
                fontSize: '0.74rem',
                fontWeight: lang === 'en' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: lang === 'en' ? '0 2px 6px rgba(22, 163, 74, 0.5)' : 'none'
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('mr')}
              style={{
                background: lang === 'mr' ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '3px 9px',
                fontSize: '0.74rem',
                fontWeight: lang === 'mr' ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: lang === 'mr' ? '0 2px 6px rgba(22, 163, 74, 0.5)' : 'none'
              }}
            >
              मराठी
            </button>
          </div>

          {/* Admin Portal Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.32rem 0.8rem',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'none';
            }}
            title="Admin Portal Login"
          >
            <ShieldCheck size={14} style={{ color: '#fbbf24' }} />
            <span>{t.nav.admin}</span>
          </button>



        </div>
      </div>
    </div>
  );
}
