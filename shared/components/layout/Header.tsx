'use client'
import { Store, ChevronDown, Menu, Bell } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useAuth } from '@/features/auth'

interface HeaderProps { onMenuClick?: () => void }

export function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)
  const tenants = useAuthStore((s) => s.tenants)
  const { selectTenant, isSelectingTenant } = useAuth()

  return (
    <header
      className="flex h-16 flex-shrink-0 items-center justify-between px-4 sm:px-6"
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="flex-shrink-0 rounded-lg p-2 transition-colors lg:hidden"
          style={{ color: 'var(--color-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tenant switcher */}
        {tenants.length > 1 && tenant && (
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--color-ink)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              disabled={isSelectingTenant}
            >
              <Store className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
              <span className="hidden max-w-[120px] truncate sm:inline">{tenant.nombre}</span>
              <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--color-muted)' }} />
            </button>
            <div className="absolute left-0 top-full z-10 mt-1 hidden w-52 rounded-xl border bg-white shadow-lg group-hover:block"
              style={{ borderColor: 'var(--color-border)' }}>
              {tenants.map((t) => (
                <button key={t.id} onClick={() => selectTenant(t.id)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
                  style={{
                    fontWeight: t.id === tenant.id ? 700 : 400,
                    color: t.id === tenant.id ? 'var(--color-primary)' : 'var(--color-ink)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {t.nombre}
                  {t.id === tenant.id && (
                    <span className="ml-auto text-xs" style={{ color: 'var(--color-primary)' }}>Activa</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          className="rounded-lg p-2 transition-colors"
          style={{ color: 'var(--color-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-cream)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
        </button>

        {user && (
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <span className="hidden max-w-[120px] truncate text-sm font-semibold sm:inline"
              style={{ color: 'var(--color-ink)' }}>
              {user.nombre}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
