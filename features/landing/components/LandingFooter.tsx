import Link from 'next/link'
import Image from 'next/image'

const FOOTER_LINKS = {
  Producto: [
    { label: 'Demo', href: '#demo' },
    { label: 'Cómo funciona', href: '#how-it-works' },
    { label: 'Casos de uso', href: '#features' },
    { label: 'Precios', href: '#pricing' },
  ],
  Empresa: [
    { label: 'Sobre Luania', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/jobs' },
    { label: 'Contacto', href: '/contact' },
  ],
  Legal: [
    { label: 'Términos', href: '/terms' },
    { label: 'Privacidad', href: '/privacy' },
    { label: 'Protección de datos', href: '/data-protection' },
  ],
}

export function LandingFooter() {
  return (
    <footer style={{ backgroundColor: 'var(--color-cream)', padding: '4rem 0 2rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4" style={{ marginBottom: '3rem' }}>
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div style={{ marginBottom: '1rem' }}>
              <Image src="/images/logo.png" alt="Luania" width={72} height={72} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.7, margin: 0, maxWidth: '18rem' }}>
              El vendedor IA hecho para PYMEs peruanas.<br />Construido en Lima 🇵🇪
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', margin: '0 0 1.25rem' }}>{col}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-ink)',
                      textDecoration: 'none',
                      opacity: 0.75,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0 }}>
            © 2026 Luania · RUC 20611234567
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: 0 }}>
            Av. Pardo y Aliaga 699, San Isidro, Lima
          </p>
        </div>
      </div>
    </footer>
  )
}
