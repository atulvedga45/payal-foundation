import React from 'react';
import { UserCheck, Shield } from 'lucide-react';

export default function TeamSection({ t, trustees, lang }) {
  // Limit to exactly 6 trustees as requested (3 per line, 2 lines)
  const displayTrustees = (trustees && trustees.length > 0 ? trustees : []).slice(0, 6);

  return (
    <section id="team" className="section section-bg-alt" style={{ overflow: 'hidden' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header reveal">
          <div className="section-badge">
            <Shield size={15} />
            <span>{t.team.badge}</span>
          </div>
          <h2 className="section-title">{t.team.title}</h2>
          <p className="section-subtitle">{t.team.subtitle}</p>
        </div>

        {/* 3 Columns Grid (Exactly 3 per line, 6 total boxes) */}
        <div className="trustees-grid">
          {displayTrustees.map((member, idx) => {
            const roleName = lang === 'mr' && member.role_mr ? member.role_mr : member.role;

            // All boxes have same name "Sonya Oghe" and profile photo as requested
            const displayName = 'Sonya Oghe';
            const photoSrc = member.photo_url || '/sonya.jpg';
            const hasPhoto = true;

            return (
              <div
                key={member.id || idx}
                className={`trustee-card reveal stagger-${(idx % 6) + 1}`}
              >
                {/* Avatar Icon / Profile Photo */}
                <div className={`trustee-avatar ${hasPhoto ? 'has-photo' : ''}`}>
                  {hasPhoto ? (
                    <img
                      src={photoSrc}
                      alt={displayName}
                      className="trustee-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackIcon = e.target.parentElement.querySelector('.trustee-fallback-icon');
                        if (fallbackIcon) fallbackIcon.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <UserCheck
                    size={42}
                    color="#ffffff"
                    strokeWidth={2.2}
                    className="trustee-fallback-icon"
                    style={{ display: hasPhoto ? 'none' : 'block' }}
                  />
                </div>

                {/* Name */}
                <h3 className="trustee-name">
                  {displayName}
                </h3>

                {/* Role Badge (All styled like Box 1 & 2 with blue pill style) */}
                <div className="trustee-badge">
                  <span>{roleName}</span>
                </div>

                {/* Organization Label */}
                <div className="trustee-org">
                  Payal Foundation and Social Service
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Scoped CSS for 3-per-line Grid, Hover Effects & Animations */}
      <style>{`
        .trustees-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }

        @media (max-width: 992px) {
          .trustees-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .trustees-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .trustee-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
          border-top: 3.5px solid var(--primary);
          padding: 2.25rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .trustee-card.in-view {
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }

        /* Hover Effect: Elevation, border glow and smooth scale */
        .trustee-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px -8px rgba(11, 98, 164, 0.22), 0 8px 16px -4px rgba(0, 0, 0, 0.05);
          border-color: rgba(11, 98, 164, 0.45);
          border-top-color: #0b62a4;
        }

        .trustee-avatar {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0b62a4 0%, #1e40af 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 8px 20px rgba(11, 98, 164, 0.32);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
          overflow: hidden;
          position: relative;
        }

        .trustee-avatar.has-photo {
          border: 3.5px solid #0b62a4;
          box-shadow: 0 10px 24px rgba(11, 98, 164, 0.38);
          background: #e2e8f0;
        }

        .trustee-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 10%;
          border-radius: 50%;
          transform: scale(1.18);
          display: block;
        }

        .trustee-card:hover .trustee-avatar {
          transform: scale(1.08) rotate(1deg);
          box-shadow: 0 14px 30px rgba(11, 98, 164, 0.45);
        }

        .trustee-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.55rem;
          line-height: 1.25;
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }

        .trustee-card:hover .trustee-name {
          color: var(--primary);
        }

        .trustee-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.35rem 0.95rem;
          transition: all 0.25s ease;
        }

        .trustee-card:hover .trustee-badge {
          background: #0b62a4;
          color: #ffffff;
          border-color: #0b62a4;
          box-shadow: 0 3px 10px rgba(11, 98, 164, 0.3);
        }

        .trustee-org {
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-top: 0.85rem;
          font-weight: 500;
        }

        /* Dark Mode Support */
        [data-theme="dark"] .trustee-card {
          background: #1e293b !important;
          border-color: #334155 !important;
          border-top-color: #38bdf8 !important;
        }

        [data-theme="dark"] .trustee-card:hover {
          border-color: #38bdf8 !important;
          box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.7) !important;
        }

        [data-theme="dark"] .trustee-avatar.has-photo {
          border-color: #38bdf8;
        }

        [data-theme="dark"] .trustee-name {
          color: #f8fafc !important;
        }

        [data-theme="dark"] .trustee-card:hover .trustee-name {
          color: #38bdf8 !important;
        }

        [data-theme="dark"] .trustee-badge {
          background: rgba(14, 165, 233, 0.18) !important;
          color: #38bdf8 !important;
          border-color: rgba(56, 189, 248, 0.35) !important;
        }

        [data-theme="dark"] .trustee-card:hover .trustee-badge {
          background: #0284c7 !important;
          color: #ffffff !important;
        }

        [data-theme="dark"] .trustee-org {
          color: #94a3b8 !important;
        }
      `}</style>
    </section>
  );
}
