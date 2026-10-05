import React, { useState, useEffect, useCallback } from 'react';
import { translations } from './translations';
import { fetchTrustInfo, fetchTrustees, fetchInitiatives, fetchHomeStats } from './api';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import InitiativesSection from './components/InitiativesSection';
import TeamSection from './components/TeamSection';
import GallerySection from './components/GallerySection';
import DonateSection from './components/DonateSection';
import ContactSection from './components/ContactSection';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import FloatingBubbles from './components/FloatingBubbles';
import SplashScreen from './components/SplashScreen';

// Default Fallback Data if backend is starting or offline
const DEFAULT_TRUSTEES = [
  { id: 1, name: "Sonya Oghe", role: "President", role_mr: "अध्यक्ष (President)", photo_url: "/sonya.jpg", order: 1 },
  { id: 2, name: "Sonya Oghe", role: "Secretary", role_mr: "सचिव (Secretary)", order: 2 },
  { id: 3, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 3 },
  { id: 4, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 4 },
  { id: 5, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 5 },
  { id: 6, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 6 },
  { id: 7, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 7 },
  { id: 8, name: "Sonya Oghe", role: "Trust Member", role_mr: "विश्वस्त सदस्य (Trust Member)", order: 8 }
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
  const [trustInfo, setTrustInfo] = useState(null);
  const [trustees, setTrustees] = useState(DEFAULT_TRUSTEES);
  const [initiatives, setInitiatives] = useState(() => {
    try {
      const cached = localStorage.getItem('payal_initiatives');
      return cached ? JSON.parse(cached) : DEFAULT_INITIATIVES;
    } catch {
      return DEFAULT_INITIATIVES;
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
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('samajseva_theme') || 'light';
  });

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
      const [infoData, trusteesData, initData, statsData] = await Promise.allSettled([
        fetchTrustInfo(),
        fetchTrustees(),
        fetchInitiatives(),
        fetchHomeStats()
      ]);

      if (infoData.status === 'fulfilled' && infoData.value) {
        setTrustInfo(infoData.value);
      }
      if (trusteesData.status === 'fulfilled' && trusteesData.value && trusteesData.value.length > 0) {
        setTrustees(trusteesData.value);
      }
      if (initData.status === 'fulfilled' && initData.value && initData.value.length > 0) {
        setInitiatives(initData.value);
        localStorage.setItem('payal_initiatives', JSON.stringify(initData.value));
      }
      if (statsData.status === 'fulfilled' && statsData.value) {
        setHomeStats(statsData.value);
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
      />

      {/* Main Sticky Navbar */}
      <Navbar t={t} />

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
        />

        {/* Photo Gallery & Work Glimpses */}
        <GallerySection t={t} />

        {/* Donation Portal (Real UPI QR + Bank Transfer + Receipt) */}
        <DonateSection
          t={t}
          selectedCause={selectedCause}
          trustInfo={trustInfo}
        />

        {/* Contact Form & Office Location */}
        <ContactSection t={t} />
      </main>

      {/* Footer */}
      <Footer
        t={t}
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
      />
      </div>{/* end main site wrapper */}
    </div>
  );
}
