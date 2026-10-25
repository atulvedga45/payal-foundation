import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, ArrowUpRight, ChevronLeft, ChevronRight, Calendar, X, Target, TrendingUp, Tag } from 'lucide-react';
import { getImageUrl } from '../api';

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

/* ── Initiative Detail Modal ── */
function InitiativeModal({ item, idx, lang, t, onClose, onSelectCause }) {
  const title = lang === 'mr' && item.title_mr ? item.title_mr : item.title;
  const desc  = lang === 'mr' && item.description_mr ? item.description_mr : item.description;

  const defaultDate = lang === 'mr'
    ? DEFAULT_DATES_MR[idx % DEFAULT_DATES_MR.length]
    : DEFAULT_DATES_EN[idx % DEFAULT_DATES_EN.length];
  const dateText = item.date || defaultDate;

  const percentage = item.target_amount > 0
    ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100)
    : 65;

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="initiative-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="initiative-modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button className="initiative-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Hero Image */}
        <div className="initiative-modal-img-wrap">
          <img
            src={getImageUrl(item.image_url) || '/img1.jpeg'}
            alt={title}
            className="initiative-modal-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80';
            }}
          />
        </div>

        {/* Content */}
        <div className="initiative-modal-content">

          {/* Date */}
          <div className="initiative-modal-date">
            <Calendar size={14} />
            <span>{dateText}</span>
          </div>

          {/* Title */}
          <h2 className="initiative-modal-title">{title}</h2>

          {/* Description */}
          {desc ? (
            <p className="initiative-modal-desc">{desc}</p>
          ) : (
            <p className="initiative-modal-desc" style={{ fontStyle: 'italic', opacity: 0.6 }}>
              {lang === 'mr' ? 'या उपक्रमाबद्दल अधिक माहिती लवकरच उपलब्ध होईल.' : 'More details about this initiative will be available soon.'}
            </p>
          )}

          {/* Minimum Expense (कमीत कमी खर्च) */}
          <div style={{
            background: 'var(--light-bg, #f8fafc)',
            border: '1.5px solid var(--border-color, #e2e8f0)',
            borderRadius: '12px',
            padding: '0.75rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(37, 99, 235, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary, #2563eb)'
              }}>
                <Target size={18} />
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted, #64748b)' }}>
                {lang === 'mr' ? 'कमीत कमी खर्च' : 'Minimum Expense'}
              </span>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
              ₹{(item.target_amount || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Donate Button */}
          <a
            href="#donate"
            onClick={(e) => { e.stopPropagation(); onSelectCause(title); onClose(); }}
            className="btn btn-primary btn-glow-pulse btn-shine initiative-modal-donate-btn"
          >
            <Heart size={16} style={{ fill: '#fff', color: '#fff' }} />
            {t.initiatives.donateForThis}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function InitiativesSection({ t, initiatives, onSelectCause, lang }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [modalItem, setModalItem]           = useState(null); // { item, idx }

  const openModal  = useCallback((item, idx) => setModalItem({ item, idx }), []);
  const closeModal = useCallback(() => setModalItem(null), []);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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

        {/* Carousel */}
        <div className="initiatives-carousel-wrapper">
          <button
            type="button"
            className="carousel-nav-btn prev-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous initiatives"
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          <div className="initiatives-track" ref={carouselRef}>
            {initiatives.map((item, idx) => {
              const percentage = item.target_amount > 0
                ? Math.min(Math.round((item.raised_amount / item.target_amount) * 100), 100)
                : 65;

              const title = lang === 'mr' && item.title_mr ? item.title_mr : item.title;

              const defaultDate = lang === 'mr'
                ? DEFAULT_DATES_MR[idx % DEFAULT_DATES_MR.length]
                : DEFAULT_DATES_EN[idx % DEFAULT_DATES_EN.length];
              const dateText = item.date || defaultDate;

              return (
                <div
                  key={`initiative-${item.id ?? 'item'}-${idx}`}
                  className={`card initiative-card glass-panel tilt-card reveal stagger-${(idx % 4) + 1}`}
                  style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  onClick={() => openModal(item, idx)}
                  title={lang === 'mr' ? 'अधिक माहितीसाठी क्लिक करा' : 'Click for details'}
                >
                  {/* Image */}
                  <div className="img-zoom-container initiative-img-box">
                    <img
                      src={getImageUrl(item.image_url) || '/img1.jpeg'}
                      alt={title}
                      className="initiative-photo"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="initiative-category-badge">
                      {item.category || (lang === 'mr' ? 'समाजकार्य' : 'Social Service')}
                    </div>
                    {/* Click hint */}
                    <div className="initiative-click-hint">
                      {lang === 'mr' ? 'माहिती पाहा ↗' : 'View Details ↗'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="initiative-card-body">
                    <div className="initiative-date-row">
                      <Calendar size={13} className="initiative-cal-icon" />
                      <span>{dateText}</span>
                    </div>

                    <h3 className="initiative-title">{title}</h3>

                    {/* Progress */}
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

                      {/* Donate Button */}
                      <a
                        href="#donate"
                        onClick={(e) => { e.stopPropagation(); onSelectCause(title); }}
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

      {/* Modal */}
      {modalItem && (
        <InitiativeModal
          item={modalItem.item}
          idx={modalItem.idx}
          lang={lang}
          t={t}
          onClose={closeModal}
          onSelectCause={onSelectCause}
        />
      )}

      {/* Styles */}
      <style>{`
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

        .initiatives-track::-webkit-scrollbar { display: none; }

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
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .initiative-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px -8px rgba(11, 98, 164, 0.2), 0 8px 16px -4px rgba(0,0,0,0.06);
          border-color: rgba(11, 98, 164, 0.4);
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
          transition: transform 0.4s ease;
        }

        .initiative-card:hover .initiative-photo {
          transform: scale(1.06);
        }

        /* Click hint overlay */
        .initiative-click-hint {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(11,98,164,0.82));
          color: #fff;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.6rem 0.75rem 0.5rem;
          letter-spacing: 0.04em;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .initiative-card:hover .initiative-click-hint {
          opacity: 1;
        }

        .initiative-category-badge {
          position: absolute;
          top: 12px; left: 12px;
          background-color: rgba(255,255,255,0.95);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
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
          background: rgba(11,98,164,0.06);
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

        .initiative-card-bottom { margin-top: auto; }

        .initiative-progress-section { margin-bottom: 1.15rem; }

        .initiative-amounts {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .initiative-amounts span { color: var(--text-muted); }
        .initiative-amounts .amount-raised strong { color: var(--primary); }

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

        .initiative-donate-btn .btn-text-short { display: none; }

        /* ═══════════════════════════════════════
           INITIATIVE MODAL
        ═══════════════════════════════════════ */
        .initiative-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(5, 15, 35, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: modalFadeIn 0.25s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .initiative-modal-box {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 540px;
          max-height: 94vh;
          overflow: hidden;
          box-shadow: 0 32px 80px -8px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1);
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalSlideUp {
          from { transform: translateY(40px) scale(0.96); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }

        [data-theme="dark"] .initiative-modal-box {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .initiative-modal-close {
          position: absolute;
          top: 14px; right: 14px;
          z-index: 20;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          color: #374151;
          transition: all 0.2s ease;
        }

        .initiative-modal-close:hover {
          background: #ef4444;
          color: #fff;
          transform: scale(1.1);
        }

        .initiative-modal-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }

        .initiative-modal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
        }

        .initiative-modal-category-badge {
          position: absolute;
          top: 14px; left: 14px;
          background: rgba(255,255,255,0.95);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.8rem;
          border-radius: 9999px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.14);
          display: flex;
          align-items: center;
        }

        .initiative-modal-pct-badge {
          position: absolute;
          bottom: 14px; right: 14px;
          background: var(--primary);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(11,98,164,0.45);
          letter-spacing: 0.03em;
        }

        .initiative-modal-content {
          padding: 1.5rem 1.75rem 2rem;
        }

        .initiative-modal-date {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(11,98,164,0.08);
          padding: 0.25rem 0.7rem;
          border-radius: 7px;
          margin-bottom: 0.85rem;
        }

        .initiative-modal-title {
          font-size: 1.45rem;
          font-weight: 900;
          color: var(--text-main);
          line-height: 1.3;
          margin-bottom: 0.9rem;
        }

        [data-theme="dark"] .initiative-modal-title { color: #f1f5f9; }

        .initiative-modal-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        /* Stats Row */
        .initiative-modal-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .initiative-modal-stat-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.85rem 1rem;
        }

        [data-theme="dark"] .initiative-modal-stat-card {
          background: rgba(30,41,59,0.8);
          border-color: rgba(255,255,255,0.08);
        }

        .initiative-modal-stat-icon { flex-shrink: 0; }
        .raised-icon { color: #0b62a4; }
        .goal-icon   { color: #f59e0b; }

        .initiative-modal-stat-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.15rem;
        }

        .initiative-modal-stat-value {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-main);
        }

        [data-theme="dark"] .initiative-modal-stat-value { color: #f1f5f9; }
        .raised-value { color: var(--primary) !important; }

        /* Progress */
        .initiative-modal-progress-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .initiative-modal-progress-track {
          flex: 1;
          height: 10px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
        }

        [data-theme="dark"] .initiative-modal-progress-track { background: rgba(255,255,255,0.1); }

        .initiative-modal-progress-fill {
          height: 100%;
          background: var(--primary-gradient);
          border-radius: 9999px;
          transition: width 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .initiative-modal-progress-label {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--primary);
          min-width: 38px;
          text-align: right;
        }

        /* Donate Button in modal */
        .initiative-modal-donate-btn {
          width: 100%;
          padding: 0.9rem 1.5rem;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          border-radius: 14px;
          letter-spacing: 0.02em;
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 1100px) {
          .initiatives-track .initiative-card {
            flex: 0 0 calc((100% - 1.15rem) / 2);
            min-width: calc((100% - 1.15rem) / 2);
            max-width: calc((100% - 1.15rem) / 2);
          }
        }

        @media (max-width: 640px) {
          .initiatives-carousel-wrapper { padding: 0 28px; }
          .initiatives-track { gap: 0.85rem; padding: 0.4rem 0.1rem 0.9rem 0.1rem; }

          .initiatives-track .initiative-card {
            flex: 0 0 100%;
            min-width: 100%;
            max-width: 100%;
            border-radius: 16px;
          }

          .initiative-img-box { height: 160px; }

          .initiative-click-hint {
            opacity: 1;
            font-size: 0.7rem;
          }

          .initiative-modal-img-wrap { height: 200px; }
          .initiative-modal-content  { padding: 1.1rem 1.2rem 1.5rem; }
          .initiative-modal-title    { font-size: 1.15rem; }
          .initiative-modal-stats    { flex-direction: column; gap: 0.6rem; }

          .carousel-nav-btn { width: 32px; height: 32px; }
          .carousel-nav-btn svg { width: 18px; height: 18px; }
          .carousel-nav-btn.prev-btn { left: -4px; }
          .carousel-nav-btn.next-btn { right: -4px; }
        }

        @media (max-width: 380px) {
          .initiatives-carousel-wrapper { padding: 0 24px; }
          .initiatives-track .initiative-card { border-radius: 14px; }
          .initiative-img-box { height: 140px; }
          .initiative-modal-title { font-size: 1rem; }
          .carousel-nav-btn { width: 28px; height: 28px; }
          .carousel-nav-btn svg { width: 16px; height: 16px; }
          .carousel-nav-btn.prev-btn { left: -6px; }
          .carousel-nav-btn.next-btn { right: -6px; }
        }

        /* Nav buttons */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #ffffff;
          color: var(--primary);
          border: 2px solid rgba(11,98,164,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(11,98,164,0.2);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .carousel-nav-btn:hover:not(:disabled) {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 24px rgba(11,98,164,0.38);
        }

        .carousel-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: translateY(-50%) scale(0.95);
          box-shadow: none;
        }

        .carousel-nav-btn.prev-btn { left: 0px; }
        .carousel-nav-btn.next-btn { right: 0px; }

        .initiative-card.in-view {
          transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
      `}</style>
    </section>
  );
}
