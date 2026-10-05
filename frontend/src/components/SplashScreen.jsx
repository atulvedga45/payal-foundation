import React, { useState, useEffect } from 'react';

/**
 * SplashScreen — Full-screen animated intro that shows logo
 * then slides/fades away to reveal the main website.
 */
export default function SplashScreen({ onFinished }) {
  const [phase, setPhase] = useState('enter'); // enter → exit
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 40);
    const holdTimer  = setTimeout(() => setPhase('exit'), 2500);
    const doneTimer  = setTimeout(() => onFinished(), 3300);
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      className="splash-root"
      style={{
        opacity: phase === 'exit' ? 0 : mounted ? 1 : 0,
        transform: phase === 'exit' ? 'translateY(-36px) scale(0.97)' : 'translateY(0) scale(1)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
      aria-label="Loading Payal Foundation"
    >

      {/* Background gradient */}
      <div className="splash-bg" />

      {/* Animated rings behind logo */}
      <div className="splash-rings">
        <div className="splash-ring splash-ring-1" />
        <div className="splash-ring splash-ring-2" />
        <div className="splash-ring splash-ring-3" />
      </div>

      {/* Logo */}
      <div className="splash-logo-wrap">
        <img
          src="/payal_green_logo.jpg"
          alt="Payal Foundation and Social Service"
          className="splash-logo-img"
          onError={(e) => { e.target.src = '/logo.png'; }}
        />
      </div>

      {/* Organisation name */}
      <div className="splash-name">
        <div className="splash-name-main">Payal Foundation</div>
        <div className="splash-name-tag">समाजसेवा • पालघर</div>
      </div>

      {/* Loading dots */}
      <div className="splash-dots">
        <span className="splash-dot" style={{ animationDelay: '0s' }} />
        <span className="splash-dot" style={{ animationDelay: '0.18s' }} />
        <span className="splash-dot" style={{ animationDelay: '0.36s' }} />
      </div>

      <style>{`
        /* ── Root overlay ── */
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          overflow: hidden;
          transition: opacity 0.75s ease, transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }

        /* Enter: start invisible */
        .splash-enter {
          opacity: 0;
        }
        /* After mount, CSS transition triggers via JS class swap */

        /* Exit: slide up and fade */
        .splash-exit {
          opacity: 0;
          transform: translateY(-40px) scale(0.97);
          pointer-events: none;
        }

        /* ── Background ── */
        .splash-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #f0f9ff 0%, #ffffff 45%, #f0fdf4 80%, #fefce8 100%);
          animation: splashBgPulse 3s ease-in-out infinite alternate;
        }
        @keyframes splashBgPulse {
          0%   { background: linear-gradient(160deg, #e0f2fe 0%, #ffffff 45%, #dcfce7 80%, #fef9c3 100%); }
          100% { background: linear-gradient(160deg, #f0f9ff 0%, #ffffff 45%, #f0fdf4 80%, #fefce8 100%); }
        }

        /* ── Decorative rings ── */
        .splash-rings {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .splash-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(22,163,74,0.18);
          animation: ringExpand 2.5s ease-out infinite;
        }
        .splash-ring-1 { width: 220px; height: 220px; animation-delay: 0s; }
        .splash-ring-2 { width: 340px; height: 340px; animation-delay: 0.55s; border-color: rgba(245,158,11,0.15); }
        .splash-ring-3 { width: 460px; height: 460px; animation-delay: 1.1s; border-color: rgba(11,98,164,0.12); }

        @keyframes ringExpand {
          0%   { transform: scale(0.7); opacity: 0.9; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        /* ── Logo ── */
        .splash-logo-wrap {
          position: relative;
          z-index: 2;
          animation: logoAppear 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
        }
        .splash-logo-img {
          width: clamp(140px, 24vw, 200px);
          height: clamp(140px, 24vw, 200px);
          object-fit: contain;
          border-radius: 50%;
          border: 3px solid rgba(22,163,74,0.3);
          box-shadow:
            0 0 0 10px rgba(22,163,74,0.07),
            0 0 0 20px rgba(201,162,39,0.05),
            0 20px 50px rgba(22,163,74,0.2),
            0 8px 20px rgba(0,0,0,0.06);
          animation: logoFloat 4s ease-in-out 1s infinite;
          background: #ffffff;
          padding: 16px;
        }
        @keyframes logoAppear {
          from { opacity: 0; transform: scale(0.5) rotate(-8deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes logoFloat {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }

        /* ── Name text ── */
        .splash-name {
          position: relative;
          z-index: 2;
          text-align: center;
          margin-top: 1.5rem;
          animation: nameAppear 0.85s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }
        @keyframes nameAppear {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .splash-name-main {
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 800;
          color: #0b62a4;
          letter-spacing: -0.02em;
          line-height: 1.15;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        .splash-name-sub {
          font-size: clamp(0.95rem, 2.5vw, 1.25rem);
          font-weight: 600;
          color: #15803d;
          margin-top: 0.15rem;
        }
        .splash-name-tag {
          font-size: clamp(1rem, 2.8vw, 1.3rem);
          font-weight: 700;
          color: #92400e;
          margin-top: 0.55rem;
          letter-spacing: 0.05em;
          opacity: 0.9;
        }

        /* ── Loading dots ── */
        .splash-dots {
          position: relative;
          z-index: 2;
          display: flex;
          gap: 0.5rem;
          margin-top: 2.2rem;
          animation: nameAppear 0.7s ease 1s both;
        }
        .splash-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0b62a4;
          display: inline-block;
          animation: dotBounce 0.9s ease-in-out infinite;
        }
        @keyframes dotBounce {
          0%,80%,100% { transform: scale(0.7); opacity: 0.4; }
          40%          { transform: scale(1.3); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
