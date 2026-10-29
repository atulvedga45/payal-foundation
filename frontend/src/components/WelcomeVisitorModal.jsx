import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, Sparkles, HeartHandshake, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { recordVisitorApi } from '../api';

export default function WelcomeVisitorModal({ isOpen, onClose, onRegistered, lang = 'mr' }) {
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanName = fullName.trim();
    const words = cleanName.split(/\s+/).filter(Boolean);

    // Validation: Require Full Name (At least 2 words e.g. First Name + Last Name)
    if (words.length < 2 || words[0].length < 2 || words[1].length < 2) {
      setError(
        lang === 'mr'
          ? 'कृपया आपले नाव आणि आडनाव (पूर्ण नाव) प्रविष्ट करा. (उदा. अतुल वेदगा)'
          : 'Please enter your full name (First & Last name, e.g. Atul Vedga).'
      );
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate or retrieve persistent device id
      let deviceId = localStorage.getItem('payal_visitor_device_id');
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        localStorage.setItem('payal_visitor_device_id', deviceId);
      }

      const res = await recordVisitorApi(cleanName, deviceId);
      const visitorProfile = {
        fullName: cleanName,
        firstName: res.first_name || words[0],
        visitorNumber: res.visitor_number || res.id || 1,
        totalCount: res.total_count || 1,
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('payal_visitor_profile', JSON.stringify(visitorProfile));
      if (onRegistered) onRegistered(visitorProfile);
      onClose();
    } catch (err) {
      console.error('Failed to register visitor:', err);
      // Fallback local save even if server is momentarily unreachable
      const wordsArr = cleanName.split(/\s+/);
      const fallbackProfile = {
        fullName: cleanName,
        firstName: wordsArr[0],
        visitorNumber: 1,
        totalCount: 1,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('payal_visitor_profile', JSON.stringify(fallbackProfile));
      if (onRegistered) onRegistered(fallbackProfile);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 16, 34, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem',
        animation: 'fadeInWelcome 0.3s ease-out'
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'linear-gradient(165deg, #0d1e38 0%, #061122 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff',
          animation: 'popInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Decorative Glow Ribbon */}
        <div
          style={{
            height: '5px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #38bdf8 50%, #10b981 100%)'
          }}
        />

        <div style={{ padding: '2rem 1.75rem 1.85rem 1.75rem', textAlign: 'center' }}>
          {/* Logo / Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1.15rem auto',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
            }}
          >
            <Sparkles size={32} color="#fbbf24" />
          </div>

          {/* Org Header */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '0.04em',
              marginBottom: '0.75rem'
            }}
          >
            <ShieldCheck size={14} />
            <span>पायल फाउंडेशन व समाजसेवा, पालघर</span>
          </div>

          {/* Welcome Heading */}
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              margin: '0 0 0.5rem 0',
              lineHeight: 1.3,
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}
          >
            {lang === 'mr' ? 'आपले सहर्ष स्वागत आहे!' : 'Welcome to Payal Foundation!'}
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: '#cbd5e1',
              margin: '0 0 1.5rem 0',
              lineHeight: 1.55
            }}
          >
            {lang === 'mr'
              ? 'पालघर समाजकार्याचे सन्माननीय हितचिंतक म्हणून कृपया आपले पूर्ण नाव नोंदवून पुढे जा.'
              : 'As an honored well-wisher of Palghar social service, please enter your full name to continue.'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'left', marginBottom: '1.15rem' }}>
              <label
                htmlFor="visitorFullName"
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#93c5fd',
                  marginBottom: '0.45rem',
                  letterSpacing: '0.02em'
                }}
              >
                {lang === 'mr' ? 'आपले पूर्ण नाव (First & Last Name):' : 'Your Full Name:'}
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="visitorFullName"
                  ref={inputRef}
                  type="text"
                  autoComplete="name"
                  placeholder={lang === 'mr' ? 'उदा. अतुल वेदगा (Atul Vedga)' : 'e.g. Atul Vedga'}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: error ? '1.5px solid #ef4444' : '1.5px solid rgba(56, 189, 248, 0.45)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: error
                      ? '0 0 14px rgba(239, 68, 68, 0.35)'
                      : '0 4px 14px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#38bdf8';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                  }}
                />
              </div>

              {error ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    marginTop: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.12)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#94a3b8',
                    marginTop: '0.35rem',
                    paddingLeft: '0.2rem'
                  }}
                >
                  {lang === 'mr'
                    ? '✨ तुमचे नाव वेबसाईट नेव्हबारमध्ये सन्मानपूर्वक दिसेल.'
                    : '✨ Your name will appear honored in the website navbar.'}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem 1.4rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '14px',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.75 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.45)';
              }}
            >
              {loading ? (
                <span>नोंदणी होत आहे...</span>
              ) : (
                <>
                  <HeartHandshake size={20} />
                  <span>{lang === 'mr' ? 'नोंद करा व वेबसाईट पहा' : 'Allow & Continue'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeInWelcome {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popInScale {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
