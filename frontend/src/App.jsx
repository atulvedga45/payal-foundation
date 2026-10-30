import React, { useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { fetchTrustInfo, fetchTrustees, fetchInitiatives, fetchHomeStats, fetchGallery, fetchVisitorStatusApi } from './api';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageSliderSection from './components/ImageSliderSection';
import AboutSection from './components/AboutSection';
import InitiativesSection from './components/InitiativesSection';
import TeamSection from './components/TeamSection';
import GallerySection from './components/GallerySection';
import DonateSection from './components/DonateSection';
import ContactSection from './components/ContactSection';
import AdminModal from './components/AdminModal';
import DeveloperPinModal from './components/DeveloperPinModal';
import WelcomeVisitorModal from './components/WelcomeVisitorModal';
import VisitorAppreciationModal from './components/VisitorAppreciationModal';
import SecretVisitorLogModal from './components/SecretVisitorLogModal';
import Footer from './components/Footer';
import FloatingBubbles from './components/FloatingBubbles';
import SplashScreen from './components/SplashScreen';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Default Fallback Data if backend is starting or offline
const DEFAULT_GALLERY = [
  {
    id: 1,
    image_url: '/about_initiative.jpg',
    title: 'Emergency Medical & Hospital Assistance in Palghar',
    title_mr: 'माणुसकीची साथ: गरजू बाबांना रुग्णालयात नेऊन उपचारासाठी मदत',
    category: 'Healthcare & Compassion',
    category_mr: 'आरोग्य व रुग्णसेवा',
    order: 1
  },
  {
    id: 2,
    image_url: '/community_outreach.jpg',
    title: 'Field Social Work & Community Outreach',
    title_mr: 'विश्वस्त व स्वयंसेवकांचा प्रत्यक्ष सेवा उपक्रम',
    category: 'Social Service',
    category_mr: 'सामाजिक कार्य',
    order: 2
  },
  {
    id: 3,
    image_url: '/child_healthcare_hospital.jpg',
    title: 'Child Healthcare & Patient Care Support in Hospital',
    title_mr: 'रुग्णालय सहाय्य: बालकांवर उपचार व माणुसकीचा आधार',
    category: 'Healthcare Support',
    category_mr: 'रुग्णालय सहाय्य',
    order: 3
  },
  {
    id: 4,
    image_url: '/women_empowerment.jpg',
    title: 'Women Support & Community Assistance',
    title_mr: 'महिला सबलीकरण व प्रत्यक्ष मदत उपक्रम',
    category: 'Women Welfare',
    category_mr: 'महिला कल्याण',
    order: 4
  }
];

const DEFAULT_TRUSTEES = [
  { id: 1, name: "Sonya Oghe", role: "President", role_mr: "अध्यक्ष (President)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 1 },
  { id: 2, name: "Sonya Oghe", role: "Secretary", role_mr: "सचिव (Secretary)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 2 },
  { id: 3, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 3 },
  { id: 4, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 4 },
  { id: 5, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 5 },
  { id: 6, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", photo_url: "/sonya.jpg", phone: "1234567890", upi_id: "payalfoundation@ybl", order: 6 }
];

const DEFAULT_INITIATIVES = [
  {
    id: 1,
    title: "Youth Empowerment & Skill Development",
    title_mr: "युवा सक्षमीकरण आणि कौशल्य विकास",
    description: "Equipping underprivileged youth with vocational skills, computer literacy, and career mentorship for independent livelihoods.",
    description_mr: "गरजू युवकांना व्यावसायिक प्रशिक्षण, संगणक साक्षरता आणि स्वावलंबी जीवन जगण्यासाठी रोजगाराच्या संधी उपलब्ध करून देणे.",
    category: "Youth & Education",
    image_url: "/img1.jpeg",
    target_amount: 150000,
    raised_amount: 95000
  },
  {
    id: 2,
    title: "Community Food & Ration Distribution",
    title_mr: "अन्नदान व अन्नधान्य वाटप मोहीम",
    description: "Providing nutritious meals and monthly ration kits to needy families, elderly persons, and daily-wage workers across Palghar.",
    description_mr: "पालघरमधील झोपडपट्टी भागातील गरीब व गरजू कुटुंबांना, ज्येष्ठ नागरिकांना दरमहा पोषण आहार व रेशन किट वाटप करणे.",
    category: "Hunger Relief",
    image_url: "/food_distribution.jpg",
    target_amount: 200000,
    raised_amount: 140000
  },
  {
    id: 3,
    title: "Free Medical Checkups & Health Camps",
    title_mr: "मोफत आरोग्य तपासणी व वैद्यकीय शिबिर",
    description: "Organizing free health diagnostics, eye checkup camps, and providing essential medicines to vulnerable slum communities.",
    description_mr: "झोपडपट्टी परिसरांमध्ये तज्ज्ञ डॉक्टरांच्या साहाय्याने मोफत आरोग्य तपासणी, औषध वाटप व नेत्र तपासणी शिबिरांचे आयोजन.",
    category: "Healthcare",
    image_url: "/healthcare_camp.jpg",
    target_amount: 180000,
    raised_amount: 115000
  },
  {
    id: 4,
    title: "Women Support & Emergency Relief",
    title_mr: "महिला सबलीकरण व आपत्कालीन मदत",
    description: "Supporting women self-help initiatives, tailoring training, and urgent disaster relief assistance during times of crisis.",
    description_mr: "महिला बचत गट मार्गदर्शन, शिवणकाम प्रशिक्षण आणि नैसर्गिक वा कौटुंबिक संकटात तातडीची आर्थिक व सामाजिक मदत.",
    category: "Social Welfare",
    image_url: "/women_empowerment.jpg",
    target_amount: 120000,
    raised_amount: 78000
  }
];

export default function App() {
  const [lang, setLang] = useState('mr');
  const [trustInfo, setTrustInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_trust_info');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...parsed,
          phone: (parsed.phone && !parsed.phone.includes('92252')) ? parsed.phone : '+91 77768 76121',
          address: (parsed.address && !parsed.address.includes('Aana Sagar') && !parsed.address.includes('Kurla')) ? parsed.address : 'पालघर (Palghar)',
          email: (parsed.email && !parsed.email.includes('contact@payalfoundation.org')) ? parsed.email : 'payalfoundation212@gmail.com'
        };
      }
      return null;
    } catch {
      return null;
    }
  });
  const [trustees, setTrustees] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_trustees');
      return cached ? JSON.parse(cached) : DEFAULT_TRUSTEES;
    } catch {
      return DEFAULT_TRUSTEES;
    }
  });
  const [initiatives, setInitiatives] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_initiatives');
      return cached ? JSON.parse(cached) : DEFAULT_INITIATIVES;
    } catch {
      return DEFAULT_INITIATIVES;
    }
  });
  const [gallery, setGallery] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_gallery');
      return cached ? JSON.parse(cached) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  });
  const [homeStats, setHomeStats] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_home_stats');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [selectedCause, setSelectedCause] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('admin_unlocked') === 'true';
  });
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('samajseva_theme') || 'light';
  });

  // Visitor Tracking & Appreciation States
  const [visitorProfile, setVisitorProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_visitor_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [visitorCardOpen, setVisitorCardOpen] = useState(false);
  const [secretVisitorLogOpen, setSecretVisitorLogOpen] = useState(false);
  const [visitorSecretPin, setVisitorSecretPin] = useState('7776');

  // Synchronize visitor status with server:
  // 1. If admin deleted this visitor -> remove local profile and re-open welcome card
  // 2. If someone else was deleted -> update this visitor's sequential number (#2 -> #1) in real-time
  const syncVisitorStatus = useCallback(async () => {
    const deviceId = localStorage.getItem('payal_visitor_device_id');
    const cached = localStorage.getItem('payal_visitor_profile');

    if (!deviceId && !cached) {
      return;
    }

    try {
      const parsed = cached ? JSON.parse(cached) : null;
      const res = await fetchVisitorStatusApi(deviceId, parsed?.id);
      if (res) {
        if (res.exists && res.visitor) {
          const updated = {
            id: res.visitor.id,
            fullName: res.visitor.full_name,
            firstName: res.visitor.first_name,
            visitorNumber: res.visitor.visitor_number,
            totalCount: res.visitor.total_count,
            registeredAt: res.visitor.created_at || (parsed ? parsed.registeredAt : new Date().toISOString())
          };
          setVisitorProfile(updated);
          localStorage.setItem('payal_visitor_profile', JSON.stringify(updated));
        } else if (!res.exists) {
          // Visitor was deleted from visitor panel by admin!
          localStorage.removeItem('payal_visitor_profile');
          setVisitorProfile(null);
          setVisitorCardOpen(false);
          setTimeout(() => {
            setWelcomeModalOpen(true);
          }, 2500);
        }
      }
    } catch (err) {
      console.warn('Visitor sync check error:', err);
    }
  }, []);

  // Show Welcome Modal 2-3 seconds AFTER the website opens (after splash finishes and website is visible)
  useEffect(() => {
    if (!showSplash) {
      const cached = localStorage.getItem('payal_visitor_profile');
      if (!cached) {
        const timer = setTimeout(() => {
          setWelcomeModalOpen(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }
  }, [showSplash]);

  useEffect(() => {
    syncVisitorStatus();
    const handleFocus = () => syncVisitorStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [syncVisitorStatus]);

  const handleOpenVisitorCard = async () => {
    await syncVisitorStatus();
    const current = localStorage.getItem('payal_visitor_profile');
    if (current) {
      setVisitorCardOpen(true);
    } else {
      setWelcomeModalOpen(true);
    }
  };

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('samajseva_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    async function loadData() {
      const [infoData, trusteesData, initData, statsData, galleryData] = await Promise.allSettled([
        fetchTrustInfo(),
        fetchTrustees(),
        fetchInitiatives(),
        fetchHomeStats(),
        fetchGallery()
      ]);

      if (infoData.status === 'fulfilled' && infoData.value) {
        const cleanInfo = {
          ...infoData.value,
          phone: (infoData.value.phone && !infoData.value.phone.includes('92252')) ? infoData.value.phone : '+91 77768 76121',
          address: (infoData.value.address && !infoData.value.address.includes('Aana Sagar') && !infoData.value.address.includes('Kurla')) ? infoData.value.address : 'पालघर (Palghar)',
          email: (infoData.value.email && !infoData.value.email.includes('contact@payalfoundation.org')) ? infoData.value.email : 'payalfoundation212@gmail.com'
        };
        setTrustInfo(cleanInfo);
        localStorage.setItem('payal_trust_info', JSON.stringify(cleanInfo));
      }
      if (trusteesData.status === 'fulfilled' && trusteesData.value && trusteesData.value.length > 0) {
        setTrustees(trusteesData.value);
        localStorage.setItem('payal_trustees', JSON.stringify(trusteesData.value));
      }
      if (initData.status === 'fulfilled' && Array.isArray(initData.value) && initData.value.length > 0) {
        setInitiatives(initData.value);
        localStorage.setItem('payal_initiatives', JSON.stringify(initData.value));
      }
      if (statsData.status === 'fulfilled' && statsData.value) {
        setHomeStats(statsData.value);
      }
      if (galleryData.status === 'fulfilled' && galleryData.value && galleryData.value.length > 0) {
        setGallery(galleryData.value);
        localStorage.setItem('payal_gallery', JSON.stringify(galleryData.value));
      }
    }
    loadData();
  }, []);

  // Global Scroll Reveal Observer
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08,
    });

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    // Also observe dynamically when trustees or initiatives change
    const timeout = setTimeout(() => {
      const refreshed = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      refreshed.forEach((el) => {
        if (!el.classList.contains('in-view')) {
          observer.observe(el);
        }
      });
    }, 250);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [trustees, initiatives, lang]);

  // WhatsApp floating button: hidden on Home page, visible on other sections, hidden at footer
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const homeEl = document.getElementById('home');
      const footerEl = document.querySelector('footer');

      // Check if user has scrolled past home section
      let pastHome = false;
      if (homeEl) {
        const homeRect = homeEl.getBoundingClientRect();
        pastHome = homeRect.bottom < 150;
      } else {
        pastHome = window.scrollY > 350;
      }

      // Hide when footer is visible
      let footerVisible = false;
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        footerVisible = footerRect.top < window.innerHeight - 30;
      }

      setShowWhatsApp(pastHome && !footerVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Animated splash screen — shows logo on first load */}
      {showSplash && <SplashScreen onFinished={handleSplashFinish} />}

      {/* Main site wrapper — fades in after splash */}
      <div
        style={{
          opacity: showSplash ? 0 : 1,
          transition: 'opacity 0.6s ease 0.1s',
          visibility: showSplash ? 'hidden' : 'visible',
        }}
      >
      {/* Animated blurred light bubbles — fixed full-page background */}
      <FloatingBubbles />

      {/* Top Banner with Reg No, Phone and Language Toggle */}
      <TopBar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenAdmin={() => setAdminOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdminUnlocked={isAdminUnlocked}
        setIsAdminUnlocked={setIsAdminUnlocked}
        isPinModalOpen={isPinModalOpen}
        setIsPinModalOpen={setIsPinModalOpen}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        visitorProfile={visitorProfile}
        onOpenVisitorCard={handleOpenVisitorCard}
      />

      {/* Dynamic Live Impact Announcement Ticker */}
      <div className="live-ticker-bar">
        <div className="ticker-track">
          <div className="ticker-item">
            <span>✨ {lang === 'mr' ? 'माणुसकीची साथ, मदतीचा हात' : 'Hand of Humanity, Support in Need'}</span>
          </div>
          <div className="ticker-item">
            <span>📍 {lang === 'mr' ? 'पालघर व ग्रामीण भागातील गरजू रुग्णांसाठी मोफत रुग्णवाहिका व उपचार साहाय्य' : 'Free Emergency Hospital & Medical Care for Rural Palghar'}</span>
          </div>
          <div className="ticker-item">
            <span>🤝 {lang === 'mr' ? 'पायल फाउंडेशन - समाज सेवा' : 'Payal Foundation - Social Service'}</span>
          </div>
          <div className="ticker-item">
            <span>📞 {lang === 'mr' ? 'तात्काळ मदतीसाठी थेट संपर्क: +९१ ७७७६८ ७६१२१' : 'Immediate Assistance Helpline: +91 77768 76121'}</span>
          </div>
          {/* Duplicate track for seamless infinite marquee loop */}
          <div className="ticker-item">
            <span>✨ {lang === 'mr' ? 'माणुसकीची साथ, मदतीचा हात' : 'Hand of Humanity, Support in Need'}</span>
          </div>
          <div className="ticker-item">
            <span>📍 {lang === 'mr' ? 'पालघर व ग्रामीण भागातील गरजू रुग्णांसाठी मोफत रुग्णवाहिका व उपचार साहाय्य' : 'Free Emergency Hospital & Medical Care for Rural Palghar'}</span>
          </div>
          <div className="ticker-item">
            <span>🤝 {lang === 'mr' ? 'पायल फाउंडेशन - समाज सेवा' : 'Payal Foundation - Social Service'}</span>
          </div>
          <div className="ticker-item">
            <span>📞 {lang === 'mr' ? 'तात्काळ मदतीसाठी थेट संपर्क: +९१ ७७७६८ ७६१२१' : 'Immediate Assistance Helpline: +91 77768 76121'}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar (Hidden completely when About lock page is open) */}
      {!isPinModalOpen && (
        <Navbar
          t={t}
          isAdminUnlocked={isAdminUnlocked}
          onOpenAdmin={() => setAdminOpen(true)}
          isPinModalOpen={isPinModalOpen}
          visitorProfile={visitorProfile}
          onOpenVisitorCard={handleOpenVisitorCard}
          onOpenWelcomeModal={() => setWelcomeModalOpen(true)}
        />
      )}

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero t={t} lang={lang} homeStats={homeStats} />

        {/* About Section */}
        <AboutSection t={t} />

        {/* Initiatives / Services */}
        <InitiativesSection
          t={t}
          initiatives={initiatives}
          onSelectCause={(causeTitle) => setSelectedCause(causeTitle)}
          lang={lang}
        />

        {/* Leadership & Trustees */}
        <TeamSection
          t={t}
          trustees={trustees}
          lang={lang}
          trustInfo={trustInfo}
        />

        {/* Photo Gallery & Work Moments Slider */}
        <ImageSliderSection lang={lang} />

        {/* Donation Portal (Real UPI QR + Bank Transfer + Receipt) */}
        <DonateSection
          t={t}
          selectedCause={selectedCause}
          trustInfo={trustInfo}
        />

        {/* Contact Form & Office Location */}
        <ContactSection t={t} lang={lang} trustInfo={trustInfo} />
      </main>

      {/* Footer */}
      <Footer
        t={t}
        trustInfo={trustInfo}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Admin Portal Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        homeStats={homeStats}
        onUpdateHomeStats={(newStats) => setHomeStats(newStats)}
        initiatives={initiatives}
        onUpdateInitiatives={(newInits) => {
          setInitiatives(newInits);
          localStorage.setItem('payal_initiatives', JSON.stringify(newInits));
        }}
        trustees={trustees}
        onUpdateTrustees={(newTrustees) => {
          setTrustees(newTrustees);
          localStorage.setItem('payal_trustees', JSON.stringify(newTrustees));
        }}
        gallery={gallery}
        onUpdateGallery={(newGallery) => {
          setGallery(newGallery);
          localStorage.setItem('payal_gallery', JSON.stringify(newGallery));
        }}
        trustInfo={trustInfo}
        onUpdateTrustInfo={(newInfo) => {
          setTrustInfo(newInfo);
          localStorage.setItem('payal_trust_info', JSON.stringify(newInfo));
        }}
      />

      {/* Developer PIN Verification Modal ("About Us" Lock Page) */}
      <DeveloperPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          sessionStorage.setItem('admin_unlocked', 'true');
          setIsPinModalOpen(false);
        }}
        onOpenVisitorLog={(pin) => {
          setVisitorSecretPin(pin || '7776');
          setIsPinModalOpen(false);
          setSecretVisitorLogOpen(true);
        }}
        lang={lang}
      />

      {/* First-time Welcome & Full Name Registration Modal */}
      <WelcomeVisitorModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        onRegistered={(profile) => {
          setVisitorProfile(profile);
          setVisitorCardOpen(true);
        }}
        lang={lang}
      />

      {/* Visitor Appreciation Modal (Opens when clicking name in Navbar) */}
      <VisitorAppreciationModal
        isOpen={visitorCardOpen}
        onClose={() => setVisitorCardOpen(false)}
        visitorProfile={visitorProfile}
        onUpdateProfile={(updated) => setVisitorProfile(updated)}
        lang={lang}
      />

      {/* Secret Visitor Log & Count Modal (Unlocked with secret PIN 7776/2121/8888 in About lock screen) */}
      <SecretVisitorLogModal
        isOpen={secretVisitorLogOpen}
        onClose={() => setSecretVisitorLogOpen(false)}
        secretPin={visitorSecretPin}
        lang={lang}
        onVisitorDeletedSelf={() => {
          setVisitorProfile(null);
          setVisitorCardOpen(false);
          setWelcomeModalOpen(true);
        }}
        onVisitorListUpdated={syncVisitorStatus}
      />

      {/* Floating Scroll To Top Button with Circular Progress */}
      <ScrollToTop />

      {/* WhatsApp Quick Connect Floating Button */}
      <a
        href="https://wa.me/917776876121?text=Namaskar%20Payal%20Foundation%2C%20I%20would%20like%20to%20help%20or%20need%20assistance"
        target="_blank"
        rel="noopener noreferrer"
        className={`whatsapp-float-btn ${!showWhatsApp ? 'footer-hidden' : ''}`}
        title={lang === 'mr' ? 'WhatsApp वर संपर्क करा' : 'Chat on WhatsApp'}
        aria-label="WhatsApp Chat"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 6.84C8.94 6.84 8.78 6.84 8.64 6.84C8.5 6.84 8.28 6.9 8.1 7.1C7.91 7.3 7.37 7.81 7.37 8.86C7.37 9.91 8.14 10.93 8.25 11.07C8.36 11.21 9.73 13.33 11.83 14.24C12.33 14.45 12.72 14.58 13.02 14.68C13.52 14.84 13.98 14.81 14.34 14.76C14.74 14.7 15.57 14.26 15.74 13.77C15.91 13.29 15.91 12.87 15.86 12.79C15.81 12.71 15.67 12.66 15.46 12.55C15.25 12.45 14.21 11.94 14.02 11.87C13.82 11.8 13.68 11.77 13.54 11.98C13.39 12.19 12.98 12.66 12.85 12.8C12.73 12.94 12.6 12.96 12.39 12.85C12.18 12.75 11.51 12.53 10.71 11.82C10.09 11.27 9.67 10.59 9.55 10.38C9.43 10.17 9.54 10.06 9.64 9.95C9.74 9.85 9.85 9.71 9.96 9.58C10.07 9.45 10.11 9.35 10.18 9.21C10.25 9.07 10.21 8.95 10.16 8.85C10.11 8.74 9.68 7.69 9.5 7.25C9.33 6.82 9.15 6.88 9.02 6.87L8.64 6.84H9.11Z" />
        </svg>
      </a>
      </div>{/* end main site wrapper */}

      {/* Luxury Interactive Animated Custom Cursor */}
      <CustomCursor />
    </div>
  );
}
