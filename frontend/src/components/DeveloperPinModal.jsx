import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { KeyRound, Eye, EyeOff, X, CheckCircle2, AlertCircle, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

// Exact passwords requested by user:
// Admin panel: ONLY '004703'
// Visitor panel: ONLY '941027'
const ADMIN_PIN = '004703';
const VISITOR_PIN = '941027';
const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 Hour (3600 seconds)
const INITIAL_MAX_ATTEMPTS = 5;

export default function DeveloperPinModal({ isOpen, onClose, onSuccess, onOpenVisitorLog, lang = 'mr' }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successType, setSuccessType] = useState('admin');
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemainingSec, setLockRemainingSec] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(INITIAL_MAX_ATTEMPTS);
  const [penaltyActive, setPenaltyActive] = useState(false);
  const inputRef = useRef(null);

  // Format seconds into digital display (MM:SS or HH:MM:SS)
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Check lockout status from persistent localStorage
  const refreshLockoutStatus = useCallback(() => {
    try {
      const lockUntilStr = localStorage.getItem('payal_pin_lock_until');
      const isPenalty = localStorage.getItem('payal_pin_penalty_active') === 'true';
      const wrongCount = parseInt(localStorage.getItem('payal_pin_wrong_count') || '0', 10);
      const now = Date.now();

      setPenaltyActive(isPenalty);

      if (lockUntilStr) {
        const lockUntil = parseInt(lockUntilStr, 10);
        if (lockUntil > now) {
          const remaining = Math.ceil((lockUntil - now) / 1000);
          setIsLocked(true);
          setLockRemainingSec(remaining);
          setAttemptsLeft(0);
          return { locked: true, remaining };
        } else {
          // 1 hour lockout finished!
          localStorage.removeItem('payal_pin_lock_until');
          setIsLocked(false);
          setLockRemainingSec(0);
          // Penalty remains active, so only 1 attempt is allowed
          setAttemptsLeft(1);
          return { locked: false, remaining: 0 };
        }
      }

      setIsLocked(false);
      setLockRemainingSec(0);
      if (isPenalty) {
        setAttemptsLeft(1);
      } else {
        setAttemptsLeft(Math.max(0, INITIAL_MAX_ATTEMPTS - wrongCount));
      }
      return { locked: false, remaining: 0 };
    } catch {
      return { locked: false, remaining: 0 };
    }
  }, []);

  // Modal open / close side-effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('pin-modal-open');
      setPin('');
      setError('');
      setSuccess(false);
      setShowPin(false);

      const status = refreshLockoutStatus();

      const timer = setTimeout(() => {
        if (!status.locked && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('pin-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('pin-modal-open');
    };
  }, [isOpen, refreshLockoutStatus]);

  // Real-time 1-second countdown ticker
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      try {
        const lockUntilStr = localStorage.getItem('payal_pin_lock_until');
        if (lockUntilStr) {
          const lockUntil = parseInt(lockUntilStr, 10);
          const now = Date.now();
          if (lockUntil > now) {
            const remaining = Math.ceil((lockUntil - now) / 1000);
            setIsLocked(true);
            setLockRemainingSec(remaining);
          } else {
            // Lockout expired while modal is open
            localStorage.removeItem('payal_pin_lock_until');
            setIsLocked(false);
            setLockRemainingSec(0);
            setAttemptsLeft(1);
            setPenaltyActive(true);
            setError(
              lang === 'mr'
                ? '१ तासाचा ब्लॉक पूर्ण झाला. तुम्ही पुन्हा प्रयत्न करू शकता (फक्त १ संधी शिल्लक).'
                : '1 hour lockout completed. You may try again (1 attempt only).'
            );
          }
        } else {
          setIsLocked(false);
          setLockRemainingSec(0);
        }
      } catch (_) {}
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, lang]);

  // Handle escape key
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

    // Block submission if currently locked out
    const currentStatus = refreshLockoutStatus();
    if (currentStatus.locked) {
      return;
    }

    const cleanPin = pin.trim();
    if (!cleanPin) return;

    // 1. VISITOR PANEL: ONLY '941027'
    if (cleanPin === VISITOR_PIN) {
      try {
        localStorage.removeItem('payal_pin_wrong_count');
        localStorage.removeItem('payal_pin_lock_until');
        localStorage.removeItem('payal_pin_penalty_active');
      } catch (_) {}
      setError('');
      setSuccess(true);
      setSuccessType('visitor');
      setTimeout(() => {
        onClose();
        if (onOpenVisitorLog) onOpenVisitorLog(cleanPin);
      }, 550);
      return;
    }

    // 2. ADMIN PANEL: ONLY '004703'
    if (cleanPin === ADMIN_PIN) {
      try {
        localStorage.removeItem('payal_pin_wrong_count');
        localStorage.removeItem('payal_pin_lock_until');
        localStorage.removeItem('payal_pin_penalty_active');
      } catch (_) {}
      setError('');
      setSuccess(true);
      setSuccessType('admin');
      setTimeout(() => {
        onSuccess();
      }, 600);
      return;
    }

    // 3. WRONG PASSWORD ENTERED
    const isPenalty = localStorage.getItem('payal_pin_penalty_active') === 'true';

    // If 1-hour penalty was already served, even 1 wrong password immediately locks for 1 hour again!
    if (isPenalty) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      try {
        localStorage.setItem('payal_pin_lock_until', String(lockUntil));
        localStorage.setItem('payal_pin_penalty_active', 'true');
      } catch (_) {}
      setIsLocked(true);
      setLockRemainingSec(3600);
      setAttemptsLeft(0);
      setPin('');
      setError(
        lang === 'mr'
          ? '🚫 चुकीचा पासवर्ड! पुन्हा १ तासासाठी ब्लॉक करण्यात आले आहे.'
          : '🚫 Incorrect PIN! Locked out again for 1 hour.'
      );
      return;
    }

    // First cycle: allow up to 5 wrong attempts
    const currentWrong = parseInt(localStorage.getItem('payal_pin_wrong_count') || '0', 10) + 1;
    try {
      localStorage.setItem('payal_pin_wrong_count', String(currentWrong));
    } catch (_) {}

    if (currentWrong >= INITIAL_MAX_ATTEMPTS) {
      // 5 wrong attempts reached -> LOCK FOR 1 HOUR
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      try {
        localStorage.setItem('payal_pin_lock_until', String(lockUntil));
        localStorage.setItem('payal_pin_penalty_active', 'true');
      } catch (_) {}
      setIsLocked(true);
      setLockRemainingSec(3600);
      setAttemptsLeft(0);
      setPenaltyActive(true);
      setPin('');
      setError(
        lang === 'mr'
          ? '🚫 ५ वेळा चुकीचा पासवर्ड प्रविष्ट केला! सुरक्षा कारणास्तव १ तासासाठी इनपुट ब्लॉक करण्यात आले आहे.'
          : '🚫 5 incorrect attempts! Input is locked for 1 hour for security.'
      );
    } else {
      const left = INITIAL_MAX_ATTEMPTS - currentWrong;
      setAttemptsLeft(left);
      setPin('');
      setError(
        lang === 'mr'
          ? `चुकीचा पासवर्ड! कृपया बरोबर पासवर्ड टाका. (शिल्लक प्रयत्न: ${left}/${INITIAL_MAX_ATTEMPTS})`
          : `Incorrect PIN! Please try again. (${left}/${INITIAL_MAX_ATTEMPTS} attempts left)`
      );
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 24, 0.82)',
        backdropFilter: 'blur(9px)',
        WebkitBackdropFilter: 'blur(9px)',
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
          maxWidth: '390px',
          background: isLocked
            ? 'linear-gradient(165deg, #200f16 0%, #11080d 100%)'
            : 'linear-gradient(165deg, #0d1e36 0%, #081220 100%)',
          border: isLocked
            ? '1.5px solid rgba(239, 68, 68, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '22px',
          boxShadow: isLocked
            ? '0 24px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.25)'
            : '0 24px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff',
          transition: 'all 0.3s ease'
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

        <div style={{ padding: '1.85rem 1.6rem 1.6rem 1.6rem', textAlign: 'center' }}>
          {/* Header Badge */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: success
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : isLocked
                ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: success
                ? '0 8px 20px rgba(22, 163, 74, 0.4)'
                : isLocked
                ? '0 8px 22px rgba(220, 38, 38, 0.5)'
                : '0 8px 20px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {success ? (
              <CheckCircle2 size={30} color="#ffffff" />
            ) : isLocked ? (
              <Clock size={30} color="#ffffff" />
            ) : (
              <ShieldCheck size={30} color="#ffffff" />
            )}
          </div>

          {/* Title - "About Us" text removed as requested */}
          {(success || isLocked) && (
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
                ? successType === 'visitor'
                  ? (lang === 'mr' ? 'गुप्त व्हिजिटर यादी उघडत आहे...' : 'Opening Secret Visitor Log...')
                  : (lang === 'mr' ? 'अ‍ॅडमिन पॅनेल अनलॉक झाले!' : 'Admin Panel Unlocked!')
                : (lang === 'mr' ? 'सुरक्षा लॉक सक्रिय आहे' : 'Security Lockout Active')}
            </h3>
          )}

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.88rem',
              color: isLocked ? '#fca5a5' : '#94a3b8',
              margin: '0 0 1.25rem 0',
              lineHeight: 1.4
            }}
          >
            {success
              ? successType === 'visitor'
                ? (lang === 'mr' ? 'व्हिजिटर्सची नावे व आकडेवारी लोड होत आहे.' : 'Loading visitor analytics.')
                : (lang === 'mr' ? 'अ‍ॅडमिन पर्याय नेव्हिगेशन बारमध्ये उपलब्ध झाला आहे.' : 'Admin is now available in Navbar.')
              : isLocked
              ? (lang === 'mr'
                  ? '५ वेळा चुकीचा पासवर्ड टाकल्यामुळे १ तास इनपुट ब्लॉक केले आहे.'
                  : 'Input is locked for 1 hour due to 5 incorrect attempts.')
              : (lang === 'mr'
                  ? 'कृपया पासवर्ड प्रविष्ट करा'
                  : 'Please enter password')}
          </p>

          {/* Live Countdown Display when Locked Out */}
          {isLocked && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                textAlign: 'center',
                boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#fca5a5',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Clock size={14} />
                <span>{lang === 'mr' ? 'उर्वरित लॉक वेळ (Time Remaining):' : 'Lockout Time Remaining:'}</span>
              </div>
              <div
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: '#f87171',
                  letterSpacing: '0.08em',
                  fontFamily: 'monospace',
                  textShadow: '0 0 12px rgba(239, 68, 68, 0.5)'
                }}
              >
                {formatTimeRemaining(lockRemainingSec)}
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  marginTop: '0.35rem'
                }}
              >
                {lang === 'mr' ? '१ तास पूर्ण होईपर्यंत इनपुटवर क्लिक होणार नाही' : 'Input cannot be clicked until 1 hour finishes'}
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isLocked ? '#ef4444' : '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <KeyRound size={17} />
                </div>

                <input
                  ref={inputRef}
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={isLocked}
                  value={pin}
                  onChange={(e) => {
                    if (isLocked) return;
                    setPin(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={
                    isLocked
                      ? (lang === 'mr' ? '१ तास लॉक आहे (बंद)' : 'Locked for 1 hour')
                      : (lang === 'mr' ? 'पासवर्ड प्रविष्ट करा...' : 'Enter password...')
                  }
                  maxLength={10}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.6rem',
                    background: isLocked ? 'rgba(30, 10, 15, 0.6)' : 'rgba(15, 23, 42, 0.7)',
                    border: isLocked
                      ? '1.5px solid rgba(239, 68, 68, 0.5)'
                      : error
                      ? '1.5px solid #ef4444'
                      : '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: isLocked ? '#94a3b8' : '#ffffff',
                    fontSize: '1.15rem',
                    letterSpacing: pin ? (showPin ? '0.15em' : '0.25em') : 'normal',
                    textAlign: 'center',
                    outline: 'none',
                    cursor: isLocked ? 'not-allowed' : 'text',
                    pointerEvents: isLocked ? 'none' : 'auto',
                    opacity: isLocked ? 0.55 : 1,
                    boxShadow: error
                      ? '0 0 12px rgba(239, 68, 68, 0.3)'
                      : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    if (!error && !isLocked) e.target.style.borderColor = '#38bdf8';
                  }}
                  onBlur={(e) => {
                    if (!error && !isLocked) e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                />

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: isLocked ? '#475569' : '#94a3b8',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    pointerEvents: isLocked ? 'none' : 'auto',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPin ? 'Hide Password' : 'Show Password'}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Status Hint when not locked but penalty rule is in effect */}
              {!isLocked && penaltyActive && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    color: '#fbbf24',
                    fontSize: '0.74rem',
                    marginBottom: '0.75rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span>
                    {lang === 'mr'
                      ? '⚠️ १ संधी शिल्लक: पुन्हा १ पासवर्ड चुकीचा झाला तर लगेच १ तास लॉक होईल.'
                      : '⚠️ 1 attempt left: an incorrect password will lock out for 1 hour again.'}
                  </span>
                </div>
              )}

              {/* Error Message */}
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
                  disabled={isLocked}
                  style={{
                    flex: 1.5,
                    padding: '0.7rem 1rem',
                    background: isLocked
                      ? 'rgba(75, 85, 99, 0.4)'
                      : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: isLocked
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: isLocked ? '#94a3b8' : '#ffffff',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    pointerEvents: isLocked ? 'none' : 'auto',
                    opacity: isLocked ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: isLocked
                      ? 'none'
                      : '0 4px 14px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLocked) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLocked) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{lang === 'mr' ? 'अनलॉक करा' : 'Unlock'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
