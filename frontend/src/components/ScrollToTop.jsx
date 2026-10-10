import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setVisible(scrollTop > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top-btn floating-action-btn"
      aria-label="Scroll back to top"
      title="वर जा (Scroll to top)"
    >
      {/* Circular progress SVG */}
      <svg className="scroll-progress-svg" viewBox="0 0 44 44">
        <circle
          className="progress-bg"
          cx="22"
          cy="22"
          r="18"
        />
        <circle
          className="progress-bar"
          cx="22"
          cy="22"
          r="18"
          style={{
            strokeDasharray: 113.1,
            strokeDashoffset: 113.1 - (113.1 * scrollProgress) / 100
          }}
        />
      </svg>
      <ArrowUp size={18} className="scroll-arrow-icon" />
    </button>
  );
}
