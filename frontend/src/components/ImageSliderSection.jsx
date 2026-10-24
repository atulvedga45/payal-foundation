import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/slider/slide1.jpg',
    tag_mr: 'सामाजिक सन्मान',
    tag_en: 'Community Recognition',
    title_mr: 'विश्व हिंदू परिषद अंतर्गत बजरंग दल सफाळे - सामाजिक सत्कार',
    title_en: 'Social Service Recognition - Bajrang Dal Safale',
    desc_mr: 'पालघर परिसरातील समाजोपयोगी कार्याची दखल घेऊन युवा कार्यकर्त्यांचा सत्कार व सन्मान सोहळा.',
    desc_en: 'Honoring dedicated youth social workers for their persistent humanitarian services across Palghar.',
    location_mr: 'सफाळे, पालघर',
    location_en: 'Safale, Palghar'
  },
  {
    id: 2,
    image: '/slider/slide2.jpg',
    tag_mr: 'आपत्कालीन रुग्णसेवा',
    tag_en: 'Emergency Medical Rescue',
    title_mr: 'तातडीची रुग्णसेवा: रस्त्यावरून थेट रुग्णालयात स्ट्रेचर सहाय्य',
    title_en: 'Immediate Emergency Aid & Hospital Stretcher Rescue',
    desc_mr: 'अचानक आजारी पडलेल्या गरजू रुग्णास वेळेवर स्ट्रेचर व रुग्णवाहिकेतून रुग्णालयात पोहोचवून जीव वाचवला.',
    desc_en: 'Promptly rushing critical roadside patients to the hospital with emergency stretcher support.',
    location_mr: 'पालघर शहर',
    location_en: 'Palghar City'
  },
  {
    id: 3,
    image: '/slider/slide3.jpg',
    tag_mr: 'युवा शक्ती व समाजकार्य',
    tag_en: 'Youth Social Force',
    title_mr: 'पायल फाउंडेशनचे निष्ठावंत कार्यकर्ते व सेवाभावी टीम',
    title_en: 'Payal Foundation Dedicated Volunteers & Youth Team',
    desc_mr: 'प्रत्येक संकटसमयी मदतीसाठी धावून येणारी समाजातील जागरूक व उत्साही युवकांची मजबूत फळी.',
    desc_en: 'Our energetic and selfless youth volunteers actively supporting society during medical and crisis relief.',
    location_mr: 'पालघर',
    location_en: 'Palghar'
  },
  {
    id: 4,
    image: '/slider/slide4.jpg',
    tag_mr: 'नवीन रुग्णवाहिका लोकार्पण',
    tag_en: 'Ambulance Inauguration',
    title_mr: '२४/७ मोफत रुग्णवाहिकेचा लोकार्पण व पूजन सोहळा',
    title_en: '24/7 Free Emergency Ambulance Dedication Ceremony',
    desc_mr: 'ग्रामीण व आदिवासी बांधवांसाठी सर्व सुविधायुक्त नवीन आपत्कालीन रुग्णवाहिका सेवेत दाखल करण्यात आली.',
    desc_en: 'Inaugurating our fully-equipped 24/7 free emergency ambulance for rural & needy citizens.',
    location_mr: 'पालघर - मनोर रोड',
    location_en: 'Palghar - Manor Highway'
  },
  {
    id: 5,
    image: '/slider/slide5.jpg',
    tag_mr: 'समाजसेवक व युवा फळी',
    tag_en: 'Dedicated Youth Team',
    title_mr: 'पालघर परिसरातील निष्ठावंत समाजसेवक व युवा कार्यकर्त्यांचा गट',
    title_en: 'Dedicated Social Workers & Active Youth Group of Palghar',
    desc_mr: 'समाजातील प्रत्येक घटकाच्या मदतीसाठी सदैव तत्पर असणारे आमचे सक्रिय स्वयंसेवक व तरुण सहकारी.',
    desc_en: 'Our active volunteers and youth team united to serve the community in times of crisis and need.',
    location_mr: 'पालघर परिसर',
    location_en: 'Palghar Region'
  }
];

// Cloned extended slides for seamless smooth infinite loop
const EXTENDED_SLIDES = [
  SLIDES[SLIDES.length - 1], // Clone of last slide at beginning
  ...SLIDES,
  SLIDES[0]                  // Clone of first slide at end
];

export default function ImageSliderSection({ lang = 'mr' }) {
  // Start at index 1 (the first real slide)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const isNavigatingRef = useRef(false);

  const SLIDE_DURATION = 4000; // 4 seconds per image

  // Re-enable transition after instant loop snap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Automatic sliding with infinite loop
  useEffect(() => {
    if (!isTransitioning) return;
    const slideTimer = setTimeout(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => clearTimeout(slideTimer);
  }, [currentIndex, isTransitioning]);

  const handleNext = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    isNavigatingRef.current = false;
    // When reached the clone of the first slide at the end, snap smoothly back to real first slide
    if (currentIndex === EXTENDED_SLIDES.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // When reached the clone of the last slide at beginning, snap smoothly back to real last slide
      setIsTransitioning(false);
      setCurrentIndex(EXTENDED_SLIDES.length - 2);
    }
  };

  // Touch Swipe for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section
      id="gallery"
      className="impact-slider-section"
      aria-label="Moments of Social Service Slider"
    >
      <div className="container">
        {/* Section Heading */}
        <div className="slider-header-wrapper reveal" style={{ marginBottom: '1.75rem' }}>
          <h2 className="slider-title" style={{ color: '#000000', marginBottom: 0 }}>
            {lang === 'mr' ? (
              <>
                माणुसकीच्या सेवेतील <span style={{ color: '#000000' }}>प्रत्यक्ष क्षण</span>
              </>
            ) : (
              <>
                Moments of Compassion &amp; <span style={{ color: '#000000' }}>Direct Impact</span>
              </>
            )}
          </h2>
        </div>

        {/* Carousel Showcase Card */}
        <div
          className="slider-showcase-card"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Viewport */}
          <div className="slider-viewport">
            <div
              className="slider-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: isTransitioning
                  ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                  : 'none'
              }}
            >
              {EXTENDED_SLIDES.map((slide, idx) => (
                <div className="slider-slide" key={`slide-${idx}-${slide.id}`}>
                  <div className="slide-media-wrap">
                    <img
                      src={slide.image}
                      alt={lang === 'mr' ? slide.title_mr : slide.title_en}
                      className="slide-img"
                      loading="eager"
                    />
                    <div className="slide-gradient-overlay" />
                  </div>

                  {/* Slide Content Caption Overlay */}
                  <div className="slide-caption">
                    <div className="slide-meta-row">
                      <span className="slide-tag">
                        <HeartHandshake size={14} />
                        {lang === 'mr' ? slide.tag_mr : slide.tag_en}
                      </span>
                    </div>

                    <h3 className="slide-heading">
                      {lang === 'mr' ? slide.title_mr : slide.title_en}
                    </h3>
                    <p className="slide-text">
                      {lang === 'mr' ? slide.desc_mr : slide.desc_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Slider Indicator Dots (Pagination Circles) */}
        <div className="slider-controls-footer" style={{ margin: '1.5rem auto 0 auto', display: 'flex', justifyContent: 'center' }}>
          <div className="slider-dots-container" role="tablist" aria-label="Slider Pagination">
            {SLIDES.map((slide, idx) => {
              const activeDotIndex =
                currentIndex === 0
                  ? SLIDES.length - 1
                  : currentIndex === EXTENDED_SLIDES.length - 1
                  ? 0
                  : currentIndex - 1;
              const isActive = activeDotIndex === idx;

              return (
                <button
                  key={`dot-${slide.id}`}
                  className={`slider-dot-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (isNavigatingRef.current) return;
                    setIsTransitioning(true);
                    setCurrentIndex(idx + 1);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span className="dot-visual" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

