import React, { useState, useEffect } from 'react';
import { Menu, X, HeartHandshake, Home, Info, Layers, Users, Image, Phone, ShieldCheck } from 'lucide-react';

export default function Navbar({ t, isAdminUnlocked = false, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.home,        href: '#home',        icon: Home },
    { label: t.nav.about,       href: '#about',       icon: Info },
    { label: t.nav.initiatives, href: '#initiatives', icon: Layers },
    { label: t.nav.team,        href: '#team',        icon: Users },
    { label: t.nav.gallery,     href: '#gallery',     icon: Image },
    { label: t.nav.contact,     href: '#contact',     icon: Phone },
  ];

  // Lock body scroll when drawer is open + hide scroll-to-top btn
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('drawer-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className="main-navbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
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
              onError={(e) => { e.target.src = '/payal_logo.jpg'; }}
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

            {/* Admin Portal Button in Navbar (Visible when unlocked via Develop By) */}
            {isAdminUnlocked && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="btn-admin-nav"
                style={{
                  padding: '0.48rem 1.05rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 3px 10px rgba(2, 132, 199, 0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(2, 132, 199, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(2, 132, 199, 0.35)';
                }}
                title="Admin Portal"
              >
                <ShieldCheck size={16} style={{ color: '#fbbf24' }} />
                <span>{t.nav.admin}</span>
              </button>
            )}

            {/* Donate CTA button */}
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
            onClick={() => setMobileMenuOpen(true)}
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
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scoped CSS */}
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }

          @keyframes fadeInOverlay {
            from { opacity: 0; }
            to   { opacity: 1; }
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

      {/* ── RIGHT-SIDE DRAWER (Mobile only) ── */}
      {mobileMenuOpen && (
        <>
          {/* Dark backdrop */}
          <div
            onClick={closeMenu}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.45)',
              zIndex: 1500,
              backdropFilter: 'blur(3px)',
              animation: 'fadeInOverlay 0.25s ease'
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100dvh',
              width: 'min(80vw, 300px)',
              background: '#ffffff',
              zIndex: 1501,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.18)',
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid #e2e8f0'
            }}>
              {/* Logo + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <img
                  src="/logo.png"
                  alt="Logo"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary)'
                  }}
                  onError={(e) => { e.target.src = '/payal_logo.jpg'; }}
                />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  lineHeight: 1.25,
                  maxWidth: '160px'
                }}>
                  Payal Foundation and Social Service
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={closeMenu}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  flexShrink: 0
                }}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={closeMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      marginBottom: '0.25rem',
                      transition: 'background 0.18s ease, color 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(11, 98, 164, 0.08)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }}
                  >
                    <Icon size={20} strokeWidth={2} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    {link.label}
                  </a>
                );
              })}

              {/* Mobile Drawer: Admin Option when unlocked via Develop By */}
              {isAdminUnlocked && (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenAdmin();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(2, 132, 199, 0.35)',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(3, 105, 161, 0.06) 100%)',
                    color: '#0369a1',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    marginTop: '0.4rem',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(2, 132, 199, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(3, 105, 161, 0.06) 100%)';
                  }}
                >
                  <ShieldCheck size={20} style={{ color: '#d97706', flexShrink: 0 }} />
                  <span>{t.nav.admin}</span>
                </button>
              )}
            </nav>

            {/* Donate Button at Bottom */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0' }}>
              <a
                href="#donate"
                onClick={closeMenu}
                className="btn btn-accent btn-glow-pulse btn-shine"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  borderRadius: '14px',
                  textDecoration: 'none'
                }}
              >
                <HeartHandshake size={20} />
                <span>{t.nav.donate}</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
