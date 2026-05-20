import Link from 'next/link'

export function CtaSection() {
  return (
    <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{
          backgroundColor: 'var(--color-dark)',
          borderRadius: 24,
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background circle decoration */}
          <div style={{
            position: 'absolute',
            right: '-8rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.03)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            right: '-4rem',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 280,
            height: 280,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.03)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', maxWidth: '36rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, backgroundColor: 'var(--color-gold)' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                1 mes gratis · luego 5% por venta · sin tarjeta
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#fff',
              margin: '0 0 1.25rem',
            }}>
              Cada noche sin Luania,<br />son ventas que se pierden.
            </h2>

            <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
              El 30% de los mensajes en Instagram quedan sin responder fuera del horario comercial. Con Luania, tu tienda atiende, asesora y cierra ventas mientras tú descansas.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
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
                  boxShadow: '0 4px 20px rgba(197,48,48,0.4)',
                  transition: 'opacity 0.2s',
                }}
              >
                Empezar prueba gratis <span>→</span>
              </Link>
              <a
                href="#contact"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.875rem 1.75rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  display: 'inline-block',
                  transition: 'background 0.2s',
                }}
              >
                Agendar demo con un humano
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
