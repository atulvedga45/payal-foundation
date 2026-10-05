import React, { useMemo } from 'react';

/**
 * GeometricBackground — Full-page fixed animated triangle-grid background.
 * Mimics the holographic blue-purple triangle grid image.
 * Rendered as SVG with staggered CSS shimmer animations + soft blur overlay.
 */
export default function GeometricBackground() {
  // ── Triangle grid geometry ──
  const SIDE   = 110;                          // equilateral triangle side length (px)
  const HEIGHT = Math.round(SIDE * Math.sqrt(3) / 2); // ≈ 95px
  const VW = 1440;
  const VH = 1000;
  const COLS = Math.ceil(VW / (SIDE / 2)) + 2;
  const ROWS = Math.ceil(VH / HEIGHT) + 2;

  // Palette: light blue → lavender → white (matching the image)
  const FILLS = [
    'rgba(186,230,253,0.55)',   // sky blue
    'rgba(199,210,254,0.45)',   // periwinkle
    'rgba(221,214,254,0.40)',   // lavender
    'rgba(255,255,255,0.60)',   // bright white
    'rgba(147,197,253,0.50)',   // cornflower blue
    'rgba(224,231,255,0.45)',   // soft indigo
    'rgba(240,249,255,0.55)',   // near white blue
    'rgba(167,243,208,0.25)',   // faint mint accent
  ];

  const triangles = useMemo(() => {
    const list = [];
    let id = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x   = c * (SIDE / 2);
        const yT  = r * HEIGHT;
        const yB  = yT + HEIGHT;
        const isUp = (r + c) % 2 === 0;

        const points = isUp
          ? `${x},${yB} ${x + SIDE},${yB} ${x + SIDE / 2},${yT}`
          : `${x},${yT} ${x + SIDE},${yT} ${x + SIDE / 2},${yB}`;

        const seed     = r * COLS + c;
        const fillIdx  = (seed * 7 + r * 3 + c * 5) % FILLS.length;
        const delay    = ((seed * 0.17) % 5).toFixed(2);
        const duration = (3.5 + (seed * 0.23) % 3.5).toFixed(2);
        const animCls  = `ga${seed % 8}`;

        list.push({ id: id++, points, fill: FILLS[fillIdx], delay, duration, animCls });
      }
    }
    return list;
  }, []);

  return (
    <>
      <div className="geo-bg" aria-hidden="true">
        <svg
          className="geo-svg"
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {triangles.map(tri => (
            <polygon
              key={tri.id}
              className={`geo-tri ${tri.animCls}`}
              points={tri.points}
              fill={tri.fill}
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1"
              style={{
                animationDelay:    `${tri.delay}s`,
                animationDuration: `${tri.duration}s`,
              }}
            />
          ))}
        </svg>

        {/* Soft blur + white-tint overlay so content stays readable */}
        <div className="geo-blur-overlay" />
      </div>

      <style>{`
        .geo-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #e8f4ff 0%, #f5f0ff 50%, #e0f2fe 100%);
        }

        .geo-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .geo-tri { animation: geoShimmer ease-in-out infinite; }

        .ga0 { animation-name: geoShimmer0; }
        .ga1 { animation-name: geoShimmer1; }
        .ga2 { animation-name: geoShimmer2; }
        .ga3 { animation-name: geoShimmer3; }
        .ga4 { animation-name: geoShimmer4; }
        .ga5 { animation-name: geoShimmer5; }
        .ga6 { animation-name: geoShimmer6; }
        .ga7 { animation-name: geoShimmer7; }

        @keyframes geoShimmer0 {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 1;   }
        }
        @keyframes geoShimmer1 {
          0%,100% { opacity: 0.4; }
          40%      { opacity: 0.9; }
          70%      { opacity: 0.65; }
        }
        @keyframes geoShimmer2 {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 0.35; }
        }
        @keyframes geoShimmer3 {
          0%,100% { opacity: 0.5; }
          30%      { opacity: 1;   }
          80%      { opacity: 0.4; }
        }
        @keyframes geoShimmer4 {
          0%,100% { opacity: 0.6; }
          60%      { opacity: 1;   }
        }
        @keyframes geoShimmer5 {
          0%       { opacity: 0.35; }
          45%      { opacity: 0.9;  }
          100%     { opacity: 0.35; }
        }
        @keyframes geoShimmer6 {
          0%,100% { opacity: 0.55; }
          55%      { opacity: 0.85; }
        }
        @keyframes geoShimmer7 {
          0%,100% { opacity: 0.45; }
          25%      { opacity: 0.8;  }
          75%      { opacity: 0.55; }
        }

        /* Blur overlay — frosted glass look matching the image */
        .geo-blur-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(2.5px);
          -webkit-backdrop-filter: blur(2.5px);
        }
      `}</style>
    </>
  );
}
