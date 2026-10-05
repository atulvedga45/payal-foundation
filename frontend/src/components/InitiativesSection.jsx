import React from 'react';
import { Target, Heart, ArrowUpRight } from 'lucide-react';

export default function InitiativesSection({ t, initiatives, onSelectCause, lang }) {
  return (
    <section id="initiatives" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <Target size={15} />
            <span>{t.initiatives.badge}</span>
          </div>
          <h2 className="section-title">{t.initiatives.title}</h2>
          <p className="section-subtitle">{t.initiatives.subtitle}</p>
        </div>

        {/* 4 Cards in 1 Line Grid */}
        <div className="initiatives-grid">
          {initiatives.map((item, idx) => {
            const percentage = item.target_amount > 0 
              ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
              : 65;

            const title = lang === 'mr' && item.title_mr ? item.title_mr : item.title;
            const desc = lang === 'mr' && item.description_mr ? item.description_mr : item.description;

            return (
              <div
                key={item.id}
                className={`card initiative-card reveal stagger-${(idx % 4) + 1}`}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {/* Image */}
                <div className="img-zoom-container" style={{ height: '195px', position: 'relative' }}>
                  <img
                    src={item.image_url || '/img1.jpeg'}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 38%',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                  }}>
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem', lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55, flexGrow: 1, marginBottom: '1.15rem' }}>
                    {desc}
                  </p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.15rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t.initiatives.raised}: <strong style={{ color: 'var(--primary)' }}>₹{item.raised_amount.toLocaleString('en-IN')}</strong>
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t.initiatives.goal}: ₹{item.target_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'var(--primary-gradient)',
                        borderRadius: '9999px',
                        transition: 'width 0.8s ease'
                      }} />
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href="#donate"
                    onClick={() => onSelectCause(title)}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      borderRadius: '10px'
                    }}
                  >
                    <Heart size={15} style={{ color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} />
                    <span>{t.initiatives.donateForThis}</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 4 Cards in 1 Line Grid Styles */}
      <style>{`
        .initiatives-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 1100px) {
          .initiatives-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
          }
        }

        @media (max-width: 600px) {
          .initiatives-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .initiative-card.in-view {
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        .initiative-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px -8px rgba(11, 98, 164, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.06);
          border-color: rgba(11, 98, 164, 0.4);
        }
      `}</style>
    </section>
  );
}
