import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [cursorText, setCursorText] = useState('');

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    // Interactive target detection
    const handleMouseOver = (e) => {
      const target = e.target;
      const interactiveEl = target.closest('button, a, input, select, textarea, [role="button"], .card, .btn, .clickable, .gallery-item, .initiative-card');

      if (interactiveEl) {
        setHovered(true);
        if (interactiveEl.classList.contains('gallery-card') || interactiveEl.closest('#gallery')) {
          setCursorText('View');
        } else if (interactiveEl.tagName === 'BUTTON' || interactiveEl.classList.contains('btn')) {
          setCursorText('');
        } else {
          setCursorText('');
        }
      } else {
        setHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Smooth animation loop for the trailing ring
    const animateRing = () => {
      // Linear interpolation (lerp) for smooth liquid trailing
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(animateRing);
    };

    rafId.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [hidden]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer Magnetic Trailing Ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${hidden ? 'hidden' : ''}`}
        aria-hidden="true"
      >
        {cursorText && <span className="cursor-badge-text">{cursorText}</span>}
      </div>

      {/* Inner Glowing Center Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${hidden ? 'hidden' : ''}`}
        aria-hidden="true"
      />
    </>
  );
}
