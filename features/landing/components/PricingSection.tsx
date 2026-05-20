import Link from 'next/link'

const PLANS = [
  {
    name: 'Básico',
    desc: 'Para tiendas que recién empiezan a vender por redes.',
    price: 29,
    commission: '+ 5%',
    commissionLabel: 'por venta cerrada',
    commissionBg: 'var(--color-primary-light)',
    commissionColor: 'var(--color-primary)',
    cta: 'Empezar con Básico',
    ctaStyle: 'outline',
    featured: false,
    features: [
      'Hasta 100 productos',
      '1 canal (Instagram o Facebook)',
      '1,000 mensajes IA / mes',
      'Validación de Yape y Plin',
      'CRM y panel de pedidos',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    desc: 'El plan que eligen 8 de cada 10 tiendas.',
    price: 79,
    commission: '0%',
    commissionLabel: 'sin comisión por venta',
    commissionBg: 'rgba(255,255,255,0.08)',
    commissionColor: '#D4A847',
    cta: 'Activar Pro',
    ctaStyle: 'primary',
    featured: true,
    features: [
      'Productos ilimitados',
      'Instagram + Facebook + WhatsApp',
      'Mensajes IA sin límite',
      'Reactivación automática de clientes',
      'Reportes de ventas semanales',
      'Soporte prioritario por WhatsApp',
    ],
  },
  {
    name: 'Premium',
    desc: 'Para operaciones de alto volumen y equipos.',
    price: 249,
    commission: '0%',
    commissionLabel: 'sin comisión por venta',
    commissionBg: '#F5F5F5',
    commissionColor: 'var(--color-muted)',
    cta: 'Hablar con ventas',
    ctaStyle: 'outline',
    featured: false,
    features: [
      'Todo lo del plan Pro',
      'Tiendas y catálogos ilimitados',
      'Multiusuario para tu equipo',
      'API + integraciones a medida',
      'Onboarding 1 a 1 dedicado',
      'SLA garantizado',
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Planes y precios
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1.25rem' }}>
            Pruébalo gratis un mes.<br />Luego elige el plan que te acomode.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted)', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.7 }}>
            Empieza sin tarjeta, con acceso completo. Después de los 30 días eliges el plan que mejor calce con el tamaño de tu tienda — siempre puedes cambiar de plan o cancelar.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', alignItems: 'stretch', marginBottom: '2rem' }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={plan.featured ? '' : 'hover-lift'}
              style={{
                backgroundColor: plan.featured ? 'var(--color-dark)' : '#fff',
                color: plan.featured ? '#fff' : 'var(--color-ink)',
                borderRadius: 20,
                padding: '2rem 1.75rem',
                border: plan.featured ? 'none' : '1px solid var(--color-border)',
                position: 'relative',
                boxShadow: plan.featured ? '0 20px 60px rgba(0,0,0,0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Badge */}
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: -13,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.375rem 1rem',
                  borderRadius: 999,
                }}>
                  Más elegido
                </div>
              )}

              {/* Plan header */}
              <p style={{ fontWeight: 800, fontSize: '1.375rem', margin: '0 0 0.375rem', letterSpacing: '-0.02em' }}>{plan.name}</p>
              <p style={{ fontSize: '0.825rem', color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>{plan.desc}</p>

              {/* Price */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, paddingBottom: '0.75rem' }}>S/</span>
                  <span style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', color: plan.featured ? 'var(--color-gold)' : 'var(--color-ink)' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)', paddingBottom: '0.75rem' }}>/mes</span>
                </div>
                <div style={{
                  backgroundColor: plan.commissionBg,
                  borderRadius: 10,
                  padding: '0.625rem 0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: plan.commissionColor }}>{plan.commission}</span>
                  <span style={{ fontSize: '0.78rem', color: plan.featured ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)' }}>{plan.commissionLabel}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={plan.name === 'Premium' ? '#contact' : '/register'}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.875rem',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  marginBottom: '1.5rem',
                  border: plan.ctaStyle === 'primary' ? 'none' : `1.5px solid ${plan.featured ? 'rgba(255,255,255,0.3)' : 'var(--color-border)'}`,
                  backgroundColor: plan.ctaStyle === 'primary' ? 'var(--color-primary)' : 'transparent',
                  color: plan.ctaStyle === 'primary' ? '#fff' : (plan.featured ? '#fff' : 'var(--color-ink)'),
                  transition: 'opacity 0.2s',
                }}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <div style={{ borderTop: `1px solid ${plan.featured ? 'rgba(255,255,255,0.1)' : 'var(--color-border)'}`, paddingTop: '1.25rem', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                      <span style={{ color: plan.featured ? 'var(--color-gold)' : 'var(--color-primary)', fontSize: '0.85rem', lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.825rem', color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--color-muted)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div style={{
          backgroundColor: '#FDF8EC',
          border: '1px solid #E8D9A0',
          borderRadius: 16,
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--color-dark)', color: '#D4A847', borderRadius: 8, padding: '0.375rem 0.75rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              🌙 30 días gratis
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Empieza sin pagar nada.</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', margin: 0 }}>Acceso completo al plan que elijas durante el primer mes. Sin tarjeta de crédito.</p>
            </div>
          </div>
          <Link
            href="/register"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.875rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 10,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            Empezar gratis <span>→</span>
          </Link>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '1.25rem' }}>
          Todos los precios incluyen IGV. Sin contratos largos · cancela cuando quieras · cambia de plan en cualquier momento.
        </p>
      </div>
    </section>
  )
}
