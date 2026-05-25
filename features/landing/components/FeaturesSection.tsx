const FEATURES = [
  {
    title: 'Multicanal de verdad',
    desc: 'WhatsApp, Instagram DM y Messenger en una sola bandeja. El cliente no nota la diferencia.',
    preview: <MultichannelPreview />,
  },
  {
    title: 'Toma de pedidos guiada',
    desc: 'El agente confirma, suma upsells y registra todo en tu Google Sheet. Tú solo despachas.',
    preview: <OrderPreview />,
  },
  {
    title: 'Habla como peruano',
    desc: 'Entrenado con miles de conversaciones reales. Usa modismos locales sin sonar forzado.',
    preview: <ChatPreview />,
  },
  {
    title: 'Tu humano cuando importa',
    desc: 'Casos delicados se transfieren a ti con un resumen completo. El agente sabe cuándo callarse.',
    preview: <HandoffPreview />,
  },
]

const ALSO_FEATURES = [
  'CRM simple: clientes, pedidos y conversaciones en un solo panel',
  'Reactivación automática de clientes inactivos con la oferta correcta',
]

function MultichannelPreview() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 0' }}>
      {[
        { label: 'WA',  color: '#22c55e', bg: '#F0FDF4' },
        { label: 'IG',  color: '#E1306C', bg: '#FFF0F5' },
        { label: 'MSG', color: '#1877F2', bg: '#EFF6FF' },
      ].map((ch) => (
        <div key={ch.label} style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: ch.bg, border: `1.5px solid ${ch.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: ch.color }}>
          {ch.label}
        </div>
      ))}
      <div style={{ fontSize: '1.25rem', color: 'var(--color-muted)' }}>→</div>
      <div style={{ backgroundColor: 'var(--color-ink)', color: '#fff', borderRadius: 12, padding: '0.5rem 0.875rem', fontSize: '0.75rem', fontWeight: 700 }}>
        1 bandeja
      </div>
    </div>
  )
}

function OrderPreview() {
  const items = [
    { name: '2× Aceite Primor', price: 'S/ 17.80' },
    { name: '6× Huevos pardos', price: 'S/ 4.50' },
    { name: '+ Sublime (regalo)', price: 'S/ 0.00' },
  ]
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ padding: '0.625rem 0.875rem' }}>
        {items.map((item) => (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--color-muted)' }}>{item.name}</span>
            <span style={{ fontWeight: 600 }}>{item.price}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '0.625rem 0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Total</span>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-accent)' }}>S/ 22.30</span>
      </div>
    </div>
  )
}

function ChatPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 14px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
        ¿Causa, te llevo el combo?
      </div>
      <div style={{ backgroundColor: 'var(--color-ink)', color: '#fff', borderRadius: '14px 4px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', fontStyle: 'italic', alignSelf: 'flex-end', maxWidth: '80%' }}>
        Justito, te lo despacho ahora.
      </div>
      <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 14px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
        Pe&apos; bacán, gracias.
      </div>
    </div>
  )
}

function HandoffPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', flexShrink: 0 }}>IA</div>
        <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 10px 10px 10px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', flex: 1 }}>
          Cliente pide reembolso por producto dañado.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.125rem 0.75rem' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
        <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontWeight: 500 }}>↓ transfiere</span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#15803D', flexShrink: 0 }}>Tú</div>
        <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 10px 10px 10px', padding: '0.5rem 0.75rem', fontSize: '0.75rem', flex: 1 }}>
          Resumen + 3 mensajes de contexto.
        </div>
      </div>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '6rem 0', backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            Funcionalidades
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Todo lo que necesita una PYME.<br />Nada que no.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem', alignItems: 'stretch', marginBottom: '2rem' }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="hover-lift"
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                padding: '1.75rem',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                cursor: 'default',
                height: '100%',
              }}
            >
              <div style={{ flex: 1 }}>{f.preview}</div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem 2rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>Y también:</span>
          {ALSO_FEATURES.map((f) => (
            <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-muted)' }}>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>✓</span> {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
