'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Demo', href: '#demo' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Por qué', href: '#features' },
  { label: 'Precios', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 0 rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/images/logo.png" alt="Luania" width={120} height={36} priority style={{ height: 36, width: 'auto' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  opacity: 0.75,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.opacity = '0.75' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--color-ink)',
                textDecoration: 'none',
                opacity: 0.75,
              }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--color-primary-hover)' }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = 'var(--color-primary)' }}
            >
              Probar gratis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            style={{ color: 'var(--color-ink)' }}
          >
            <div style={{ width: 22, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ display: 'block', height: 2, backgroundColor: 'currentColor', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
              <span style={{ display: 'block', height: 2, backgroundColor: 'currentColor', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
              <span style={{ display: 'block', height: 2, backgroundColor: 'currentColor', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: 'var(--color-cream)', borderTop: '1px solid var(--color-border)', padding: '1rem 1.5rem 1.5rem' }}>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/login" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'none' }}>
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                Probar gratis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
