import React from 'react';
import { Heart, Phone, Globe, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function TopBar({ lang, setLang, t, onOpenAdmin, theme, toggleTheme }) {
  return (
    <div style={{
      backgroundColor: 'var(--primary-dark)',
      color: '#ffffff',
      fontSize: '0.82rem',
      padding: '0.35rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Samajseva Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={15} style={{ color: '#f59e0b', fill: '#f59e0b', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, letterSpacing: '0.03em', fontSize: '0.92rem' }}>
            {t.regNo || 'समाजसेवा'}
          </span>
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

          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
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
              padding: '0.32rem 0.75rem',
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
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} style={{ color: '#facc15' }} />
                <span>{lang === 'mr' ? 'लाईट' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon size={14} style={{ color: '#93c5fd' }} />
                <span>{lang === 'mr' ? 'डार्क' : 'Dark'}</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
