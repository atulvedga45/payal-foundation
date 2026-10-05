import React from 'react';
import { Heart, Users, HandHeart, Sparkles, ArrowRight } from 'lucide-react';

export default function Hero({ t }) {
  return (
    <section id="home" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #fef3c7 100%)',
      padding: '5rem 0 4.5rem 0',
      overflow: 'hidden'
    }}>

      {/* ── Professional Animated Background ── */}
      <div className="hero-pro-bg" aria-hidden="true">

        {/* Gradient mesh orbs — slow, elegant */}
        <div className="pro-orb pro-orb-1" />
        <div className="pro-orb pro-orb-2" />
        <div className="pro-orb pro-orb-3" />

        {/* Single clean SVG wave */}
        <svg className="pro-wave-svg" viewBox="0 0 1440 560" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="proWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#93c5fd" stopOpacity="0.5" />
              <stop offset="50%"  stopColor="#bfdbfe" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="proWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#dbeafe" stopOpacity="0.6" />
              <stop offset="60%"  stopColor="#e0f2fe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.5" />
            </linearGradient>
            <filter id="proBlur"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          {/* Primary wave */}
          <path
            className="pro-wave-1"
            d="M0,260 C240,180 480,340 720,240 C960,140 1200,320 1440,220 L1440,560 L0,560 Z"
            fill="url(#proWaveGrad1)"
          />
          {/* Secondary softer wave */}
          <path
            className="pro-wave-2"
            d="M0,340 C200,280 440,400 720,320 C960,240 1200,380 1440,300 L1440,560 L0,560 Z"
            fill="url(#proWaveGrad2)"
            filter="url(#proBlur)"
          />
        </svg>

        {/* Subtle dot-grid pattern */}
        <svg className="pro-dot-grid" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(59,130,246,0.18)" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dotGrid)" />
        </svg>

      </div>

      {/* ── Professional Hero CSS ── */}
      <style>{`
        .hero-pro-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* ── Gradient Orbs ── */
        .pro-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          will-change: transform;
        }

        /* Blue orb — top right */
        .pro-orb-1 {
          width: 580px;
          height: 580px;
          top: -180px;
          right: -120px;
          background: radial-gradient(circle, rgba(96,165,250,0.28) 0%, rgba(147,197,253,0.12) 50%, transparent 70%);
          animation: orbDrift1 18s ease-in-out infinite;
        }

        /* Saffron/warm orb — bottom left */
        .pro-orb-2 {
          width: 460px;
          height: 460px;
          bottom: -140px;
          left: -100px;
          background: radial-gradient(circle, rgba(251,191,36,0.14) 0%, rgba(253,230,138,0.06) 50%, transparent 70%);
          animation: orbDrift2 22s ease-in-out 3s infinite;
        }

        /* Subtle indigo orb — center */
        .pro-orb-3 {
          width: 360px;
          height: 360px;
          top: 20%;
          left: 38%;
          background: radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 65%);
          animation: orbDrift3 26s ease-in-out 6s infinite;
        }

        @keyframes orbDrift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-30px, 25px) scale(1.06); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(25px, -20px) scale(1.08); }
        }
        @keyframes orbDrift3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-15px, 30px) scale(1.12); }
        }

        /* ── Waves ── */
        .pro-wave-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        @keyframes proWave1 {
          0%,100% { d: path("M0,260 C240,180 480,340 720,240 C960,140 1200,320 1440,220 L1440,560 L0,560 Z"); }
          50%      { d: path("M0,280 C220,200 460,360 720,260 C980,160 1220,340 1440,240 L1440,560 L0,560 Z"); }
        }
        .pro-wave-1 { animation: proWave1 14s ease-in-out infinite; }

        @keyframes proWave2 {
          0%,100% { d: path("M0,340 C200,280 440,400 720,320 C960,240 1200,380 1440,300 L1440,560 L0,560 Z"); }
          50%      { d: path("M0,360 C220,295 460,415 720,340 C980,260 1220,395 1440,318 L1440,560 L0,560 Z"); }
        }
        .pro-wave-2 { animation: proWave2 18s ease-in-out 2s infinite; }

        /* ── Dot Grid ── */
        .pro-dot-grid {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.6;
          animation: dotFade 10s ease-in-out infinite alternate;
        }
        @keyframes dotFade {
          0%   { opacity: 0.35; }
          100% { opacity: 0.65; }
        }
      `}</style>
      {/* Decorative Animated Slow Glowing Blur Spheres */}
      <div className="slow-glow-orb-1" style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(11,98,164,0.18) 0%, rgba(37,99,235,0.08) 50%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(28px)',
        zIndex: 0
      }} />

      <div className="slow-glow-orb-2" style={{
        position: 'absolute',
        bottom: '-12%',
        left: '-6%',
        width: '460px',
        height: '460px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.06) 50%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(32px)',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          {/* Heading */}
          <h1 className="reveal" style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.6rem)',
            fontWeight: 800,
            color: 'var(--dark-bg)',
            lineHeight: 1.35,
            letterSpacing: 'normal',
            marginBottom: '1.5rem',
            overflow: 'visible'
          }}>
            <span style={{ display: 'inline-block', paddingBottom: '0.15em', overflow: 'visible' }}>
              {t.hero.titleStart}
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #0b62a4 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              paddingBottom: '0.25em',
              marginBottom: '-0.15em',
              overflow: 'visible'
            }}>
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="reveal stagger-1" style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
            maxWidth: '740px',
            margin: '0 auto 2.5rem auto'
          }}>
            {t.hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="reveal stagger-2" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <a href="#donate" className="btn btn-accent shimmer-btn" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
              <Heart size={18} />
              <span>{t.hero.btnDonateNow}</span>
            </a>
            <a href="#initiatives" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}>
              <span>{t.hero.btnGetInvolved}</span>
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Metric Stats Banner */}
          <div className="reveal stagger-3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginTop: '2rem'
          }}>
            {/* Stat 1 */}
            <div className="card" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div className="micro-float" style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <HandHeart size={26} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
                  {t.hero.stat1Number}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {t.hero.stat1Label}
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="card" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div className="micro-float" style={{
                background: '#fef3c7',
                color: '#b45309',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Users size={26} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>
                  {t.hero.stat2Number}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {t.hero.stat2Label}
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="card" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'left'
            }}>
              <div className="micro-float" style={{
                background: '#dcfce7',
                color: '#15803d',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Heart size={26} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>
                  {t.hero.stat3Number}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {t.hero.stat3Label}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
