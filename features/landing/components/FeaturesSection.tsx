const FEATURES = [
  {
    title: 'CRM simple, no enterprise',
    desc: 'Todas tus conversaciones, clientes y pedidos en una pantalla. Sin pestañas infinitas.',
    preview: <CrmPreview />,
  },
  {
    title: 'Habla como peruano',
    desc: 'Entrenado con miles de conversaciones reales. Usa modismos locales sin sonar forzado.',
    preview: <ChatPreview />,
  },
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
    title: 'Reactivación automática',
    desc: 'Detecta clientes inactivos y los contacta con la oferta correcta — sin spamear.',
    preview: <ReactivationPreview />,
  },
  {
    title: 'Tu humano cuando importa',
    desc: 'Casos delicados se transfieren a ti con un resumen. El agente sabe cuándo callarse.',
    preview: <HandoffPreview />,
  },
]

function CrmPreview() {
  const clients = [
    { name: 'Rosa Cárdenas', detail: '3 pedidos · S/ 412', badge: 'activo', color: '#22c55e' },
    { name: 'Juan Mendoza', detail: '12 pedidos · S/ 1,840', badge: 'VIP', color: '#F59E0B' },
    { name: 'Andrés Salinas', detail: '1 pedido · S/ 320', badge: 'nuevo', color: '#3B82F6' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {clients.map((c) => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: 10, border: '1px solid var(--color-border)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-muted)', flexShrink: 0 }}>
            {c.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.75rem', margin: 0 }}>{c.name}</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--color-muted)', margin: 0 }}>{c.detail}</p>
          </div>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#fff', backgroundColor: c.color, borderRadius: 4, padding: '2px 7px' }}>{c.badge}</span>
        </div>
      ))}
    </div>
  )
}

function ChatPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 14px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
        ¿Causa, te llevo el combo?
      </div>
      <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '14px 4px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', fontStyle: 'italic', alignSelf: 'flex-end', maxWidth: '80%' }}>
        Justito, te lo despacho ahora.
      </div>
      <div style={{ backgroundColor: '#F3F4F6', borderRadius: '4px 14px 14px 14px', padding: '0.5rem 0.75rem', fontSize: '0.78rem', alignSelf: 'flex-start', maxWidth: '80%' }}>
        Pe&apos; bacán, gracias.
      </div>
    </div>
  )
}

function MultichannelPreview() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 0' }}>
      {[
        { label: 'WA', color: '#22c55e', bg: '#F0FDF4' },
        { label: 'IG', color: '#E1306C', bg: '#FFF0F5' },
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
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary)' }}>S/ 22.30</span>
      </div>
    </div>
  )
}

function ReactivationPreview() {
  return (
    <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
      <div style={{ width: '100%', height: 60, position: 'relative', marginBottom: '0.75rem' }}>
        <svg viewBox="0 0 200 60" style={{ width: '100%', height: '100%' }}>
          <polyline points="0,50 30,45 60,40 90,35 120,30 150,20 180,15 200,10" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="180" cy="15" r="4" fill="var(--color-primary)" />
        </svg>
      </div>
      <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem' }}>+47 clientes reactivados este mes</p>
    </div>
  )
}

function HandoffPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>IA</div>
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
          <p className="section-badge" style={{ justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Funcionalidades
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
            Todo lo que necesita una PYME.<br />Nada que no.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
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
      </div>
    </section>
  )
}
