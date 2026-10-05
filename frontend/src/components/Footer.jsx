import React from 'react';
import { Heart, MapPin, Phone, Mail, Award } from 'lucide-react';

export default function Footer({ t, onOpenAdmin }) {
  return (
    <footer style={{
      backgroundColor: 'var(--dark-bg)',
      color: '#ffffff',
      padding: '4.5rem 0 2rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container">
        
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
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
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Payal Foundation and Social Service
              </span>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {t.footer.aboutText}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              color: 'var(--accent-saffron)'
            }}>
              <Award size={14} />
              <span>Reg: G.B.B.S.D 409/2026 | F-82401 (M)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
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
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              {t.nav.contact}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94a3b8', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--accent-saffron)', flexShrink: 0, marginTop: '2px' }} />
                <span>{t.address}</span>
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

        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Payal Foundation and Social Service. {t.footer.rights}
          </div>
          <div style={{ textAlign: 'right' }}>
            <span>{t.footer.registeredUnder}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
