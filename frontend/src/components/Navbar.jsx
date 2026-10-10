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
    <nav 
      className="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--navbar-bg)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.3s ease'
      }}
    >
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
        <div style={{ display: 'none', alignItems: 'center', gap: '1.4rem' }} className="desktop-nav">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="nav-link-animated"
              style={{
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.98rem',
                letterSpacing: '0.01em',
                padding: '0.4rem 0.2rem',
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-main)'}
            >
              {link.label}
            </a>
          ))}

          {/* Donate CTA button with Glow Pulse & Shine */}
          <a
            href="#donate"
            className="btn btn-accent btn-sm btn-glow-pulse btn-shine"
            style={{
              padding: '0.62rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <HeartHandshake size={18} />
            <span>{t.nav.donate}</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            background: 'rgba(11, 98, 164, 0.08)',
            border: '1px solid rgba(11, 98, 164, 0.15)',
            borderRadius: '10px',
            cursor: 'pointer',
            padding: '0.45rem',
            color: 'var(--primary)',
            display: 'block',
            transition: 'all 0.2s ease'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--light-surface)',
          borderBottom: '2px solid rgba(11, 98, 164, 0.15)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
          animation: 'slideDownNav 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '1.02rem',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-accent btn-glow-pulse btn-shine"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', justifyContent: 'center' }}
          >
            <HeartHandshake size={18} />
            <span>{t.nav.donate}</span>
          </a>
        </div>
      )}

      {/* Scoped CSS for Navbar animations & responsiveness */}
      <style>{`
        @keyframes slideDownNav {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-link-animated::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2.5px;
          background: var(--primary-gradient);
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateX(-50%);
        }

        .nav-link-animated:hover::after {
          width: 85%;
        }

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
