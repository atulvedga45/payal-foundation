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
                  <div className="img-zoom-container initiative-img-box">
                    <img
                      src={item.image_url || '/img1.jpeg'}
                      alt={title}
                      className="initiative-photo"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {/* Category Tag on Left */}
                    <div className="initiative-category-badge">
                      {item.category || (lang === 'mr' ? 'समाजकार्य' : 'Social Service')}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="initiative-card-body">
                    
                    {/* Date Row */}
                    <div className="initiative-date-row">
                      <Calendar size={13} className="initiative-cal-icon" />
                      <span>{dateText}</span>
                    </div>

                    {/* Title */}
                    <h3 className="initiative-title">
                      {title}
                    </h3>

                    {/* Description (Desktop / Tablet) */}
                    {desc && (
                      <p className="initiative-desc">
                        {desc}
                      </p>
                    )}

                    {/* Bottom Section: Progress & Action Button */}
                    <div className="initiative-card-bottom">
                      <div className="initiative-progress-section">
                        <div className="initiative-amounts">
                          <span className="amount-raised">
                            {t.initiatives.raised}: <strong>₹{(item.raised_amount || 0).toLocaleString('en-IN')}</strong>
                          </span>
                          <span className="amount-goal">
                            {t.initiatives.goal}: ₹{(item.target_amount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="initiative-progress-track">
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
                        className="btn btn-outline btn-shine initiative-donate-btn"
                      >
                        <Heart size={14} className="btn-heart-icon" style={{ color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} />
                        <span className="btn-text-full">{t.initiatives.donateForThis}</span>
                        <span className="btn-text-short">{lang === 'mr' ? 'मदत करा' : 'Donate'}</span>
                        <ArrowUpRight size={14} className="btn-arrow-icon" />
                      </a>
                    </div>
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
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .initiative-img-box {
          height: 190px;
          position: relative;
          overflow: hidden;
        }

        .initiative-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
        }

        .initiative-category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .initiative-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .initiative-date-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--primary);
          font-weight: 700;
          margin-bottom: 0.45rem;
          background: rgba(11, 98, 164, 0.06);
          padding: 0.22rem 0.55rem;
          border-radius: 6px;
          width: fit-content;
        }

        .initiative-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.65rem;
          line-height: 1.3;
        }

        .initiative-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.55;
          flex-grow: 1;
          margin-bottom: 1.15rem;
        }

        .initiative-card-bottom {
          margin-top: auto;
        }

        .initiative-progress-section {
          margin-bottom: 1.15rem;
        }

        .initiative-amounts {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .initiative-amounts span {
          color: var(--text-muted);
        }

        .initiative-amounts .amount-raised strong {
          color: var(--primary);
        }

        .initiative-progress-track {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .initiative-donate-btn {
          width: 100%;
          padding: 0.65rem 1rem;
          font-size: 0.88rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          border-radius: 10px;
        }

        .initiative-donate-btn .btn-text-short {
          display: none;
        }

        @media (max-width: 1100px) {
          .initiatives-track .initiative-card {
            flex: 0 0 calc((100% - 1.15rem) / 2);
            min-width: calc((100% - 1.15rem) / 2);
            max-width: calc((100% - 1.15rem) / 2);
          }
        }

        /* 2 Cards in 1 Row on Mobile Screens */
        @media (max-width: 640px) {
          .initiatives-carousel-wrapper {
            padding: 0 20px;
          }

          .initiatives-track {
            gap: 0.65rem;
            padding: 0.4rem 0.1rem 0.9rem 0.1rem;
          }

          .initiatives-track .initiative-card {
            flex: 0 0 calc((100% - 0.65rem) / 2);
            min-width: calc((100% - 0.65rem) / 2);
            max-width: calc((100% - 0.65rem) / 2);
            border-radius: 14px;
          }

          .initiative-img-box {
            height: 105px;
          }

          .initiative-category-badge {
            top: 6px;
            left: 6px;
            padding: 0.15rem 0.45rem;
            font-size: 0.62rem;
          }

          .initiative-card-body {
            padding: 0.65rem 0.5rem 0.65rem 0.5rem;
          }

          .initiative-date-row {
            font-size: 0.64rem;
            padding: 0.14rem 0.38rem;
            gap: 0.22rem;
            margin-bottom: 0.35rem;
            border-radius: 5px;
          }

          .initiative-date-row svg,
          .initiative-date-row .initiative-cal-icon {
            width: 10px;
            height: 10px;
          }

          .initiative-title {
            font-size: 0.82rem;
            line-height: 1.24;
            margin-bottom: 0.35rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 2.1em;
          }

          .initiative-desc {
            display: none;
          }

          .initiative-progress-section {
            margin-bottom: 0.55rem;
          }

          .initiative-amounts {
            font-size: 0.64rem;
            margin-bottom: 0.28rem;
            flex-direction: column;
            gap: 0.1rem;
          }

          .initiative-amounts span {
            font-size: 0.62rem;
            line-height: 1.2;
          }

          .initiative-progress-track {
            height: 5px;
          }

          .initiative-donate-btn {
            padding: 0.38rem 0.45rem;
            font-size: 0.72rem;
            gap: 0.25rem;
            border-radius: 8px;
          }

          .initiative-donate-btn .btn-text-full {
            display: none;
          }

          .initiative-donate-btn .btn-text-short {
            display: inline;
            white-space: nowrap;
          }

          .initiative-donate-btn svg,
          .initiative-donate-btn .btn-heart-icon,
          .initiative-donate-btn .btn-arrow-icon {
            width: 11px;
            height: 11px;
            flex-shrink: 0;
          }

          .carousel-nav-btn {
            width: 30px;
            height: 30px;
          }

          .carousel-nav-btn svg {
            width: 17px;
            height: 17px;
          }

          .carousel-nav-btn.prev-btn {
            left: -4px;
          }

          .carousel-nav-btn.next-btn {
            right: -4px;
          }
        }

        @media (max-width: 380px) {
          .initiatives-carousel-wrapper {
            padding: 0 16px;
          }

          .initiatives-track {
            gap: 0.45rem;
          }

          .initiatives-track .initiative-card {
            flex: 0 0 calc((100% - 0.45rem) / 2);
            min-width: calc((100% - 0.45rem) / 2);
            max-width: calc((100% - 0.45rem) / 2);
            border-radius: 12px;
          }

          .initiative-img-box {
            height: 94px;
          }

          .initiative-category-badge {
            font-size: 0.56rem;
            padding: 0.12rem 0.35rem;
          }

          .initiative-card-body {
            padding: 0.5rem 0.4rem 0.55rem 0.4rem;
          }

          .initiative-date-row {
            font-size: 0.58rem;
            padding: 0.1rem 0.3rem;
          }

          .initiative-title {
            font-size: 0.76rem;
          }

          .initiative-amounts span {
            font-size: 0.56rem;
          }

          .initiative-donate-btn {
            font-size: 0.65rem;
            padding: 0.32rem 0.35rem;
          }

          .carousel-nav-btn {
            width: 26px;
            height: 26px;
          }

          .carousel-nav-btn svg {
            width: 15px;
            height: 15px;
          }

          .carousel-nav-btn.prev-btn {
            left: -6px;
          }

          .carousel-nav-btn.next-btn {
            right: -6px;
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
