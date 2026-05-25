'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const STEP_DURATION = 5000

const STEPS = [
  {
    num: '01',
    title: 'Crea tu tienda en Luania',
    desc: 'Agrega tus productos, fotos, precios y stock desde el panel. Tantos negocios y catálogos como quieras — todo desde un solo lugar.',
    slug: 'inventario',
  },
  {
    num: '02',
    title: 'Conecta tu Instagram y Facebook',
    desc: 'Pega tu @usuario o ID de página y autoriza con Meta en 30 segundos. Sin código, sin Zapier, sin dolor.',
    slug: 'canales',
  },
  {
    num: '03',
    title: 'Entrena a tu agente con tu estilo',
    desc: 'Cuéntale a Luania cómo vendes: tono, promos, métodos de pago, delivery. Aprende en minutos como un vendedor humano.',
    slug: 'configuracion',
  },
  {
    num: '04',
    title: 'Empieza a vender — Luania trabaja',
    desc: 'Responde DMs al instante, recomienda productos con foto, valida pagos de Yape/Plin y cierra ventas. 24/7, sin pausas.',
    slug: 'conversaciones',
  },
]

/* ── Previews ──────────────────────────────────── */

function CatalogPreview() {
  const products = [
    { name: 'Vestido Camila', price: 'S/ 79',  stock: 12, lowStock: false, img: '/images/productos/vestido-camila.jpg' },
    { name: 'Blusa Renata',   price: 'S/ 65',  stock: 8,  lowStock: false, img: '/images/productos/blusa-renata.jpg'  },
    { name: 'Falda Mía',      price: 'S/ 89',  stock: 4,  lowStock: true,  img: '/images/productos/falda-mia.jpg'     },
    { name: 'Chompa Olivia',  price: 'S/ 119', stock: 6,  lowStock: false, img: '/images/productos/chompa-olivia.jpg' },
  ]
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>A</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0, color: 'var(--color-ink)' }}>atelier.lima</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', margin: 0 }}>4 productos · 30 en stock</p>
          </div>
        </div>
        <button style={{ backgroundColor: 'var(--color-ink)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Agregar producto
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
        {products.map((p) => (
          <div key={p.name} style={{ backgroundColor: 'var(--color-cream)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <div style={{ height: 80, position: 'relative', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
              <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="160px" />
            </div>
            <div style={{ padding: '0.5rem 0.625rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.75rem', margin: '0 0 0.3rem', color: 'var(--color-ink)' }}>{p.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-ink)' }}>{p.price}</span>
                <span style={{
                  fontSize: '0.62rem', borderRadius: 6, padding: '2px 7px', fontWeight: 600,
                  backgroundColor: p.lowStock ? '#FEF9C3' : '#DCFCE7',
                  color: p.lowStock ? '#854D0E' : '#166534',
                }}>
                  {p.stock} en stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sync banner */}
      <div style={{ marginTop: '0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803D', margin: 0 }}>Productos sincronizados con Luania</p>
          <p style={{ fontSize: '0.7rem', color: '#16a34a', margin: '0.1rem 0 0' }}>Cuando alguien pregunta por uno, el agente lo conoce al instante.</p>
        </div>
      </div>
    </div>
  )
}

function ConnectPreview() {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem', color: 'var(--color-ink)' }}>Conectar canal</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { icon: '📸', label: 'Instagram Business', hint: '@atelier.lima · conectado', connected: true,  hintColor: '#16a34a' },
          { icon: '👥', label: 'Facebook Página',    hint: 'Conectar en 30 segundos',  connected: false, hintColor: '#1877F2' },
        ].map((ch) => (
          <div key={ch.label} style={{ backgroundColor: '#fff', border: `1.5px solid ${ch.connected ? '#86EFAC' : 'var(--color-border)'}`, borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: ch.connected ? '#F0FDF4' : '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', flexShrink: 0 }}>{ch.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, color: 'var(--color-ink)' }}>{ch.label}</p>
              <p style={{ fontSize: '0.72rem', color: ch.hintColor, fontWeight: 500, margin: '0.15rem 0 0' }}>{ch.hint}</p>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ch.connected ? '#22c55e' : '#D1D5DB', flexShrink: 0 }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', backgroundColor: '#F0FDF4', borderRadius: 12, padding: '0.875rem', textAlign: 'center', border: '1px solid #BBF7D0' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D', margin: 0 }}>✓ Conectado en menos de 30 segundos</p>
        <p style={{ fontSize: '0.72rem', color: '#16a34a', margin: '0.2rem 0 0' }}>Sin código ni herramientas externas</p>
      </div>
    </div>
  )
}

function TrainPreview() {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem', color: 'var(--color-ink)' }}>Personalidad del agente</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { label: 'Tono de voz',       value: 'Amigable y directa, como amiga que vende', icon: '💬' },
          { label: 'Métodos de pago',   value: 'Yape, Plin, transferencia BCP',            icon: '💳' },
          { label: 'Costo de delivery', value: 'S/ 8 Lima · S/ 15 provincia',              icon: '🚚' },
          { label: 'Promo activa',      value: '2x1 en blusas hasta el viernes',           icon: '🎁' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-ink)', margin: '0.1rem 0 0', fontWeight: 500 }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: '0.875rem', width: '100%', backgroundColor: 'var(--color-ink)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
        Guardar configuración →
      </button>
    </div>
  )
}

function SellPreview() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.875rem' }}>
        {[
          { label: '24/7',  sub: 'Sin pausas',  color: 'var(--color-accent)', bg: 'var(--color-accent-light)' },
          { label: '2.1s',  sub: 'Resp. prom.',  color: '#16A34A',              bg: '#F0FDF4'                    },
          { label: '+89%',  sub: 'Tasa cierre',  color: '#2563EB',              bg: '#EFF6FF'                    },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 10, padding: '0.75rem 0.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.label}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {[
          { name: 'Rosa Cárdenas', msg: 'Quiero el Vestido Camila talla M', time: 'Ahora', badge: 'activo',  bc: '#16A34A' },
          { name: 'Juan Mendoza',  msg: '✓ Pago por Yape confirmado',       time: '5 min', badge: 'cerrado', bc: '#2563EB' },
          { name: 'Lucía Torres',  msg: '¿Delivery a Miraflores?',          time: '12 min',badge: 'nuevo',   bc: '#D97706' },
        ].map((conv, i) => (
          <div key={conv.name} style={{ padding: '0.75rem 1rem', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: ['#FEE2E2','#EFF6FF','#FEF3C7'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: ['#C53030','#1D4ED8','#92400E'][i], flexShrink: 0 }}>
              {conv.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.78rem', margin: 0, color: 'var(--color-ink)' }}>{conv.name}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', margin: '0.1rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.msg}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.62rem', color: 'var(--color-muted)', margin: '0 0 0.2rem' }}>{conv.time}</p>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: conv.bc + '18', color: conv.bc, borderRadius: 5, padding: '2px 6px' }}>{conv.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PREVIEWS = [<CatalogPreview key={0} />, <ConnectPreview key={1} />, <TrainPreview key={2} />, <SellPreview key={3} />]

/* ── Main section ─────────────────────────────── */

export function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const [progressKey, setProgressKey] = useState(0)

  const goTo = useCallback((i: number) => {
    setActive(i)
    setProgressKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => goTo((active + 1) % STEPS.length), STEP_DURATION)
    return () => clearTimeout(timer)
  }, [active, goTo])

  return (
    <section id="how-it-works" style={{ padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-badge" style={{
            justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.12em', color: 'var(--color-accent)', textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            Cómo funciona
          </p>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: 'var(--color-ink)',
            margin: 0,
          }}>
            De cero a vendiendo<br />
            en menos de{' '}
            <em style={{
              fontFamily: 'var(--font-display, Georgia, serif)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--color-accent)',
            }}>
              10 minutos.
            </em>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-2 lg:gap-14">

          {/* ── Left: step cards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {STEPS.map((step, i) => {
              const isActive = active === i
              return (
                <button
                  key={step.num}
                  onClick={() => goTo(i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: '#fff',
                    border: '1.5px solid var(--color-border)',
                    borderLeft: isActive ? '4px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                    borderRadius: 16,
                    padding: '1.25rem 1.375rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    boxShadow: isActive
                      ? '0 4px 24px rgba(194,107,74,0.12), 0 1px 4px rgba(0,0,0,0.04)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                    transform: isActive ? 'translateX(3px)' : 'translateX(0)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Progress bar at bottom of active card */}
                  {isActive && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: 'var(--color-border)' }}>
                      <div
                        key={progressKey}
                        className="progress-bar-fill"
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-accent)',
                          transformOrigin: 'left',
                          animationDuration: `${STEP_DURATION}ms`,
                          animationTimingFunction: 'linear',
                          animationFillMode: 'forwards',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    {/* Number badge */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: 36,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-accent-light)',
                      color: isActive ? '#fff' : 'var(--color-accent)',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                      fontFamily: 'var(--font-sans)',
                      transition: 'background-color 0.2s, color 0.2s',
                      marginTop: '0.1rem',
                    }}>
                      {step.num}
                    </span>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: 700,
                        fontSize: '1.0625rem',
                        margin: 0,
                        color: 'var(--color-ink)',
                        lineHeight: 1.3,
                        letterSpacing: '-0.015em',
                      }}>
                        {step.title}
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-muted)',
                        margin: '0.5rem 0 0',
                        lineHeight: 1.65,
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* ── Right: browser preview ── */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
            position: 'sticky',
            top: '6rem',
          }}>
            {/* Browser chrome */}
            <div style={{
              backgroundColor: '#F5F5F5',
              borderBottom: '1px solid var(--color-border)',
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}>
              <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: c }} />
                ))}
              </div>
              <div style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 7,
                padding: '0.3rem 0.75rem',
                fontSize: '0.7rem',
                color: 'var(--color-muted)',
                fontFamily: 'monospace',
                border: '1px solid var(--color-border)',
                letterSpacing: 0,
              }}>
                app.luania.com / mi-tienda / {STEPS[active].slug}
              </div>
            </div>

            {/* Content */}
            <div key={active} className="animate-scale-in" style={{ padding: '1.5rem' }}>
              {PREVIEWS[active]}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
