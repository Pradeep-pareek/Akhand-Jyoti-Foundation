"use client"
import React, { useEffect, useState, useCallback } from 'react'

interface GalleryItem {
  id: number
  title: string
  description: string
  images: string[]
  eventDate: string | null
  createdAt: string
  updatedAt: string
}

// ─── Rich text renderer ───────────────────────────────────────────────────────
// Preserves bullet points (- * • ●), numbered lists, bold (**text**), line breaks
const RichDescription = ({ text, clamped }: { text: string; clamped: boolean }) => {
  const renderInline = (str: string): React.ReactNode => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) => {
      const m = p.match(/^\*\*(.+)\*\*$/)
      return m ? <strong key={i} style={{ fontWeight: 600, color: '#3a5c3c' }}>{m[1]}</strong> : p
    })
  }

  type Group = { type: 'ul' | 'ol' | 'other'; lines: string[] }
  const groups: Group[] = []
  text.split('\n').forEach(line => {
    const t = line.trim()
    const isBullet = /^[-*•●]\s+/.test(t)
    const isNumbered = /^\d+\.\s+/.test(t)
    const type: Group['type'] = isBullet ? 'ul' : isNumbered ? 'ol' : 'other'
    const last = groups[groups.length - 1]
    if (last && last.type === type && type !== 'other') {
      last.lines.push(line)
    } else {
      groups.push({ type, lines: [line] })
    }
  })

  const content = groups.map((g, gi) => {
    if (g.type === 'ul') return (
      <ul key={gi} style={{ margin: '4px 0 8px', paddingLeft: 20 }}>
        {g.lines.map((l, i) => {
          const m = l.trim().match(/^[-*•●]\s+(.+)/)
          return <li key={i} style={{ margin: '2px 0', listStyleType: 'disc', fontSize: 14, color: '#5a6e5c', lineHeight: 1.7 }}>{m ? renderInline(m[1]) : l}</li>
        })}
      </ul>
    )
    if (g.type === 'ol') return (
      <ol key={gi} style={{ margin: '4px 0 8px', paddingLeft: 20 }}>
        {g.lines.map((l, i) => {
          const m = l.trim().match(/^\d+\.\s+(.+)/)
          return <li key={i} style={{ margin: '2px 0', listStyleType: 'decimal', fontSize: 14, color: '#5a6e5c', lineHeight: 1.7 }}>{m ? renderInline(m[1]) : l}</li>
        })}
      </ol>
    )
    return g.lines.map((l, i) => {
      const t = l.trim()
      if (t === '') return <br key={`${gi}-${i}`} />
      return <p key={`${gi}-${i}`} style={{ margin: '0 0 6px', fontSize: 14, color: '#5a6e5c', lineHeight: 1.7 }}>{renderInline(t)}</p>
    })
  })

  return (
    <div style={clamped ? {
      display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
    } as React.CSSProperties : {}}>
      {content}
    </div>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN = '#81BA45'
const GREEN_DARK = '#5f8f2e'
const GREEN_LIGHT = '#eef6e4'
const BG = '#F4F7F0'

// ─── Gallery ──────────────────────────────────────────────────────────────────
const Gallery = () => {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<{ item: GalleryItem; imageIndex: number } | null>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gallery')
        const data = await response.json()
        setGalleryData(data.data.sort((a: GalleryItem, b: GalleryItem) => b.id - a.id) || [])
      } catch {
        // Demo fallback with rich text
        setGalleryData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const openLightbox = useCallback((item: GalleryItem, imageIndex: number) => {
    setLightbox({ item, imageIndex })
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    document.body.style.overflow = ''
  }, [])

  const lightboxNext = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, imageIndex: (lightbox.imageIndex + 1) % lightbox.item.images.length })
  }, [lightbox])

  const lightboxPrev = useCallback(() => {
    if (!lightbox) return
    setLightbox({ ...lightbox, imageIndex: (lightbox.imageIndex - 1 + lightbox.item.images.length) % lightbox.item.images.length })
  }, [lightbox])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'ArrowRight') lightboxNext()
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, lightboxNext, lightboxPrev, closeLightbox])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: 16, background: BG }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${GREEN_LIGHT}`, borderTop: `3px solid ${GREEN}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: GREEN_DARK, fontWeight: 500, fontSize: 15, margin: 0 }}>Loading Gallery...</p>
    </div>
  )

  return (
    <section style={{ background: BG, padding: '20px 0 96px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <span style={{
            display: 'inline-block', background: GREEN_LIGHT, color: GREEN_DARK,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '5px 16px', borderRadius: 100, border: `1px solid ${GREEN}40`, marginBottom: 14
          }}>Our Gallery</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: GREEN_DARK, margin: '0 0 10px', lineHeight: 1.2 }}>
            Moments of Impact
          </h2>
          <p style={{ fontSize: 16, color: '#6b7f6d', maxWidth: 460, margin: '0 auto 18px', lineHeight: 1.6 }}>
            Every photograph tells a story of transformation, community, and hope.
          </p>
          <div style={{ width: 52, height: 4, background: GREEN, borderRadius: 2, margin: '0 auto' }} />
        </div>

        {/* Cards — one per row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {galleryData.map((item, idx) => {
            const isExpanded = expandedCard === item.id
            // Show at most 4 images: 1 large + up to 3 small
            const shown = item.images.slice(0, 4)
            const extraCount = item.images.length - 4

            return (
              <article key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '480px 1fr',
                background: '#ffffff',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
                border: `1px solid ${GREEN}22`,
                animation: 'fadeUp 0.5s ease both',
                animationDelay: `${idx * 0.12}s`,
              }}>

                {/* LEFT — image mosaic */}
                <div style={{ display: 'flex', flexDirection: 'column', background: '#f2f7ec', gap: 3 }}>

                  {/* Primary large image */}
                  <div
                    className="img-wrap"
                    style={{ position: 'relative', overflow: 'hidden', height: 260, cursor: 'pointer', flexShrink: 0 }}
                    onClick={() => openLightbox(item, 0)}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/480x260/81BA45/ffffff?text=Photo+1` }}
                    />
                    <div className="img-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(26,74,30,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.3s'
                    }}>
                      <span style={{ fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🔍</span>
                    </div>
                  </div>

                  {/* Secondary images row */}
                  {shown.length > 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${shown.length - 1}, 1fr)`, gap: 3 }}>
                      {shown.slice(1).map((img, i) => {
                        const realIdx = i + 1
                        const isLastVisible = realIdx === shown.length - 1 && extraCount > 0
                        return (
                          <div
                            key={i}
                            className="img-wrap"
                            style={{ position: 'relative', overflow: 'hidden', height: 112, cursor: 'pointer' }}
                            onClick={() => openLightbox(item, realIdx)}
                          >
                            <img
                              src={img}
                              alt={`Photo ${realIdx + 1}`}
                              style={{
                                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                                transition: 'transform 0.3s',
                                ...(isLastVisible ? { filter: 'brightness(0.45)' } : {})
                              }}
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/160x112/81BA45/ffffff?text=${realIdx + 1}` }}
                            />
                            {isLastVisible && (
                              <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '0.02em'
                              }}>+{extraCount + 1}</div>
                            )}
                            {!isLastVisible && (
                              <div className="img-overlay" style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(26,74,30,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: 0, transition: 'opacity 0.3s'
                              }}>
                                <span style={{ fontSize: 18 }}>🔍</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT — content */}
                <div style={{ padding: '28px 32px 32px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: '#7a9e7e', fontWeight: 500 }}>📅 {formatDate(item.eventDate || item.createdAt)}</span>
                    <span style={{
                      fontSize: 12, color: GREEN_DARK, fontWeight: 600,
                      background: GREEN_LIGHT, padding: '3px 10px', borderRadius: 100, border: `1px solid ${GREEN}33`
                    }}>🖼 {item.images.length} Photos</span>
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e3320', margin: '0 0 14px', lineHeight: 1.4 }}>
                    {item.title}
                  </h3>

                  <div style={{ flex: 1 }}>
                    <RichDescription text={item.description} clamped={!isExpanded} />
                    {item.description.length > 200 && (
                      <button
                        style={{ background: 'none', border: 'none', color: GREEN_DARK, fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: '6px 0 0', display: 'block' }}
                        onClick={() => setExpandedCard(isExpanded ? null : item.id)}
                      >
                        {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
                      </button>
                    )}
                  </div>

                  <div style={{ height: 1, background: `${GREEN}33`, margin: '20px 0' }} />

                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: GREEN, color: '#fff', border: 'none', borderRadius: 10,
                      padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      letterSpacing: '0.02em', transition: 'background 0.2s', alignSelf: 'flex-start'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = GREEN_DARK)}
                    onMouseLeave={e => (e.currentTarget.style.background = GREEN)}
                    onClick={() => openLightbox(item, 0)}
                  >
                    View All Photos →
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {galleryData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <span style={{ fontSize: 48 }}>🌿</span>
            <p style={{ color: '#9ab09d', marginTop: 12 }}>No gallery items found.</p>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(8,16,10,0.94)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            backdropFilter: 'blur(10px)'
          }}
          onClick={closeLightbox}
        >
          <div
            style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              maxWidth: 980, width: '100%', maxHeight: '92vh',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)', position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              style={{
                position: 'absolute', top: 14, right: 14, zIndex: 10,
                background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none',
                borderRadius: '50%', width: 38, height: 38, fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onClick={closeLightbox}
            >✕</button>

            {/* Main image area */}
            <div style={{
              position: 'relative', background: '#0d1a0f', flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 380, maxHeight: '60vh', overflow: 'hidden'
            }}>
              {lightbox.item.images.length > 1 && (
                <button
                  style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                    width: 44, height: 56, fontSize: 28, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5
                  }}
                  onClick={lightboxPrev}
                >‹</button>
              )}
              <img
                key={lightbox.imageIndex}
                src={lightbox.item.images[lightbox.imageIndex]}
                alt="Gallery"
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', display: 'block', animation: 'fadeIn 0.22s ease' }}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/900x600/81BA45/ffffff?text=Photo` }}
              />
              {lightbox.item.images.length > 1 && (
                <button
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                    width: 44, height: 56, fontSize: 28, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5
                  }}
                  onClick={lightboxNext}
                >›</button>
              )}
            </div>

            {/* Thumbnail strip — all images */}
            {lightbox.item.images.length > 1 && (
              <div style={{
                display: 'flex', gap: 6, padding: '10px 16px',
                background: BG, overflowX: 'auto', scrollbarWidth: 'none',
                borderTop: `2px solid ${GREEN_LIGHT}`
              }}>
                {lightbox.item.images.map((img, i) => (
                  <button
                    key={i}
                    style={{
                      flexShrink: 0, width: 76, height: 54, borderRadius: 8,
                      overflow: 'hidden', border: `2px solid ${i === lightbox.imageIndex ? GREEN : 'transparent'}`,
                      padding: 0, cursor: 'pointer', background: 'none',
                      opacity: i === lightbox.imageIndex ? 1 : 0.6,
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setLightbox({ ...lightbox, imageIndex: i })}
                  >
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/76x54/81BA45/fff?text=${i + 1}` }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{
              padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', background: '#fff', borderTop: `1px solid ${GREEN}22`
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1e3320', margin: 0, flex: 1, paddingRight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lightbox.item.title}
              </p>
              <span style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 700, background: GREEN_LIGHT, padding: '3px 12px', borderRadius: 100, flexShrink: 0 }}>
                {lightbox.imageIndex + 1} / {lightbox.item.images.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .img-wrap:hover img { transform: scale(1.05); }
        .img-wrap:hover .img-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  )
}

export default Gallery