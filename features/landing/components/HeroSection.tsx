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
  {
    chips: ['¿Tienes algo floreado talla M?', '¿Hacen delivery?', 'Ver novedades'],
    aiResponse: '',
  },
  {
    chips: ['Quiero el Vestido Camila', 'Quiero la Blusa Renata'],
    aiResponse: '¡Claro! 😊 Tenemos 3 opciones floreadas en talla M disponibles ahora mismo:',
    aiImages: [
      '/images/productos/vestido-camila.jpg',
      '/images/productos/blusa-renata.jpg',
      '/images/productos/falda-mia.jpg',
    ],
  },
  {
    chips: ['Pago por Yape', 'Pago por Plin'],
    aiResponse: '¡Perfecto! 🎉 El **Vestido Camila** es S/ 79 y está en stock. ¿Cómo prefieres pagar?',
  },
  {
    chips: ['¡Listo, pagué! ✓', 'Tengo otra pregunta'],
    aiResponse: '✅ Pago recibido por Yape. Preparamos tu pedido ahora.\n\n📍 Llega hoy entre 3–5 pm. ¡Gracias por tu compra! 🛍️',
  },
]

const NOVEDADES_STEP: Step = {
  chips: ['Quiero la Chompa Olivia', '¿Hacen delivery?'],
  aiResponse: '¡Aquí las últimas llegadas de esta semana! 🆕✨',
  aiImages: [
    '/images/productos/chompa-olivia.jpg',
    '/images/productos/pantalon-sofia.jpg',
  ],
}

const DELIVERY_STEP: Step = {
  chips: ['¿Tienes algo floreado talla M?', 'Ver novedades'],
  aiResponse: '¡Sí! 🚚 Hacemos delivery a toda Lima por S/ 8. Para provincia S/ 15. El pedido llega en el día si lo haces antes de las 2pm.',
}

const FIRST_AI_MESSAGE = '¡Hola! 👋 Bienvenida a Atelier Lima. ¿En qué te puedo ayudar?'

const TRUST_AVATARS = [
  { src: '/images/avatars/maria.jpg',   name: 'María'  },
  { src: '/images/avatars/camila.jpg',  name: 'Camila' },
  { src: '/images/avatars/andrea.jpg',  name: 'Andrea' },
  { src: '/images/avatars/lucia.jpg',   name: 'Lucía'  },
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

export function HeroSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(DEMO_STEPS[0])
  const [showYapeNotif, setShowYapeNotif] = useState(false)
  const [showPedidoNotif, setShowPedidoNotif] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const stepIndexRef = useRef(0)

  const nextId = () => { idRef.current += 1; return idRef.current }

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages([{ id: nextId(), role: 'ai', text: FIRST_AI_MESSAGE }])
      setShowPedidoNotif(true)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const handleChip = (chip: string) => {
    if (typing) return

    const userMsg: Message = { id: nextId(), role: 'user', text: chip }
    setMessages((prev) => [...prev, userMsg])

    let nextStep: Step

    if (chip === 'Ver novedades') {
      nextStep = NOVEDADES_STEP
    } else if (chip === '¿Hacen delivery?') {
      nextStep = DELIVERY_STEP
    } else {
      stepIndexRef.current += 1
      nextStep = DEMO_STEPS[Math.min(stepIndexRef.current, DEMO_STEPS.length - 1)]
    }

    if (!nextStep.aiResponse) return

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'ai', text: nextStep.aiResponse, images: nextStep.aiImages },
      ])
      setCurrentStep(nextStep)
      if (stepIndexRef.current >= DEMO_STEPS.length - 1) {
        setTimeout(() => setShowYapeNotif(true), 400)
      }
    }, 900 + (nextStep.aiImages ? 300 : 0))
  }

  return (
    <section id="demo" style={{ padding: '7rem 0 6rem', overflow: 'hidden' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-16">

          {/* ── Left: copy ── */}
          <div>
            <p className="section-badge animate-fade-in-down" style={{ marginBottom: '2rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Hecho en Perú · Para PYMEs peruanas
            </p>

            <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ink)', animationDelay: '0.1s' }}>
              Tu tienda<br />vende sola.<br />
              Tú{' '}
              <em style={{ fontFamily: 'var(--font-display, Georgia, serif)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-primary)' }}>
                descansas.
              </em>
            </h1>

            <p className="animate-fade-in-up" style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--color-muted)', marginBottom: '2.25rem', maxWidth: '30rem', animationDelay: '0.2s' }}>
              El primer vendedor con IA diseñado para tiendas que venden por{' '}
              <strong style={{ color: 'var(--color-ink)' }}>Instagram y Facebook</strong> sin web propia.
              Responde, asesora y cierra ventas 24/7.{' '}
              <strong style={{ color: 'var(--color-ink)' }}>Empieza gratis 30 días — luego planes desde S/ 29/mes.</strong>
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <Link
                href="/register"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s ease, transform 0.2s var(--ease-spring), box-shadow 0.2s ease',
                  boxShadow: '0 4px 20px rgba(197,48,48,0.32)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'var(--color-primary-hover)'
                  el.style.transform = 'translateY(-2px) scale(1.02)'
                  el.style.boxShadow = '0 8px 28px rgba(197,48,48,0.4)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'var(--color-primary)'
                  el.style.transform = ''
                  el.style.boxShadow = '0 4px 20px rgba(197,48,48,0.32)'
                }}
              >
                Crear mi cuenta gratis <span>→</span>
              </Link>
              <a
                href="#how-it-works"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-ink)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  border: '1.5px solid var(--color-border)',
                  display: 'inline-block',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.2s var(--ease-spring)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--color-ink)'
                  el.style.backgroundColor = 'rgba(26,26,26,0.04)'
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--color-border)'
                  el.style.backgroundColor = 'transparent'
                  el.style.transform = ''
                }}
              >
                Ver demo en vivo
              </a>
            </div>

            {/* Social proof — real avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ display: 'flex' }}>
                {TRUST_AVATARS.map((av, i) => (
                  <div
                    key={av.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginLeft: i > 0 ? -10 : 0,
                      border: '2.5px solid var(--color-cream)',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Image src={av.src} alt={av.name} fill style={{ objectFit: 'cover' }} sizes="36px" />
                  </div>
                ))}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: 'var(--color-border)', color: 'var(--color-muted)',
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginLeft: -10, border: '2.5px solid var(--color-cream)', flexShrink: 0,
                }}>
                  +
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ color: '#F59E0B', fontSize: '0.85rem' }}>★★★★★</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>4.9 / 5</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>· 127 reseñas</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: '0.125rem 0 0' }}>
                  <strong style={{ color: 'var(--color-ink)' }}>340+</strong> negocios peruanos ya venden con Luania
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Phone mockup ── */}
          <div className="flex justify-center" style={{ position: 'relative', padding: '2rem 1rem 1rem' }}>

            {/* Pedido notification */}
            {showPedidoNotif && (
              <div className="animate-fade-in-up hidden sm:flex" style={{
                position: 'absolute', top: '0.5rem', left: '0', zIndex: 10,
                backgroundColor: '#fff', borderRadius: 14, padding: '0.625rem 0.875rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)', alignItems: 'center', gap: '0.625rem', minWidth: 190,
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#E1306C,#833AB4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontSize: '1rem' }}>📷</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Pedido cerrado en IG</p>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>+S/ 89.00</p>
                </div>
              </div>
            )}

            {/* Response time badge */}
            <div className="hidden sm:block" style={{
              position: 'absolute', bottom: '7rem', right: '0', zIndex: 10,
              backgroundColor: '#fff', borderRadius: 14, padding: '0.625rem 0.875rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14)', textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.25rem' }}>Tiempo de respuesta</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>2.1<span style={{ fontSize: '0.85rem' }}>s</span></p>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', margin: '0.375rem auto 0' }} />
            </div>

            {/* Yape notification */}
            {showYapeNotif && (
              <div className="animate-fade-in-up hidden sm:flex" style={{
                position: 'absolute', bottom: '3.5rem', left: '0', zIndex: 10,
                backgroundColor: '#fff', borderRadius: 14, padding: '0.625rem 0.875rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)', alignItems: 'center', gap: '0.625rem',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#5B2D8E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>Y</div>
                <div>
                  <p style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yape validado</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22c55e', margin: 0 }}>✓ Pago OK</p>
                </div>
              </div>
            )}

            {/* Phone frame */}
            <div className="animate-float" style={{
              width: 'clamp(260px, 80vw, 300px)',
              minHeight: 560,
              maxHeight: 620,
              backgroundColor: '#0F0F0F',
              borderRadius: 40,
              padding: '12px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.1)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ backgroundColor: '#F0F2F5', borderRadius: 30, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Status bar */}
                <div style={{ backgroundColor: '#fff', padding: '8px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A1A1A' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: '0.6rem' }}>
                    <span>▐▐▐</span><span>WiFi</span><span>🔋</span>
                  </div>
                </div>

                {/* Chat header — real avatar */}
                <div style={{ backgroundColor: '#fff', padding: '8px 12px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <Image src="/images/avatars/atelier-lima.jpg" alt="atelier.lima" fill style={{ objectFit: 'cover' }} sizes="38px" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1A1A1A', margin: 0 }}>atelier.lima</p>
                      <span style={{ color: '#3B82F6', fontSize: '0.7rem' }}>✓</span>
                    </div>
                    <p style={{ fontSize: '0.62rem', color: '#6B7280', margin: 0 }}>
                      Boutique · Lima · <strong style={{ color: '#22c55e' }}>● IA activa</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: '1rem', color: '#374151' }}>📞</span>
                    <span style={{ fontSize: '1rem', color: '#374151' }}>🎥</span>
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 8, scrollbarWidth: 'none' }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
                      {/* Text bubble */}
                      {msg.text && (
                        <div style={{
                          maxWidth: '82%',
                          padding: '7px 11px',
                          borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                          backgroundColor: msg.role === 'ai' ? '#fff' : 'var(--color-primary)',
                          color: msg.role === 'ai' ? '#1A1A1A' : '#fff',
                          fontSize: '0.72rem',
                          lineHeight: 1.55,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                        }}>
                          {formatText(msg.text)}
                        </div>
                      )}
                      {/* Product image grid */}
                      {msg.images && msg.images.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, maxWidth: '90%' }}>
                          {msg.images.map((src) => (
                            <div key={src} style={{ flex: 1, borderRadius: 10, overflow: 'hidden', aspectRatio: '1', position: 'relative', minWidth: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                              <Image src={src} alt="producto" fill style={{ objectFit: 'cover' }} sizes="80px" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {typing && (
                    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ backgroundColor: '#fff', borderRadius: '4px 14px 14px 14px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chips */}
                <div style={{ backgroundColor: '#fff', borderTop: '1px solid #E5E7EB', padding: '7px 8px' }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {currentStep.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChip(chip)}
                        disabled={typing}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1.5px solid var(--color-primary)',
                          color: 'var(--color-primary)',
                          borderRadius: 999,
                          padding: '3px 9px',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          cursor: typing ? 'not-allowed' : 'pointer',
                          opacity: typing ? 0.5 : 1,
                          transition: 'background 0.15s, color 0.15s, transform 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          if (!typing) {
                            const el = e.currentTarget as HTMLButtonElement
                            el.style.backgroundColor = 'var(--color-primary)'
                            el.style.color = '#fff'
                            el.style.transform = 'scale(1.04)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.backgroundColor = 'transparent'
                          el.style.color = 'var(--color-primary)'
                          el.style.transform = ''
                        }}
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
