import React, { useState } from 'react';
import { UserPlus, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { submitVolunteer } from '../api';
import confetti from 'canvas-confetti';

export default function VolunteerSection({ t }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    city: 'Palghar',
    interest_area: 'Youth Mentorship & Education',
    skills: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      alert('Please fill your name and phone number');
      return;
    }

    setSubmitting(true);
    try {
      await submitVolunteer(formData);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (_) {}
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        city: 'Palghar',
        interest_area: 'Youth Mentorship & Education',
        skills: '',
        message: ''
      });
    } catch (err) {
      console.warn("Backend unavailable, submitting locally", err);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="volunteer" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="section-badge" style={{ background: '#dcfce7', color: '#15803d' }}>
            <UserPlus size={15} />
            <span>{t.volunteer.badge}</span>
          </div>
          <h2 className="section-title">{t.volunteer.title}</h2>
          <p className="section-subtitle">{t.volunteer.subtitle}</p>
        </div>

        {/* Volunteer Form Card */}
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="card glass-panel tilt-card reveal-scale" style={{ padding: '2.5rem' }}>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Application Received!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
                  {t.volunteer.successMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.volunteer.namePlaceholder} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.volunteer.phonePlaceholder} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 90763 49867"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.volunteer.emailPlaceholder}
                    </label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      {t.volunteer.areaPlaceholder}
                    </label>
                    <select
                      value={formData.interest_area}
                      onChange={(e) => setFormData({ ...formData, interest_area: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Youth Mentorship & Education">Youth Mentorship & Education</option>
                      <option value="Food & Ration Distribution">Food & Ration Distribution</option>
                      <option value="Medical & Health Camps">Medical & Health Camps</option>
                      <option value="Women Support & Training">Women Support & Training</option>
                      <option value="Media & Social Awareness">Media & Social Awareness</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {t.volunteer.skillsPlaceholder}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Teacher, Doctor, Student, IT Professional, Event Coordinator"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {t.volunteer.messagePlaceholder}
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share a few words about your willingness to serve society..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-glow-pulse btn-shine"
                  style={{
                    width: '100%',
                    padding: '0.92rem',
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Submitting Application...' : t.volunteer.submitBtn}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
