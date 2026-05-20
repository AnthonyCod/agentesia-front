'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const STEP_DURATION = 5000 // ms

const STEPS = [
  {
    num: '01',
    title: 'Crea tu tienda en Luania',
    desc: 'Agrega tus productos, fotos, precios y stock desde el panel. Tantos negocios y catálogos como quieras — todo desde un solo lugar.',
    preview: <CatalogPreview />,
  },
  {
    num: '02',
    title: 'Conecta tu Instagram y Facebook',
    desc: 'Pega tu @usuario o ID de página y autoriza con Meta en 30 segundos. Sin código, sin Zapier, sin dolor.',
    preview: <ConnectPreview />,
  },
  {
    num: '03',
    title: 'Entrena a tu agente con tu estilo',
    desc: 'Cuéntale a Luania cómo vendes: tono, promos, métodos de pago, delivery. Aprende en minutos como un vendedor humano.',
    preview: <TrainPreview />,
  },
  {
    num: '04',
    title: 'Empieza a vender — Luania trabaja',
    desc: 'Responde DMs al instante, recomienda productos con foto, valida pagos de Yape/Plin y cierra ventas. 24/7, sin pausas.',
    preview: <SellPreview />,
  },
]

/* ── Sub-previews ─────────────────────────────── */

function CatalogPreview() {
  const products = [
    { name: 'Vestido Camila', price: 'S/ 79', stock: 12, img: '/images/productos/vestido-camila.jpg' },
    { name: 'Blusa Renata',   price: 'S/ 65', stock: 8,  img: '/images/productos/blusa-renata.jpg'  },
    { name: 'Falda Mía',      price: 'S/ 89', stock: 4,  img: '/images/productos/falda-mia.jpg'     },
    { name: 'Chompa Olivia',  price: 'S/ 119',stock: 6,  img: '/images/productos/chompa-olivia.jpg' },
  ]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>A</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>atelier.lima</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', margin: 0 }}>4 productos · 30 en stock</p>
          </div>
        </div>
        <button style={{ backgroundColor: 'var(--color-ink)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer' }}>
          + Agregar
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {products.map((p) => (
          <div key={p.name} style={{ backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
          >
            <div style={{ height: 72, position: 'relative', overflow: 'hidden' }}>
              <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="150px" />
            </div>
            <div style={{ padding: '0.5rem' }}>
              <p style={{ fontWeight: 600, fontSize: '0.73rem', margin: '0 0 0.25rem' }}>{p.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{p.price}</span>
                <span style={{ fontSize: '0.58rem', backgroundColor: p.stock <= 4 ? '#FEF9C3' : '#DCFCE7', color: p.stock <= 4 ? '#854D0E' : '#166534', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>{p.stock} stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 10, padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0, display: 'block' }} />
        <p style={{ fontSize: '0.72rem', fontWeight: 600, margin: 0, color: '#15803D' }}>Productos sincronizados con Luania — el agente los conoce al instante.</p>
      </div>
    </div>
  )
}

function ConnectPreview() {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.875rem' }}>Conectar canal</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {[
          { icon: '📸', label: 'Instagram', hint: '@atelier.lima · conectado', color: '#E1306C', bg: '#FFF0F5', connected: true },
          { icon: '👥', label: 'Facebook Página', hint: 'Conectar en 30 seg.', color: '#1877F2', bg: '#EFF6FF', connected: false },
        ].map((ch) => (
          <div key={ch.label} style={{ backgroundColor: '#fff', border: `1.5px solid ${ch.connected ? '#86EFAC' : 'var(--color-border)'}`, borderRadius: 12, padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'border-color 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: ch.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>{ch.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: 0 }}>{ch.label}</p>
              <p style={{ fontSize: '0.7rem', color: ch.connected ? '#22c55e' : ch.color, fontWeight: 500, margin: 0 }}>{ch.hint}</p>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ch.connected ? '#22c55e' : '#D1D5DB' }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.875rem', backgroundColor: '#F0FDF4', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803D', margin: 0 }}>✓ Conectado en menos de 30 segundos</p>
        <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>Sin código ni herramientas externas</p>
      </div>
    </div>
  )
}

function TrainPreview() {
  return (
    <div>
      <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.875rem' }}>Personalidad del agente</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { label: 'Tono de voz', value: 'Amigable y directa, como amiga que vende', icon: '💬' },
          { label: 'Métodos de pago', value: 'Yape, Plin, transferencia BCP', icon: '💳' },
          { label: 'Costo de delivery', value: 'S/ 8 Lima · S/ 15 provincia', icon: '🚚' },
          { label: 'Promo activa', value: '2x1 en blusas hasta el viernes', icon: '🎁' },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.625rem', transition: 'border-color 0.2s' }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '0.76rem', color: 'var(--color-ink)', margin: 0 }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: '0.875rem', width: '100%', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.625rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s, transform 0.15s' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-hover)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary)'; (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      >
        Guardar configuración →
      </button>
    </div>
  )
}

function SellPreview() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[
          { label: '24/7', sub: 'Sin pausas', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: '2.1s', sub: 'Resp. prom.', color: '#22c55e', bg: '#F0FDF4' },
          { label: '+89%', sub: 'Tasa cierre', color: '#3B82F6', bg: '#EFF6FF' },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 10, padding: '0.625rem 0.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.label}</p>
            <p style={{ fontSize: '0.62rem', color: 'var(--color-muted)', margin: '0.2rem 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {[
          { name: 'Rosa Cárdenas', msg: 'Quiero el Vestido Camila talla M', time: 'Ahora', badge: 'activo', bc: '#22c55e' },
          { name: 'Juan Mendoza',  msg: '✓ Pago por Yape confirmado',       time: '5 min',  badge: 'cerrado', bc: '#3B82F6' },
          { name: 'Lucía Torres',  msg: '¿Delivery a Miraflores?',          time: '12 min', badge: 'nuevo',   bc: '#F59E0B' },
        ].map((conv, i) => (
          <div key={conv.name} style={{ padding: '0.625rem 0.875rem', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', transition: 'background 0.15s', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#F9FAFB' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: ['#FEE2E2','#E0F2FE','#FEF3C7'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: ['#C53030','#1D4ED8','#92400E'][i], flexShrink: 0 }}>
              {conv.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.75rem', margin: 0 }}>{conv.name}</p>
              <p style={{ fontSize: '0.67rem', color: 'var(--color-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.msg}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ fontSize: '0.6rem', color: 'var(--color-muted)', margin: '0 0 0.2rem' }}>{conv.time}</p>
              <span style={{ fontSize: '0.58rem', fontWeight: 700, backgroundColor: conv.bc + '20', color: conv.bc, borderRadius: 4, padding: '1px 5px' }}>{conv.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main section ─────────────────────────────── */

export function HowItWorksSection() {
  const [active, setActive] = useState(0)
  const [progressKey, setProgressKey] = useState(0)

  const goTo = useCallback((i: number) => {
    setActive(i)
    setProgressKey((k) => k + 1)
  }, [])

  // Auto-advance every STEP_DURATION ms
  useEffect(() => {
    const timer = setTimeout(() => {
      goTo((active + 1) % STEPS.length)
    }, STEP_DURATION)
    return () => clearTimeout(timer)
  }, [active, goTo])

  return (
    <section id="how-it-works" style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section badge */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Cómo funciona
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            De cero a vendiendo<br />
            en menos de{' '}
            <em style={{ fontFamily: 'var(--font-display, Georgia, serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-primary)' }}>
              10 minutos.
            </em>
          </h2>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-2 lg:gap-12">

          {/* Steps list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {STEPS.map((step, i) => (
              <div key={step.num}>
                <button
                  onClick={() => goTo(i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: `2px solid ${active === i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderBottom: active === i ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                    borderRadius: 14,
                    padding: '1.125rem 1.25rem',
                    backgroundColor: active === i ? 'var(--color-primary-light)' : 'var(--color-cream)',
                    cursor: 'pointer',
                    transition: 'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    boxShadow: active === i ? '0 4px 20px rgba(197,48,48,0.1)' : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (active !== i) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1A0A0'
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FDF8F8'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== i) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-cream)'
                    }
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-display, Georgia, serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '1.1rem',
                    color: active === i ? 'var(--color-primary)' : 'var(--color-muted)',
                    flexShrink: 0,
                    paddingTop: '0.1rem',
                    transition: 'color 0.25s',
                    lineHeight: 1,
                  }}>
                    {step.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', margin: '0 0 0', color: 'var(--color-ink)', lineHeight: 1.3 }}>
                      {step.title}
                    </p>
                    <div style={{
                      maxHeight: active === i ? '5rem' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.35s ease',
                    }}>
                      <p style={{ fontSize: '0.8375rem', color: 'var(--color-muted)', margin: '0.5rem 0 0', lineHeight: 1.65 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Progress bar — only below active step */}
                {active === i && (
                  <div style={{ height: 3, backgroundColor: 'var(--color-border)', borderRadius: '0 0 14px 14px', overflow: 'hidden', marginTop: -2 }}>
                    <div
                      key={progressKey}
                      className="progress-bar-fill"
                      style={{
                        height: '100%',
                        backgroundColor: 'var(--color-primary)',
                        transformOrigin: 'left',
                        animationDuration: `${STEP_DURATION}ms`,
                        animationTimingFunction: 'linear',
                        animationFillMode: 'forwards',
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Step dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', paddingTop: '0.5rem' }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: active === i ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: active === i ? 'var(--color-primary)' : 'var(--color-border)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width 0.3s var(--ease-spring), background-color 0.2s',
                  }}
                  aria-label={`Ir a paso ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}>
            {/* Browser chrome */}
            <div style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid var(--color-border)', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
                ))}
              </div>
              <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: 6, padding: '0.25rem 0.75rem', fontSize: '0.68rem', color: 'var(--color-muted)', fontFamily: 'monospace' }}>
                app.luania.com / mi-tienda / {['inventario', 'canales', 'configuracion', 'conversaciones'][active]}
              </div>
            </div>

            {/* Content — animated on step change */}
            <div
              key={active}
              className="animate-scale-in"
              style={{ padding: '1.5rem' }}
            >
              {STEPS[active].preview}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
