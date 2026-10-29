import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, HandHeart, ArrowRight } from 'lucide-react';

function AnimatedCounter({ value }) {
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const marathiToEnglish = (s) => s.replace(/[०-९]/g, (d) => marathiDigits.indexOf(d));
  const englishToMarathi = (s) => s.replace(/[0-9]/g, (d) => marathiDigits[parseInt(d, 10)]);

  const [displayValue, setDisplayValue] = useState(() => {
    const raw = String(value || '');
    const isMr = /[०-९]/.test(raw);
    const zero = isMr ? '०' : '0';
    if (raw.includes('%')) return `${zero}%`;
    if (raw.includes('+')) return `${zero}+`;
    return zero;
  });

  const ref = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    animatedRef.current = false;
    const el = ref.current;
    if (!el) return;

    const rawStr = String(value || '');
    const isMarathi = /[०-९]/.test(rawStr);
    const hasComma = rawStr.includes(',');
    const normalized = marathiToEnglish(rawStr);

    // Extract digits and prefix / suffix (e.g. 50%, 20+, 400+, 1,500+)
    const match = normalized.match(/^([^\d]*)([\d,]+)([^\d]*)$/);
    if (!match) {
      setDisplayValue(rawStr);
      return;
    }

    const prefix = match[1] || '';
    const numOnly = parseInt(match[2].replace(/,/g, ''), 10);
    const suffix = match[3] || '';

    if (isNaN(numOnly)) {
      setDisplayValue(rawStr);
      return;
    }

    const startAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      const duration = 2000; // 2 seconds for rich, noticeable count-up
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo for energetic start and smooth landing
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentNum = Math.round(numOnly * ease);

        let formatted = hasComma && currentNum >= 1000
          ? currentNum.toLocaleString('en-IN')
          : String(currentNum);

        if (isMarathi) {
          formatted = englishToMarathi(formatted);
        }

        if (progress < 1) {
          setDisplayValue(`${prefix}${formatted}${suffix}`);
          requestAnimationFrame(step);
        } else {
          setDisplayValue(rawStr);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function Hero({ t, lang = 'mr', homeStats = null }) {
  // Ensure stat1 (percentage) never exceeds 100%
  const rawStat1 = homeStats?.stat1_number || t.hero.stat1Number;
  const stat1Digits = String(rawStat1).replace(/\D/g, '');
  const stat1Num = parseInt(stat1Digits, 10);
  const stat1Number = !isNaN(stat1Num) && stat1Num > 100 ? '100%' : rawStat1;

  // Enforce locked default labels
  const stat1Label = lang === 'mr' ? 'समाजास समर्पित' : 'Community Dedicated';

  const stat2Number = homeStats?.stat2_number || t.hero.stat2Number;
  const stat2Label = lang === 'mr' ? 'सक्रिय समाजसेवक' : 'Active Social Workers';

  const stat3Number = homeStats?.stat3_number || t.hero.stat3Number;
  const stat3Label = lang === 'mr' ? 'मदत पोहोचलेली कुटुंबे' : 'Families Impacted';

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
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>

          {/* Heading */}
          <h1 className="reveal stagger-1" style={{
            fontSize: 'clamp(2.3rem, 5.2vw, 3.8rem)',
            fontWeight: 800,
            color: 'var(--dark-bg)',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            overflow: 'visible'
          }}>
            <span style={{ display: 'inline-block', paddingBottom: '0.1em' }}>
              {t.hero.titleStart}
            </span>
            <br />
            <span style={{
              display: 'inline-block',
              paddingBottom: '0.15em',
              color: 'var(--primary, #0b62a4)'
            }}>
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="reveal stagger-2" style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.22rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '760px',
            margin: '0 auto 2.5rem auto'
          }}>
            {typeof t.hero.subtitle === 'string' && t.hero.subtitle.includes('**') ? (
              t.hero.subtitle.split('**').map((chunk, i) =>
                i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 700 }}>{chunk}</strong> : chunk
              )
            ) : (
              t.hero.subtitle
            )}
          </p>

          {/* Action Buttons with Glowing Pulse & Shine */}
          <div className="reveal stagger-3" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.15rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <a
              href="#donate"
              className="btn btn-accent btn-glow-pulse btn-shine"
              style={{
                fontSize: '0.98rem',
                width: 'min(265px, 86vw)',
                height: '52px',
                padding: '0 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 800,
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                textAlign: 'center',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap'
              }}
            >
              <Heart size={18} />
              <span>{t.hero.btnDonateNow}</span>
            </a>
            <a
              href="#initiatives"
              className="btn btn-outline tilt-card"
              style={{
                fontSize: '0.98rem',
                width: 'min(265px, 86vw)',
                height: '52px',
                padding: '0 1rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(11, 98, 164, 0.3)',
                textAlign: 'center',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{t.hero.btnGetInvolved}</span>
              <ArrowRight size={17} />
            </a>
          </div>

          {/* Metric Stats Banner with Glassmorphic Tilt Cards - Staggered Scroll Reveal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.35rem',
            marginTop: '1.5rem'
          }}>
            {/* Stat 1 */}
            <div className="glass-panel tilt-card hero-stat-card reveal stagger-1" style={{
              padding: '1.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.78) 0%, rgba(186, 230, 253, 0.45) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 8px 24px -4px rgba(11, 98, 164, 0.12)'
            }}>
              <div className="micro-float" style={{
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                color: 'var(--primary)',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(11, 98, 164, 0.18)'
              }}>
                <HandHeart size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
                  <AnimatedCounter value={stat1Number} />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>
                  {stat1Label}
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel tilt-card hero-stat-card reveal stagger-2" style={{
              padding: '1.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.78) 0%, rgba(253, 230, 138, 0.45) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.12)'
            }}>
              <div className="micro-float" style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#b45309',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
              }}>
                <Users size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#b45309', lineHeight: 1.1 }}>
                  <AnimatedCounter value={stat2Number} />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>
                  {stat2Label}
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel tilt-card hero-stat-card reveal stagger-3" style={{
              padding: '1.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.78) 0%, rgba(187, 247, 208, 0.45) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(34, 197, 94, 0.35)',
              boxShadow: '0 8px 24px -4px rgba(22, 163, 74, 0.12)'
            }}>
              <div className="micro-float" style={{
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                color: '#15803d',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}>
                <Heart size={28} />
              </div>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803d', lineHeight: 1.1 }}>
                  <AnimatedCounter value={stat3Number} />
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>
                  {stat3Label}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
