import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Award, Sparkles, Heart, Share2, Edit3, X, Check, ShieldCheck } from 'lucide-react';
import { recordVisitorApi } from '../api';

export default function VisitorAppreciationModal({ isOpen, onClose, visitorProfile, onUpdateProfile, lang = 'mr' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(visitorProfile?.fullName || '');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  if (!isOpen || !visitorProfile) return null;

  const { fullName, firstName, visitorNumber = 1 } = visitorProfile;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 नमस्कार! मी पायल फाउंडेशनच्या पालघर समाजकार्य उपक्रमांना पाठिंबा दिला आहे.\n` +
      `मी संस्थेचा #${visitorNumber} वा सन्माननीय व्हिजिटर ठरलो आहे.\n` +
      `तुम्हीही भेट द्या आणि समाजकार्याला हातभार लावा: https://payal-foundation.vercel.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSaveNewName = async (e) => {
    if (e) e.preventDefault();
    const clean = newName.trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words[0].length < 2 || words[1].length < 2) {
      setEditError('कृपया पूर्ण नाव (पहिले नाव व आडनाव) प्रविष्ट करा.');
      return;
    }

    setEditLoading(true);
    setEditError('');

    try {
      const deviceId = localStorage.getItem('payal_visitor_device_id');
      await recordVisitorApi(clean, deviceId);
      const updated = {
        ...visitorProfile,
        fullName: clean,
        firstName: words[0]
      };
      localStorage.setItem('payal_visitor_profile', JSON.stringify(updated));
      if (onUpdateProfile) onUpdateProfile(updated);
      setIsEditing(false);
    } catch (err) {
      console.warn('Update failed:', err);
      const wordsArr = clean.split(/\s+/);
      const updated = {
        ...visitorProfile,
        fullName: clean,
        firstName: wordsArr[0]
      };
      localStorage.setItem('payal_visitor_profile', JSON.stringify(updated));
      if (onUpdateProfile) onUpdateProfile(updated);
      setIsEditing(false);
    } finally {
      setEditLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 28, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'fadeInCard 0.25s ease-out'
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
          maxWidth: '480px',
          background: 'linear-gradient(165deg, #0e1e38 0%, #071325 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff',
          animation: 'cardScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Gold Foil Bar */}
        <div
          style={{
            height: '6px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 35%, #fef08a 50%, #fbbf24 65%, #f59e0b 100%)'
          }}
        />

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
            color: '#cbd5e1',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 5
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ padding: '2rem 1.85rem 1.75rem 1.85rem', textAlign: 'center' }}>
          {/* Royal Saffron & Gold Badge */}
          <div
            style={{
              width: '68px',
              height: '68px',
              margin: '0 auto 1.15rem auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.45) 100%)',
              border: '2px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Award size={36} color="#fbbf24" />
          </div>

          {/* Card Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '0.04em',
              marginBottom: '0.85rem'
            }}
          >
            <Sparkles size={14} />
            <span>पायल फाउंडेशन — सन्माननीय हितचिंतक</span>
          </div>

          {/* User Full Name & Edit Toggle */}
          {!isEditing ? (
            <div style={{ marginBottom: '0.75rem' }}>
              <h2
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  margin: '0 0 0.25rem 0',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <span>{fullName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewName(fullName);
                    setIsEditing(true);
                  }}
                  title="नाव बदला (Edit Name)"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    padding: '4px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <Edit3 size={15} />
                </button>
              </h2>

              {/* Visitor Number Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#38bdf8'
                }}
              >
                <ShieldCheck size={13} />
                <span>सन्माननीय व्हिजिटर क्र. #{visitorNumber}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveNewName} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="पूर्ण नाव टाका..."
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1.5px solid #38bdf8',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    outline: 'none',
                    width: '70%'
                  }}
                />
                <button
                  type="submit"
                  disabled={editLoading}
                  style={{
                    padding: '0.55rem 0.85rem',
                    background: '#16a34a',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Check size={16} />
                  <span>सेव्ह</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  रद्द
                </button>
              </div>
              {editError && (
                <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  {editError}
                </div>
              )}
            </form>
          )}

          {/* Heartfelt 3-4 Lines Appreciation Letter */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.25rem 1.35rem',
              margin: '1.15rem 0 1.5rem 0',
              textAlign: 'left',
              lineHeight: 1.65,
              fontSize: '0.92rem',
              color: '#e2e8f0',
              position: 'relative'
            }}
          >
            <p style={{ margin: '0 0 0.65rem 0', fontWeight: 700, color: '#fef08a' }}>
              मनःपूर्वक धन्यवाद {firstName}जी! 🙏
            </p>
            <p style={{ margin: '0 0 0.65rem 0' }}>
              पालघरमधील गरजू रुग्णांना वैद्यकीय मदत आणि समाजोपयोगी उपक्रमांमध्ये आपण दाखवलेला हा स्नेह व सदिच्छा आमच्यासाठी अत्यंत मोलाची आहे.
            </p>
            <p style={{ margin: '0 0 0.65rem 0' }}>
              आपल्यासारख्या समाजप्रेमी नागरिकांच्या पाठिंब्यामुळेच आम्हाला सेवेची नवी ऊर्जा मिळते. माणुसकीच्या या पवित्र कार्यात आपले आशीर्वाद व अशीच साथ सदैव लाभो, हीच सदिच्छा!
            </p>
            <div
              style={{
                marginTop: '0.85rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#38bdf8',
                textAlign: 'right'
              }}
            >
              — सोन्या व समस्त पायल फाउंडेशन टीम, पालघर
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', flexDirection: 'column' }}>
            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              style={{
                width: '100%',
                padding: '0.78rem 1rem',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <Share2 size={17} />
              <span>WhatsApp वर स्टेटस ठेवा / शेअर करा</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: '#cbd5e1',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              वेबसाईट सुरू ठेवा (Close)
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardScaleUp {
          from { opacity: 0; transform: scale(0.9) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
