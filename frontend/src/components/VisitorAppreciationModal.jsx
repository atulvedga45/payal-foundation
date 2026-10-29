import React from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, ShieldCheck } from 'lucide-react';

export default function VisitorAppreciationModal({ isOpen, onClose, visitorProfile, lang = 'mr' }) {
  if (!isOpen || !visitorProfile) return null;

  const { fullName, firstName, visitorNumber = 1 } = visitorProfile;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 28, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
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
          maxWidth: '430px',
          maxHeight: '90vh',
          background: 'linear-gradient(165deg, #0e1e38 0%, #071325 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: '22px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff',
          animation: 'cardScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Slim Top Gold Foil Bar */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 35%, #fef08a 50%, #fbbf24 65%, #f59e0b 100%)'
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#cbd5e1',
            width: '32px',
            height: '32px',
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
          <X size={17} />
        </button>

        {/* Scrollable Container with compact padding so top & bottom never cut off */}
        <div
          style={{
            padding: '1.4rem 1.4rem 1.25rem 1.4rem',
            textAlign: 'center',
            overflowY: 'auto'
          }}
        >
          {/* Circular Badge Photo */}
          <div
            style={{
              width: '68px',
              height: '68px',
              margin: '0 auto 0.85rem auto',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
              background: '#0e1e38'
            }}
          >
            <img
              src="/visitor_badge_photo.jpg"
              alt="Payal Foundation"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => { e.target.src = '/sonya.jpg'; }}
            />
          </div>

          {/* Card Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.08) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#fbbf24',
              letterSpacing: '0.03em',
              marginBottom: '0.65rem'
            }}
          >
            <Sparkles size={13} />
            <span>पायल फाउंडेशन — सन्माननीय हितचिंतक</span>
          </div>

          {/* User Full Name (Clean without pencil icon) */}
          <div style={{ marginBottom: '0.55rem' }}>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                margin: '0 0 0.25rem 0',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.25
              }}
            >
              {fullName}
            </h2>

            {/* Visitor Number Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '9999px',
                padding: '0.18rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#38bdf8'
              }}
            >
              <ShieldCheck size={12} />
              <span>सन्माननीय व्हिजिटर क्र. #{visitorNumber}</span>
            </div>
          </div>

          {/* Appreciation Letter with Space between Name and "जी" */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              margin: '0.85rem 0 1.15rem 0',
              textAlign: 'left',
              lineHeight: 1.6,
              fontSize: '0.88rem',
              color: '#e2e8f0'
            }}
          >
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#fef08a' }}>
              मनःपूर्वक धन्यवाद {firstName} जी! 🙏
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              पालघरमधील गरजू रुग्णांना वैद्यकीय मदत आणि समाजोपयोगी उपक्रमांमध्ये आपण दाखवलेला हा स्नेह व सदिच्छा आमच्यासाठी अत्यंत मोलाची आहे.
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              आपल्यासारख्या समाजप्रेमी नागरिकांच्या पाठिंब्यामुळेच आम्हाला सेवेची नवी ऊर्जा मिळते. माणुसकीच्या या पवित्र कार्यात आपले आशीर्वाद व अशीच साथ सदैव लाभो, हीच सदिच्छा!
            </p>
            <div
              style={{
                marginTop: '0.65rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#38bdf8',
                textAlign: 'right'
              }}
            >
              — सोन्या व समस्त पायल फाउंडेशन टीम, पालघर
            </div>
          </div>

          {/* Close Action Button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
          >
            वेबसाईट सुरू ठेवा (Close)
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cardScaleUp {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
