import React, { useRef, useState, useEffect } from 'react';
import { Heart, ArrowUpRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DEFAULT_DATES_MR = [
  '१० मार्च २०२६',
  '२५ फेब्रुवारी २०२६',
  '१४ जानेवारी २०२६',
  '२८ डिसेंबर २०२५',
  '१५ नोव्हेंबर २०२५',
  '०२ ऑक्टोबर २०२५'
];

const DEFAULT_DATES_EN = [
  '10 March 2026',
  '25 February 2026',
  '14 January 2026',
  '28 December 2025',
  '15 November 2025',
  '02 October 2025'
];

export default function InitiativesSection({ t, initiatives, onSelectCause, lang }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll to start whenever a new card is added so it's immediately visible
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      checkScroll();
    }
  }, [initiatives?.length]);

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [initiatives]);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const card = carouselRef.current.firstElementChild;
      const cardWidth = card ? card.clientWidth + 18 : 280;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="initiatives" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header reveal" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title">{t.initiatives.title}</h2>
          <p className="section-subtitle">{t.initiatives.subtitle}</p>
        </div>

        {/* Carousel Container with dedicated spacing for arrows so they NEVER touch cards */}
        <div className="initiatives-carousel-wrapper">
          {/* Left Arrow Button (Positioned safely outside cards) */}
          <button
            type="button"
            className="carousel-nav-btn prev-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous initiatives"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          {/* Scrollable Track - Exactly 4 cards in 1 line on desktop */}
          <div className="initiatives-track" ref={carouselRef}>
            {initiatives.map((item, idx) => {
              const percentage = item.target_amount > 0 
                ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100) 
                : 65;

              const title = lang === 'mr' && item.title_mr ? item.title_mr : item.title;
              const desc = lang === 'mr' && item.description_mr ? item.description_mr : item.description;

              const defaultDate = lang === 'mr'
                ? DEFAULT_DATES_MR[idx % DEFAULT_DATES_MR.length]
                : DEFAULT_DATES_EN[idx % DEFAULT_DATES_EN.length];
              const dateText = item.date || defaultDate;

              return (
                <div
                  key={`initiative-${item.id ?? 'item'}-${idx}`}
                  className={`card initiative-card glass-panel tilt-card reveal stagger-${(idx % 4) + 1}`}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {/* Image Container */}
                  <div className="img-zoom-container" style={{ height: '190px', position: 'relative' }}>
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

                    {/* Category Tag on Left */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                    }}>
                      {item.category || (lang === 'mr' ? 'समाजकार्य' : 'Social Service')}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    
                    {/* Date Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.78rem',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      marginBottom: '0.45rem',
                      background: 'rgba(11, 98, 164, 0.06)',
                      padding: '0.22rem 0.55rem',
                      borderRadius: '6px',
                      width: 'fit-content'
                    }}>
                      <Calendar size={13} />
                      <span>{dateText}</span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem', lineHeight: 1.3 }}>
                      {title}
                    </h3>

                    {/* Description */}
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, flexGrow: 1, marginBottom: '1.15rem' }}>
                      {desc}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1.15rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {t.initiatives.raised}: <strong style={{ color: 'var(--primary)' }}>₹{(item.raised_amount || 0).toLocaleString('en-IN')}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {t.initiatives.goal}: ₹{(item.target_amount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          className="progress-bar-animated"
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'var(--primary-gradient)',
                            borderRadius: '9999px',
                            transition: 'width 0.8s ease'
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <a
                      href="#donate"
                      onClick={() => onSelectCause(title)}
                      className="btn btn-outline btn-shine"
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

          {/* Right Arrow Button (Positioned safely outside cards) */}
          <button
            type="button"
            className="carousel-nav-btn next-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next initiatives"
          >
            <ChevronRight size={24} strokeWidth={2.4} />
          </button>
        </div>

      </div>

      {/* Carousel & Responsive Styles */}
      <style>{`
        /* Dedicated side padding ensures arrows sit completely outside cards with zero overlap */
        .initiatives-carousel-wrapper {
          position: relative;
          padding: 0 46px;
        }

        .initiatives-track {
          display: flex;
          gap: 1.15rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.75rem 0.25rem 1.25rem 0.25rem;
        }

        .initiatives-track::-webkit-scrollbar {
          display: none;
        }

        /* Exactly 4 cards in 1 line on desktop (gap is 1.15rem = ~18.4px, 3 gaps = ~55.2px = 3.45rem) */
        .initiatives-track .initiative-card {
          flex: 0 0 calc((100% - 3.45rem) / 4);
          min-width: calc((100% - 3.45rem) / 4);
          max-width: calc((100% - 3.45rem) / 4);
          scroll-snap-align: start;
        }

        @media (max-width: 1100px) {
          .initiatives-track .initiative-card {
            flex: 0 0 calc((100% - 1.15rem) / 2);
            min-width: calc((100% - 1.15rem) / 2);
            max-width: calc((100% - 1.15rem) / 2);
          }
        }

        @media (max-width: 640px) {
          .initiatives-carousel-wrapper {
            padding: 0 32px;
          }
          .initiatives-track .initiative-card {
            flex: 0 0 88%;
            min-width: 88%;
            max-width: 88%;
          }
        }

        /* Floating Navigation Arrows - Placed completely outside cards */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          color: var(--primary);
          border: 2px solid rgba(11, 98, 164, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(11, 98, 164, 0.2);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-nav-btn:hover:not(:disabled) {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(11, 98, 164, 0.38);
        }

        .carousel-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: translateY(-50%) scale(0.95);
          box-shadow: none;
        }

        .carousel-nav-btn.prev-btn {
          left: 0px;
        }

        .carousel-nav-btn.next-btn {
          right: 0px;
        }

        @media (max-width: 640px) {
          .carousel-nav-btn {
            width: 32px;
            height: 32px;
          }
          .carousel-nav-btn.prev-btn {
            left: 0px;
          }
          .carousel-nav-btn.next-btn {
            right: 0px;
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
