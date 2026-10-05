import { useEffect, useRef } from 'react';

/**
 * FloatingBubbles — Full-page canvas background
 * Blurred, slow-floating glowing orbs / light bubbles
 * Pure JS canvas, zero dependencies, very low CPU.
 */
export default function FloatingBubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    // ── Palette: soft blues + saffron accent matching NGO brand ──
    const COLORS = [
      'rgba(11, 98, 164, VAL)',   // brand blue
      'rgba(30,  64, 175, VAL)',  // deep indigo-blue
      'rgba(56, 189, 248, VAL)',  // sky blue
      'rgba(245,158, 11, VAL)',   // saffron accent
      'rgba(16, 185,129, VAL)',   // soft green
      'rgba(99, 102, 241, VAL)',  // indigo
    ];

    const BUBBLE_COUNT = 18;
    let bubbles = [];

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function makeBubble(forceVisible = false) {
      const colorTemplate = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: randomBetween(0, W),
        y: forceVisible ? randomBetween(0, H) : randomBetween(-H * 0.3, H * 1.3),
        r: randomBetween(60, 200),           // radius
        opacity: randomBetween(0.04, 0.13),  // very soft
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        opacitySpeed: randomBetween(0.0003, 0.0008),
        opacityMin: randomBetween(0.03, 0.07),
        opacityMax: randomBetween(0.09, 0.15),
        vx: randomBetween(-0.12, 0.12),      // very slow drift
        vy: randomBetween(-0.18, -0.06),     // float upward slowly
        colorTemplate,
      };
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = document.documentElement.scrollHeight;
    }

    function init() {
      resize();
      bubbles = Array.from({ length: BUBBLE_COUNT }, () => makeBubble(true));
    }

    function drawBubble(b) {
      const colorStr = b.colorTemplate.replace('VAL', b.opacity);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0,   colorStr);
      grad.addColorStop(0.5, b.colorTemplate.replace('VAL', b.opacity * 0.5));
      grad.addColorStop(1,   b.colorTemplate.replace('VAL', 0));

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function update(b) {
      // Float
      b.x += b.vx;
      b.y += b.vy;

      // Gentle opacity breathe
      b.opacity += b.opacityDir * b.opacitySpeed;
      if (b.opacity >= b.opacityMax) { b.opacity = b.opacityMax; b.opacityDir = -1; }
      if (b.opacity <= b.opacityMin) { b.opacity = b.opacityMin; b.opacityDir =  1; }

      // Recycle when floated off-screen
      if (b.y + b.r < -50 || b.x + b.r < -50 || b.x - b.r > W + 50) {
        Object.assign(b, makeBubble(false));
        b.y = H + b.r; // restart from bottom
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // Subtle overall blur via CSS filter on canvas — drawn per bubble with radial gradient
      bubbles.forEach(b => {
        drawBubble(b);
        update(b);
      });

      animId = requestAnimationFrame(loop);
    }

    init();
    loop();

    // Resize canvas when window or content changes
    const resizeObs = new ResizeObserver(() => {
      resize();
    });
    resizeObs.observe(document.body);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      resizeObs.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(38px)',    // soft blur applied globally
        opacity: 1,
      }}
    />
  );
}
