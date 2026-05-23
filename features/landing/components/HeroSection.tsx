'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type MessageRole = 'ai' | 'user'
interface Message {
  id: number
  role: MessageRole
  text: string
  images?: string[]
}
interface Step {
  chips: string[]
  aiResponse: string
  aiImages?: string[]
}

const DEMO_STEPS: Step[] = [
  { chips: ['¿Tienes algo floreado talla M?', '¿Hacen delivery?', 'Ver novedades'], aiResponse: '' },
  {
    chips: ['Quiero el Vestido Camila', 'Quiero la Blusa Renata'],
    aiResponse: '¡Claro! 😊 Tenemos 3 opciones floreadas talla M disponibles ahora:',
    aiImages: ['/images/productos/vestido-camila.jpg', '/images/productos/blusa-renata.jpg', '/images/productos/falda-mia.jpg'],
  },
  {
    chips: ['Pago por Yape', 'Pago por Plin'],
    aiResponse: '¡Perfecto! 🎉 El **Vestido Camila** está en stock — S/ 79. ¿Cómo prefieres pagar?',
  },
  {
    chips: ['¡Listo, pagué! ✓', 'Tengo otra pregunta'],
    aiResponse: '✅ ¡Pago recibido por Yape! Tu pedido **LUA-4823** está confirmado.\n\n📍 Entrega hoy entre 3–5 pm a Miraflores. ¡Gracias! 🛍️',
  },
]
const NOVEDADES_STEP: Step = {
  chips: ['Quiero la Chompa Olivia', '¿Hacen delivery?'],
  aiResponse: '¡Aquí las últimas llegadas esta semana! 🆕✨',
  aiImages: ['/images/productos/chompa-olivia.jpg', '/images/productos/pantalon-sofia.jpg'],
}
const DELIVERY_STEP: Step = {
  chips: ['¿Tienes algo floreado talla M?', 'Ver novedades'],
  aiResponse: '¡Sí! 🚚 Delivery a toda Lima S/ 8, provincia S/ 15. Si compras antes de las 2pm llega hoy.',
}
const FIRST_AI_MESSAGE = '¡Hola! 👋 Bienvenida a Atelier Lima. ¿En qué te puedo ayudar hoy?'

const TRUST_AVATARS = [
  { src: '/images/avatars/maria.jpg',  name: 'María'  },
  { src: '/images/avatars/camila.jpg', name: 'Camila' },
  { src: '/images/avatars/andrea.jpg', name: 'Andrea' },
  { src: '/images/avatars/lucia.jpg',  name: 'Lucía'  },
]

function formatText(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j}>{part.slice(2, -2)}</strong>
          : part
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

/* ── Floating notification cards ── */
function CardPedido({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="animate-slide-left" style={{
      position: 'absolute', top: '8%', left: '-22%',
      backgroundColor: '#fff', borderRadius: 14,
      padding: '0.625rem 0.875rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.07)',
      minWidth: 168, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="white"/></svg>
        </div>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#DD2A7B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Pedido en IG</p>
          <p style={{ fontSize: '0.58rem', color: '#9CA3AF', margin: 0 }}>ahora mismo</p>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 1px' }}>Vestido Camila · S/ 79</p>
      <p style={{ fontSize: '0.68rem', color: '#6B7280', margin: 0 }}>Rosa Cárdenas · Lima</p>
    </div>
  )
}

function CardYape({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="animate-fade-in-up" style={{
      position: 'absolute', bottom: '14%', left: '-20%',
      backgroundColor: '#fff', borderRadius: 14,
      padding: '0.625rem 0.875rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.07)',
      minWidth: 152, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', backgroundColor: '#6B21A8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.85rem', fontFamily: 'var(--font-sans)' }}>Y</span>
        </div>
        <div>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#6B21A8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yape validado</p>
          <p style={{ fontSize: '0.58rem', color: '#9CA3AF', margin: 0 }}>automáticamente</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>+S/ 79.00</p>
      </div>
      <p style={{ fontSize: '0.62rem', color: '#9CA3AF', margin: '2px 0 0' }}>Pedido LUA-4823 pagado ✓</p>
    </div>
  )
}

export function HeroSection() {
  const [messages, setMessages]         = useState<Message[]>([])
  const [typing, setTyping]             = useState(false)
  const [currentStep, setCurrentStep]   = useState<Step>(DEMO_STEPS[0])
  const [showPedidoCard, setShowPedido] = useState(false)
  const [showYapeCard, setShowYape]     = useState(false)
  const chatRef    = useRef<HTMLDivElement>(null)
  const idRef      = useRef(0)
  const stepIndex  = useRef(0)

  const nextId = () => { idRef.current += 1; return idRef.current }

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ id: nextId(), role: 'ai', text: FIRST_AI_MESSAGE }])
    }, 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const handleChip = (chip: string) => {
    if (typing) return
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: chip }])

    let nextStep: Step
    if      (chip === 'Ver novedades')    nextStep = NOVEDADES_STEP
    else if (chip === '¿Hacen delivery?') nextStep = DELIVERY_STEP
    else {
      stepIndex.current += 1
      nextStep = DEMO_STEPS[Math.min(stepIndex.current, DEMO_STEPS.length - 1)]
    }

    if (!nextStep.aiResponse) return
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: nextStep.aiResponse, images: nextStep.aiImages }])
      setCurrentStep(nextStep)
      // Show pedido card when product is selected
      if (stepIndex.current === 2) setTimeout(() => setShowPedido(true), 500)
      // Show yape card when payment confirmed
      if (stepIndex.current >= 3) setTimeout(() => setShowYape(true), 600)
    }, 900 + (nextStep.aiImages ? 400 : 0))
  }

  return (
    <section id="demo" style={{ padding: '6.5rem 0 5rem', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2 lg:gap-8">

          {/* ── Left ── */}
          <div>
            {/* Badge */}
            <div className="animate-fade-in-down" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <span style={{ display: 'block', width: 24, height: 2, backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />
              <span style={{ display: 'block', width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.13em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Hecho en Perú · Para PYMEs peruanas
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up" style={{
              fontSize: 'clamp(3.25rem, 5.5vw, 4.875rem)',
              fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.0,
              color: 'var(--color-ink)', margin: '0 0 1.625rem', animationDelay: '0.08s',
            }}>
              Tu tienda<br />vende sola.<br />
              Tú{' '}
              <em style={{
                fontFamily: 'var(--font-display, Georgia, serif)', fontStyle: 'italic', fontWeight: 400,
                color: 'var(--color-primary)',
                textDecoration: 'underline', textDecorationColor: 'rgba(212,168,71,0.55)',
                textDecorationThickness: '4px', textUnderlineOffset: '5px',
              }}>
                descansas.
              </em>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-in-up" style={{
              fontSize: '1.075rem', lineHeight: 1.72, color: 'var(--color-muted)',
              margin: '0 0 2rem', maxWidth: '31rem', animationDelay: '0.18s',
            }}>
              El primer vendedor con IA diseñado para tiendas que venden por{' '}
              <strong style={{ color: 'var(--color-ink)' }}>Instagram y Facebook</strong> sin web propia.
              Responde, asesora y cierra ventas 24/7.{' '}
              <strong style={{ color: 'var(--color-ink)' }}>Empieza gratis 30 días — luego planes desde S/ 29/mes.</strong>
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', animationDelay: '0.26s' }}>
              <Link href="/register" style={{
                backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 700, fontSize: '1rem',
                padding: '0.875rem 1.875rem', borderRadius: '9999px', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                boxShadow: '0 4px 20px rgba(197,48,48,0.32)',
                transition: 'background-color 0.2s, transform 0.2s var(--ease-spring), box-shadow 0.2s',
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = 'var(--color-primary-hover)'; el.style.transform = 'translateY(-2px) scale(1.02)'; el.style.boxShadow = '0 8px 28px rgba(197,48,48,0.4)' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = 'var(--color-primary)'; el.style.transform = ''; el.style.boxShadow = '0 4px 20px rgba(197,48,48,0.32)' }}
              >
                Crear mi cuenta gratis →
              </Link>
              <a href="#how-it-works" style={{
                backgroundColor: 'transparent', color: 'var(--color-ink)', fontWeight: 600, fontSize: '1rem',
                padding: '0.875rem 1.75rem', borderRadius: '9999px', textDecoration: 'none',
                border: '1.5px solid var(--color-border)', display: 'inline-block',
                transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s var(--ease-spring)',
              }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--color-ink)'; el.style.backgroundColor = 'rgba(26,26,26,0.04)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--color-border)'; el.style.backgroundColor = 'transparent'; el.style.transform = '' }}
              >
                Ver demo en vivo
              </a>
            </div>

            {/* Hint */}
            <p className="animate-fade-in-up" style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: '0 0 1.75rem', animationDelay: '0.32s' }}>
              ⚡ 1 mes gratis · luego desde <strong style={{ color: 'var(--color-ink)' }}>S/ 29/mes</strong> · sin tarjeta
            </p>

            {/* Divider + social proof */}
            <div style={{ height: 1, backgroundColor: 'var(--color-border)', marginBottom: '1.5rem' }} />
            <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', animationDelay: '0.38s' }}>
              <div style={{ display: 'flex', flexShrink: 0 }}>
                {TRUST_AVATARS.map((av, i) => (
                  <div key={av.name} style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', marginLeft: i > 0 ? -9 : 0, border: '2px solid var(--color-cream)', flexShrink: 0, position: 'relative' }}>
                    <Image src={av.src} alt={av.name} fill style={{ objectFit: 'cover' }} sizes="34px" />
                  </div>
                ))}
                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--color-border)', color: 'var(--color-muted)', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -9, border: '2px solid var(--color-cream)', flexShrink: 0 }}>+</div>
              </div>
              <div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-ink)', margin: 0, fontWeight: 600 }}>
                  <strong>340+ negocios peruanos</strong> ya venden con Luania
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '0.78rem' }}>★★★★★</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-ink)' }}>4.9 / 5</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>· 127 reseñas</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: phone + floating cards ── */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', padding: '3rem 3rem 3rem' }}>

            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(26,26,26,0.10) 1.2px, transparent 1.2px)',
              backgroundSize: '22px 22px',
              maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Floating cards (relative to this wrapper) */}
            <CardPedido visible={showPedidoCard} />
            <CardYape visible={showYapeCard} />

            {/* Phone */}
            <div className="animate-float" style={{
              position: 'relative', zIndex: 1,
              width: 'clamp(290px, 38vw, 348px)',
              minHeight: 580, maxHeight: 640,
              backgroundColor: '#111', borderRadius: 44, padding: '13px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ backgroundColor: '#FAFAFA', borderRadius: 33, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Status bar */}
                <div style={{ backgroundColor: '#fff', padding: '9px 18px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.01em' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <svg width="15" height="10" viewBox="0 0 15 10" fill="none"><rect x="0" y="3" width="2.5" height="7" rx="0.5" fill="#1A1A1A"/><rect x="4" y="1.5" width="2.5" height="8.5" rx="0.5" fill="#1A1A1A"/><rect x="8" y="0" width="2.5" height="10" rx="0.5" fill="#1A1A1A"/><rect x="12" y="0" width="2.5" height="10" rx="0.5" fill="#1A1A1A" opacity="0.25"/></svg>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="#1A1A1A"><path d="M7 1.5C9.4 1.5 11.5 2.6 13 4.3L14 3.3C12.2 1.2 9.8 0 7 0 4.2 0 1.8 1.2 0 3.3l1 1C2.5 2.6 4.6 1.5 7 1.5z" opacity="0.35"/><path d="M7 4C8.7 4 10.2 4.8 11.2 6L12.2 5C10.9 3.5 9.1 2.5 7 2.5s-3.9 1-5.2 2.5L2.8 6C3.8 4.8 5.3 4 7 4z" opacity="0.7"/><circle cx="7" cy="9" r="1.3"/></svg>
                    <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="17" height="10" rx="2.5" stroke="#1A1A1A" strokeOpacity="0.3"/><rect x="2" y="2" width="13" height="7" rx="1.5" fill="#1A1A1A"/><path d="M19 3.8v3.4c.7-.3 1.2-1 1.2-1.7S19.7 4.1 19 3.8z" fill="#1A1A1A" opacity="0.4"/></svg>
                  </div>
                </div>

                {/* DM header */}
                <div style={{ backgroundColor: '#fff', padding: '7px 14px', borderBottom: '1px solid #F3F3F3', display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: '1rem', color: '#1A1A1A', lineHeight: 1, flexShrink: 0 }}>‹</span>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                      <Image src="/images/avatars/atelier-lima.jpg" alt="atelier.lima" fill style={{ objectFit: 'cover' }} sizes="32px" />
                    </div>
                    <span style={{ position: 'absolute', bottom: -1, right: -1, width: 9, height: 9, borderRadius: '50%', backgroundColor: '#22c55e', border: '1.5px solid #fff', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1A1A1A', margin: 0 }}>atelier.lima</p>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#3B82F6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <p style={{ fontSize: '0.58rem', color: '#9CA3AF', margin: 0 }}>IA activa · responde al instante</p>
                  </div>
                  <div style={{ display: 'flex', gap: 11, flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round"><path d="M22 16.92V21a1 1 0 01-1.09 1A19.91 19.91 0 013 5.09 1 1 0 014 4h4.09a1 1 0 011 .75l1.17 4.43a1 1 0 01-.27 1l-2.2 2.2a16 16 0 006.84 6.84l2.2-2.2a1 1 0 011-.27l4.43 1.17a1 1 0 01.74.99z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  </div>
                </div>

                {/* Profile card */}
                <div style={{ backgroundColor: '#fff', padding: '1rem 1rem 0.875rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', borderBottom: '1px solid #F3F3F3' }}>
                  {/* Story ring */}
                  <div style={{ padding: 3, borderRadius: '50%', background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #515BD4 100%)', flexShrink: 0 }}>
                    <div style={{ width: 58, height: 58, borderRadius: '50%', overflow: 'hidden', border: '2.5px solid #fff', position: 'relative' }}>
                      <Image src="/images/avatars/atelier-lima.jpg" alt="atelier.lima" fill style={{ objectFit: 'cover' }} sizes="58px" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1A1A1A', margin: 0 }}>atelier.lima</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#3B82F6"><circle cx="12" cy="12" r="12"/><path d="M7 13l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p style={{ fontSize: '0.63rem', color: '#6B7280', margin: 0 }}>Boutique · Lima, Perú</p>
                  <p style={{ fontSize: '0.6rem', color: '#9CA3AF', margin: 0 }}>12.4k seguidores · 124 publicaciones</p>
                  <button style={{ marginTop: '0.35rem', backgroundColor: '#fff', border: '1.5px solid #D1D5DB', borderRadius: 8, padding: '0.28rem 1.25rem', fontSize: '0.7rem', fontWeight: 600, color: '#1A1A1A', cursor: 'pointer' }}>
                    Ver perfil
                  </button>
                </div>

                {/* Messages */}
                <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 7, scrollbarWidth: 'none' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                      {msg.text && (
                        <div style={{
                          maxWidth: '80%', padding: '7px 11px',
                          borderRadius: msg.role === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                          backgroundColor: msg.role === 'ai' ? '#fff' : 'var(--color-primary)',
                          color: msg.role === 'ai' ? '#1A1A1A' : '#fff',
                          fontSize: '0.73rem', lineHeight: 1.55,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}>
                          {formatText(msg.text)}
                        </div>
                      )}
                      {msg.images && msg.images.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, maxWidth: '88%' }}>
                          {msg.images.map((src) => (
                            <div key={src} style={{ flex: 1, borderRadius: 10, overflow: 'hidden', aspectRatio: '1', position: 'relative', minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                              <Image src={src} alt="producto" fill style={{ objectFit: 'cover' }} sizes="80px" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {typing && (
                    <div className="animate-fade-in">
                      <div style={{ backgroundColor: '#fff', borderRadius: '4px 16px 16px 16px', padding: '9px 13px', display: 'inline-flex', gap: 4, alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chips */}
                <div style={{ backgroundColor: '#fff', borderTop: '1px solid #F3F3F3', padding: '7px 10px 9px' }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {currentStep.chips.map((chip) => (
                      <button key={chip} onClick={() => handleChip(chip)} disabled={typing} style={{
                        backgroundColor: 'transparent', border: '1.5px solid #D1D5DB', color: '#374151',
                        borderRadius: 999, padding: '4px 10px', fontSize: '0.65rem', fontWeight: 600,
                        cursor: typing ? 'not-allowed' : 'pointer', opacity: typing ? 0.5 : 1,
                        transition: 'background 0.15s, border-color 0.15s', whiteSpace: 'nowrap',
                      }}
                        onMouseEnter={(e) => { if (!typing) { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#F5F5F5'; el.style.borderColor = '#9CA3AF' } }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = 'transparent'; el.style.borderColor = '#D1D5DB' }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
