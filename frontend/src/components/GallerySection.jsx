import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X } from 'lucide-react';

export default function GallerySection({ t, gallery = [], lang = 'mr' }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const viewportRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(290);

  // Manage body scroll lock, hide navbar via .modal-open, and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };

    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  // Dynamically compute card width so exactly 4 cards fit edge-to-edge on desktop
  useEffect(() => {
    const updateCardWidth = () => {
      if (viewportRef.current) {
        const containerWidth = viewportRef.current.clientWidth;
        const gap = 20; // 20px gap
        let visibleCount = 4;
        if (containerWidth < 520) {
          visibleCount = 1.25;
        } else if (containerWidth < 768) {
          visibleCount = 2;
        } else if (containerWidth < 1024) {
          visibleCount = 3;
        } else {
          visibleCount = 4;
        }
        const calculated = (containerWidth - (Math.floor(visibleCount) - 1) * gap) / visibleCount;
        setCardWidth(Math.max(220, Math.floor(calculated)));
      }
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  const fallbackItems = [
    {
      image_url: '/about_initiative.jpg',
      title: 'Emergency Medical & Hospital Assistance in Palghar',
      title_mr: 'माणुसकीची साथ: गरजू बाबांना रुग्णालयात नेऊन उपचारासाठी मदत',
      category: 'Healthcare & Compassion',
      category_mr: 'आरोग्य व रुग्णसेवा'
    },
    {
      image_url: '/community_outreach.jpg',
      title: 'Field Social Work & Community Outreach',
      title_mr: 'विश्वस्त व स्वयंसेवकांचा प्रत्यक्ष सेवा उपक्रम',
      category: 'Social Service',
      category_mr: 'सामाजिक कार्य',
      objectPosition: 'center 20%'
    },
    {
      image_url: '/child_healthcare_hospital.jpg',
      title: 'Child Healthcare & Patient Care Support in Hospital',
      title_mr: 'रुग्णालय सहाय्य: बालकांवर उपचार व माणुसकीचा आधार',
      category: 'Healthcare Support',
      category_mr: 'रुग्णालय सहाय्य',
      objectPosition: 'center 45%'
    },
    {
      image_url: '/women_empowerment.jpg',
      title: 'Women Support & Community Assistance',
      title_mr: 'महिला सबलीकरण व प्रत्यक्ष मदत उपक्रम',
      category: 'Women Welfare',
      category_mr: 'महिला कल्याण',
      objectPosition: 'center 35%'
    }
  ];

  const rawItems = gallery && gallery.length > 0 ? gallery : fallbackItems;
  const sortedItems = [...rawItems].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  // Ensure base set has at least 8 items for a generous, seamless continuous scroll loop
  let baseSet = sortedItems;
  if (baseSet.length > 0 && baseSet.length < 8) {
    baseSet = [...baseSet, ...baseSet];
    if (baseSet.length < 8) {
      baseSet = [...baseSet, ...baseSet];
    }
  }

  const renderCard = (item, uniqueKey) => {
    const imgSrc = item.image_url || item.src;
    const itemTitle = (lang === 'mr' && item.title_mr) ? item.title_mr : (item.title || item.title_mr || '');
    const itemCategory = (lang === 'mr' && item.category_mr) ? item.category_mr : (item.category || item.category_mr || 'Social Service');

    return (
      <div
        key={uniqueKey}
        className="card gallery-scroll-card"
        style={{
          width: `${cardWidth}px`,
          height: '280px',
          flexShrink: 0,
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
        onClick={() => setSelectedImage({ ...item, imgSrc, itemTitle, itemCategory })}
      >
        <img
          src={imgSrc}
          alt={itemTitle}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: item.objectPosition || 'center 25%',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1.0)')}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Overlay with info */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: '#ffffff'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-saffron)',
            marginBottom: '0.35rem'
          }}>
            <ZoomIn size={14} />
            <span>{itemCategory}</span>
          </div>
          <h4 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.35,
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {itemTitle}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <section id="gallery" className="section">
      <div className="container">
        
        {/* Header without badge */}
        <div className="section-header reveal" style={{ marginBottom: '2.5rem' }}>
          <h2 className="section-title">{t.gallery.title}</h2>
          <p className="section-subtitle">{t.gallery.subtitle}</p>
        </div>

        {/* Continuous Infinite Auto-Scrolling Carousel (4 cards per view on desktop) */}
        <div className="gallery-carousel-wrapper">
          <div className="gallery-fade-edge gallery-fade-left" />
          <div className="gallery-fade-edge gallery-fade-right" />

          <div className="gallery-marquee-viewport" ref={viewportRef}>
            <div className="gallery-marquee-inner">
              {/* Group 1 */}
              <div className="gallery-marquee-group">
                {baseSet.map((item, idx) => renderCard(item, `g1-${item.id || idx}-${idx}`))}
              </div>
              {/* Group 2 (duplicate for seamless continuous loop) */}
              <div className="gallery-marquee-group" aria-hidden="true">
                {baseSet.map((item, idx) => renderCard(item, `g2-${item.id || idx}-${idx}`))}
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal Portaled to document.body */}
        {selectedImage && createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backdropFilter: 'blur(8px)',
              animation: 'modalFadeIn 0.25s ease-out'
            }}
            onClick={() => setSelectedImage(null)}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '850px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <X size={20} />
              </button>
              <img
                src={selectedImage.imgSrc || selectedImage.image_url || selectedImage.src}
                alt={selectedImage.itemTitle || selectedImage.title}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
              />
              <div style={{ padding: '1.25rem' }}>
                <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>
                  {selectedImage.itemCategory || selectedImage.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {selectedImage.itemTitle || selectedImage.title_mr || selectedImage.title}
                </h3>
              </div>
            </div>
          </div>,
          document.body
        )}

      </div>
    </section>
  );
}
