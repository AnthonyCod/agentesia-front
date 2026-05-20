'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, LayoutGrid, ShoppingCart,
  MessageCircle, DollarSign, Settings, LogOut, X, PlusCircle,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAuth, useAuthStore } from '@/features/auth'

const navItems = [
  { href: '/dashboard',      label: 'Inicio',          icon: LayoutDashboard, exact: true  },
  { href: '/catalog',        label: 'Catálogo',        icon: LayoutGrid,      exact: false },
  { href: '/orders',         label: 'Pedidos',         icon: ShoppingCart,    exact: false },
  { href: '/conversations',  label: 'Conversaciones',  icon: MessageCircle,   exact: false },
  { href: '/commissions',    label: 'Comisiones',      icon: DollarSign,      exact: false },
  { href: '/settings',       label: 'Configuración',   icon: Settings,        exact: false },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const tenant = useAuthStore((s) => s.tenant)

  return (
    <aside
      className="flex h-full w-64 flex-col"
      style={{
        backgroundColor: '#fff',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between px-5"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Image src="/images/logo.png" alt="Luania" width={64} height={64} />
          <div className="overflow-hidden">
            {tenant && (
              <p className="truncate text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {tenant.nombre}
              </p>
            )}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-2 flex-shrink-0 rounded-lg p-1.5 transition-colors lg:hidden"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Cerrar menú">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {/* Banner: sin tienda activa */}
        {!tenant && (
          <Link
            href="/onboarding"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-3 mb-2 text-sm font-semibold transition-all"
            style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            <PlusCircle className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">Configura tu primera tienda</span>
          </Link>
        )}

        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-cream)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)' }} />}
            </Link>
          )
        })}

        {/* Agregar tienda (siempre visible) */}
        {tenant && (
          <Link
            href="/onboarding"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 mt-1"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-cream)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent' }}
          >
            <PlusCircle className="h-4 w-4 flex-shrink-0" />
            Agregar tienda
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={() => { logout(); onClose?.() }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: 'var(--color-muted)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-cream)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
          }}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
