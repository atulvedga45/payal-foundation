import React, { useState } from 'react';
import { Menu, X, HeartHandshake } from 'lucide-react';

export default function Navbar({ t }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.initiatives, href: '#initiatives' },
    { label: t.nav.team, href: '#team' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--navbar-bg)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        {/* Brand / Logo */}
        <a 
          href="#home" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(0.5rem, 2vw, 0.85rem)', 
            textDecoration: 'none',
            minWidth: 0
          }}
        >
          <img 
            src="/logo.png" 
            alt="Payal Foundation and Social Service Logo" 
            style={{ 
              width: 'clamp(42px, 8vw, 52px)', 
              height: 'clamp(42px, 8vw, 52px)', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid var(--primary)',
              boxShadow: '0 3px 10px rgba(11, 98, 164, 0.25)',
              display: 'block',
              flexShrink: 0
            }}
            onError={(e) => {
              e.target.src = '/payal_logo.jpg';
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ 
              fontSize: 'clamp(0.92rem, 3vw, 1.25rem)', 
              fontWeight: 800, 
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}>
              Payal Foundation and Social Service
            </div>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.65rem' }} className="desktop-nav">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '1.08rem',
                letterSpacing: '0.01em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-main)'}
            >
              {link.label}
            </a>
          ))}

          {/* Donate CTA button */}
          <a href="#donate" className="btn btn-accent btn-sm shimmer-btn" style={{ padding: '0.6rem 1.45rem', fontSize: '0.98rem', fontWeight: 700 }}>
            <HeartHandshake size={17} />
            <span>{t.nav.donate}</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            color: 'var(--text-main)',
            display: 'block'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--light-surface)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0.35rem 0'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-accent"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <HeartHandshake size={18} />
            <span>{t.nav.donate}</span>
          </a>
        </div>
      )}

      {/* Inline styles for media query */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
