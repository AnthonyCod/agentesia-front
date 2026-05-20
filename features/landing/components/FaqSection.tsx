'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: '¿Necesito saber programar?',
    a: 'No. Creas tu cuenta en Luania, agregas tus productos, pegas tu @usuario de Instagram y autorizas con Meta. Si sabes usar Instagram, sabes usar Luania.',
  },
  {
    q: '¿Cómo conecto mi Instagram o Facebook?',
    a: 'Desde el panel de Luania vas a "Canales", pegas tu @usuario o ID de página, y haces clic en "Conectar con Meta". El proceso toma menos de 30 segundos y no necesitas ningún código ni herramienta externa.',
  },
  {
    q: '¿Cómo funcionan los planes y la comisión?',
    a: 'El plan Básico (S/ 29/mes) cobra una comisión del 5% por cada venta cerrada a través de Luania. Los planes Pro y Premium no tienen comisión — pagas una tarifa fija mensual y te quedas con el 100% de tus ventas.',
  },
  {
    q: '¿Hay límite de productos, mensajes o tiendas?',
    a: 'El plan Básico permite hasta 100 productos, 1 canal y 1,000 mensajes IA por mes. El plan Pro y Premium son ilimitados en productos y mensajes. El plan Premium además permite múltiples tiendas y catálogos.',
  },
  {
    q: '¿Y si el agente comete un error?',
    a: 'Luania aprende de cada conversación. Ante situaciones delicadas (quejas, reembolsos, pagos en disputa) el agente transfiere automáticamente a ti con un resumen completo. Tú siempre tienes el control y puedes intervenir en cualquier momento.',
  },
  {
    q: '¿Qué pasa con los datos de mis clientes?',
    a: 'Todos los datos son tuyos. Luania no vende ni comparte tu información ni la de tus clientes con terceros. Cumplimos con la Ley 29733 de Protección de Datos Personales del Perú y puedes exportar o eliminar tus datos cuando quieras.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, sin contratos largos ni penalidades. Puedes cancelar, pausar o cambiar de plan en cualquier momento desde tu panel. Si cancelas, tu cuenta queda activa hasta el final del período pagado.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Preguntas frecuentes
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
            Lo que todos preguntan<br />antes de empezar.
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '1.5rem 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '1rem',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '1.0625rem', color: 'var(--color-ink)', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: open === i ? 'var(--color-primary)' : 'transparent',
                  border: `1.5px solid ${open === i ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  <span style={{
                    display: 'block',
                    width: 12,
                    height: 2,
                    backgroundColor: open === i ? '#fff' : 'var(--color-muted)',
                    position: 'relative',
                    transition: 'transform 0.2s',
                  }}>
                    {open !== i && (
                      <span style={{
                        display: 'block',
                        width: 2,
                        height: 12,
                        backgroundColor: 'var(--color-muted)',
                        position: 'absolute',
                        top: -5,
                        left: 5,
                      }} />
                    )}
                  </span>
                </div>
              </button>

              {open === i && (
                <div
                  className="animate-fade-in"
                  style={{ paddingBottom: '1.5rem' }}
                >
                  <p style={{ fontSize: '0.9375rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.7 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
