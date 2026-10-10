import React from 'react';
import { Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AboutSection({ t }) {
  return (
    <section id="about" className="section section-bg-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header reveal" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">{t.about.title}</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Real photo & Verification badge */}
          <div className="reveal-left" style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 20px 35px -10px rgba(11, 98, 164, 0.25)',
              position: 'relative'
            }}>
              <img
                src="/about_initiative.jpg"
                alt="Sonya providing hospital and healthcare assistance in Palghar"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
                onError={(e) => {
                  e.target.src = '/img1.jpeg';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 100%)',
                padding: '2rem 1.5rem 1.25rem 1.5rem',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 700 }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent-green)' }} />
                  <span>प्रत्यक्ष मदत व रुग्णालय सहाय्य | पालघर</span>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                  माणुसकीची साथ, मदतीचा हात — सोन्या व टीम
                </div>
              </div>
            </div>

            {/* Floating Trust Card with Slow Gentle Float Animation */}
            <div className="slow-float" style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'var(--light-surface)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1.15rem',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.16)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              border: '1px solid var(--border-color)',
              zIndex: 2,
              backdropFilter: 'blur(8px)'
            }}>
              <Award size={28} style={{ color: 'var(--accent-saffron)' }} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>पालघर समाजसेवा</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payal Foundation</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="reveal-right">
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              {t.about.p1}
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {t.about.p2}
            </p>

            {/* Core Pillars with Glassmorphic Tilt Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="glass-panel tilt-card reveal-right stagger-1" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.15rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--primary)',
              }}>
                <div style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {t.about.value1Title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {t.about.value1Desc}
                  </p>
                </div>
              </div>

              <div className="glass-panel tilt-card reveal-right stagger-2" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.15rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-saffron)',
              }}>
                <div style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {t.about.value2Title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {t.about.value2Desc}
                  </p>
                </div>
              </div>

              <div className="glass-panel tilt-card reveal-right stagger-3" style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.15rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--accent-green)',
              }}>
                <div style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '0.6rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {t.about.value3Title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                    {t.about.value3Desc}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
