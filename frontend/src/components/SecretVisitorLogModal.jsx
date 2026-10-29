import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, Search, Trash2, RefreshCw, X, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import { fetchSecretVisitorsLog, deleteSecretVisitor } from '../api';

export default function SecretVisitorLogModal({ isOpen, onClose, secretPin = '7776', lang = 'mr' }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ total_count: 0, visitors: [] });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchSecretVisitorsLog(secretPin);
      setData(res);
    } catch (err) {
      console.error('Failed to fetch visitor log:', err);
      setError('व्हिजिटर डेटा लोड करता आला नाही. कृपया पिन तपासा किंवा पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadData();
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id, name) => {
    if (!window.confirm(`खरोखर '${name}' या व्हिजिटरची नोंद हटवायची आहे का?`)) return;
    setDeletingId(id);
    try {
      await deleteSecretVisitor(id, secretPin);
      setData((prev) => ({
        ...prev,
        total_count: Math.max(0, prev.total_count - 1),
        visitors: prev.visitors.filter((v) => v.id !== id)
      }));
    } catch (err) {
      alert('हटवता आले नाही: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = data.visitors.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (v.full_name && v.full_name.toLowerCase().includes(q)) ||
      (v.first_name && v.first_name.toLowerCase().includes(q)) ||
      String(v.visitor_number || v.id).includes(q)
    );
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('mr-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 12, 24, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeInSecret 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: 'linear-gradient(165deg, #0f1f38 0%, #081426 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          color: '#ffffff'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
              }}
            >
              <Users size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                {lang === 'mr' ? 'गुप्त व्हिजिटर यादी (Visitor Log)' : 'Secret Visitor Log'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                पायल फाउंडेशन — सर्व सन्माननीय व्हिजिटर्सची नावे व आकडेवारी
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats & Search Toolbar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.35)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Total Count Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#fbbf24'
            }}
          >
            <Sparkles size={16} />
            <span>एकूण व्हिजिटर्स: {data.total_count}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', minWidth: '220px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="नावाने शोधा..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              title="रिफ्रेश करा"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#93c5fd',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Content Body / Visitors List */}
        <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                color: '#fca5a5',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          {loading && data.visitors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              व्हिजिटर्स माहिती लोड होत आहे...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              {search ? 'या नावाने कोणताही व्हिजिटर सापडला नाही.' : 'अद्याप कोणत्याही व्हिजिटरची नोंद झालेली नाही.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {filtered.map((v, idx) => (
                <div
                  key={v.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {/* Left: Number & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.18)',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        color: '#fbbf24',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      #{v.visitor_number || v.id}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {v.full_name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginTop: '2px'
                        }}
                      >
                        <Calendar size={12} />
                        <span>{formatDate(v.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      disabled={deletingId === v.id}
                      onClick={() => handleDelete(v.id, v.full_name)}
                      title="नोंद हटवा (Delete)"
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.35)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        e.currentTarget.style.color = '#f87171';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInSecret {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .spin {
          animation: spinAnim 1s linear infinite;
        }
        @keyframes spinAnim {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
}

