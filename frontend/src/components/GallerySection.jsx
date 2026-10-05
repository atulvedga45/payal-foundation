import React, { useState } from 'react';
import { Camera, ZoomIn, X } from 'lucide-react';

export default function GallerySection({ t }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      src: '/about_initiative.jpg',
      title: 'Emergency Medical & Hospital Assistance in Palghar',
      title_mr: 'माणुसकीची साथ: गरजू बाबांना रुग्णालयात नेऊन उपचारासाठी मदत',
      category: 'Healthcare & Compassion'
    },
    {
      src: '/community_outreach.jpg',
      title: 'Field Social Work & Community Outreach',
      title_mr: 'विश्वस्त व स्वयंसेवकांचा प्रत्यक्ष सेवा उपक्रम',
      category: 'Social Service',
      objectPosition: 'center 20%'
    },
    {
      src: '/child_healthcare_hospital.jpg',
      title: 'Child Healthcare & Patient Care Support in Hospital',
      title_mr: 'रुग्णालय सहाय्य: बालकांवर उपचार व माणुसकीचा आधार',
      category: 'Healthcare Support',
      objectPosition: 'center 45%'
    },
    {
      src: '/women_empowerment.jpg',
      title: 'Women Support & Community Assistance',
      title_mr: 'महिला सबलीकरण व प्रत्यक्ष मदत उपक्रम',
      category: 'Women Welfare',
      objectPosition: 'center 35%'
    }
  ];

  return (
    <section id="gallery" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <Camera size={15} />
            <span>{t.gallery.badge}</span>
          </div>
          <h2 className="section-title">{t.gallery.title}</h2>
          <p className="section-subtitle">{t.gallery.subtitle}</p>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.75rem'
        }}>
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className={`card reveal-scale stagger-${(idx % 4) + 1}`}
              style={{
                position: 'relative',
                height: '280px',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.src}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: item.objectPosition || 'center 25%',
                  transition: 'transform 0.4s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80';
                }}
              />
              
              {/* Overlay with info */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
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
                  marginBottom: '0.25rem'
                }}>
                  <ZoomIn size={14} />
                  <span>{item.category}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              backdropFilter: 'blur(5px)'
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
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
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
                src={selectedImage.src}
                alt={selectedImage.title}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
              />
              <div style={{ padding: '1.25rem' }}>
                <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>{selectedImage.category}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {selectedImage.title}
                </h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
