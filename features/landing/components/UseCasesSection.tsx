'use client'
import { useState } from 'react'
import Image from 'next/image'

const TABS = [
  {
    icon: '🏪',
    label: 'Bodegas y minimarkets',
    headline: 'Recupera al cliente que no vuelve hace un mes.',
    stat: '+34%',
    statLabel: 'ventas recurrentes',
    statNote: 'Promedio entre 124 negocios usando Luania hace 90+ días.',
    quote: '"Hola Sra. Rosa, hace 32 días no le mando el pedido de siempre. ¿Le preparo su canasta esta semana?"',
    image: '/images/bodega.jpg',
    imageBg: '#F3F4F6',
  },
  {
    icon: '🍔',
    label: 'Restaurantes y delivery',
    headline: 'El mozo que nunca se equivoca ni llega tarde.',
    stat: '-18%',
    statLabel: 'pedidos mal tomados',
    statNote: 'Comparado con toma de pedidos manual por WhatsApp.',
    quote: '"¡Hola! Tu combo familiar llega en 35 min. ¿Quieres añadir postre con 20% de dscto?"',
    image: '/images/restaurante.jpg',
    imageBg: '#FFF7ED',
  },
  {
    icon: '👗',
    label: 'Boutiques y retail',
    headline: 'Asesora de moda disponible 24/7 para tus clientas.',
    stat: '+52%',
    statLabel: 'tasa de cierre nocturno',
    statNote: 'Ventas cerradas entre 9pm–6am comparado con antes de Luania.',
    quote: '"La Blusa Renata en talla M sí tenemos. ¿La quieres en blanco o negro? Ambos en stock."',
    image: '/images/boutique.jpg',
    imageBg: '#FFF0F5',
  },
  {
    icon: '💼',
    label: 'Servicios profesionales',
    headline: 'Agenda citas y califica leads sin levantar el teléfono.',
    stat: '+3h',
    statLabel: 'libres al día',
    statNote: 'Tiempo recuperado al automatizar respuestas y agendamiento.',
    quote: '"Tengo disponibilidad el martes 14 a las 10am o el jueves 16 a las 4pm. ¿Cuál te funciona?"',
    image: '/images/servicios.jpg',
    imageBg: '#EFF6FF',
  },
]

export function UseCasesSection() {
  const [active, setActive] = useState(0)
  const tab = TABS[active]

  return (
    <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section badge */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Para tu negocio
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Hecho para cómo vendes hoy.<br />No para forzarte a cambiar.
          </h2>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1.125rem',
                borderRadius: 9999,
                border: '1.5px solid',
                borderColor: active === i ? 'var(--color-ink)' : 'var(--color-border)',
                backgroundColor: active === i ? 'var(--color-ink)' : 'transparent',
                color: active === i ? '#fff' : 'var(--color-muted)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: active === i ? 'scale(1.03)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (active !== i) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-ink)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)'
                }
              }}
              onMouseLeave={(e) => {
                if (active !== i) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
                }
              }}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content card — key forces re-mount for animation */}
        <div
          key={active}
          className="animate-scale-in grid grid-cols-1 lg:grid-cols-2"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 24,
            overflow: 'hidden',
            minHeight: 380,
            boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
          }}
        >
          {/* Image side */}
          <div style={{ position: 'relative', minHeight: 260 }}>
            <Image
              src={tab.image}
              alt={tab.label}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={active === 0}
            />
            {/* Overlay gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)',
            }} />
            {/* Bottom badge */}
            <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 12,
              padding: '0.5rem 0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}>
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>{tab.label}</span>
            </div>
          </div>

          {/* Text side */}
          <div style={{ padding: 'clamp(1.75rem, 4vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.25, color: 'var(--color-ink)' }}>
              {tab.headline}
            </h3>

            {/* Stat */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 'clamp(2.5rem, 5vw, 3.25rem)', fontWeight: 900, color: 'var(--color-primary)', margin: 0, lineHeight: 1 }}>{tab.stat}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-ink)', margin: '0.25rem 0 0.375rem' }}>{tab.statLabel}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.55 }}>{tab.statNote}</p>
            </div>

            {/* Quote */}
            <blockquote style={{
              margin: 0,
              padding: '1rem 1.125rem',
              borderLeft: '3px solid var(--color-primary)',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: '0 10px 10px 0',
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-ink)', margin: 0, lineHeight: 1.65, fontStyle: 'italic' }}>
                {tab.quote}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
