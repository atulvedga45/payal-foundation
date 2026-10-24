import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, Lock, Eye, EyeOff, X, CheckCircle2, AlertCircle, Code2, ShieldCheck } from 'lucide-react';

export default function DeveloperPinModal({ isOpen, onClose, onSuccess, lang = 'mr' }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setSuccess(false);
      setShowPin(false);
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanPin = pin.trim();

    // Support 04703 and its 6-digit variations (040703, 047030, 004703)
    const validPins = ['04703', '040703', '047030', '004703'];
    if (validPins.includes(cleanPin)) {
      setError('');
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      setError(
        lang === 'mr'
          ? 'चुकीचा पिन! कृपया बरोबर ६ अंकी किंवा सिक्रेट कोड प्रविष्ट करा.'
          : 'Incorrect PIN! Please enter the valid developer security code.'
      );
      setPin('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 24, 0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'linear-gradient(165deg, #0d1e36 0%, #081220 100%)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '20px',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#94a3b8';
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ padding: '1.75rem 1.5rem 1.5rem 1.5rem', textAlign: 'center' }}>
          {/* Header Badge */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: success
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: success
                ? '0 8px 20px rgba(22, 163, 74, 0.4)'
                : '0 8px 20px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {success ? (
              <CheckCircle2 size={28} color="#ffffff" />
            ) : (
              <Code2 size={28} color="#ffffff" />
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: '0 0 0.35rem 0',
              color: '#ffffff',
              letterSpacing: '-0.01em'
            }}
          >
            {success
              ? (lang === 'mr' ? 'अ‍ॅडमिन पॅनेल अनलॉक झाले!' : 'Admin Panel Unlocked!')
              : (lang === 'mr' ? 'Develop By - सुरक्षा पिन' : 'Develop By - Verification')}
          </h3>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.84rem',
              color: '#94a3b8',
              margin: '0 0 1.4rem 0',
              lineHeight: 1.4
            }}
          >
            {success
              ? (lang === 'mr' ? 'अ‍ॅडमिन पर्याय नेव्हिगेशन बारमध्ये उपलब्ध झाला आहे.' : 'Admin option is now available in the Navbar.')
              : (lang === 'mr'
                  ? 'प्रशासन (Admin) पर्याय पाहण्यासाठी कृपया पिन कोड प्रविष्ट करा'
                  : 'Enter security PIN to reveal and access Admin Panel')}
          </p>

          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <KeyRound size={17} />
                </div>

                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="PIN प्रविष्ट करा..."
                  maxLength={10}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.6rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: error ? '1.5px solid #ef4444' : '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '1.15rem',
                    letterSpacing: showPin ? '0.15em' : '0.25em',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: error ? '0 0 12px rgba(239, 68, 68, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#38bdf8';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    marginBottom: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '0.7rem 1rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{lang === 'mr' ? 'अनलॉक करा' : 'Unlock Admin'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
