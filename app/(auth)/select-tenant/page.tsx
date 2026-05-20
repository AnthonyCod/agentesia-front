'use client'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { useAuthStore, useAuth } from '@/features/auth'
import { Button } from '@/shared/components/ui/Button'

export default function SelectTenantPage() {
  const tenants = useAuthStore((s) => s.tenants)
  const { selectTenant, isSelectingTenant } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-3 block">🌙</span>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>
            Selecciona tu tienda
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-muted)' }}>
            Tienes varias tiendas. ¿Con cuál trabajas hoy?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="rounded-2xl bg-white p-5"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: 'var(--color-ink)' }}>
                    {tenant.nombre}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
                    @{tenant.ig_page_id}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => selectTenant(tenant.id)}
                  loading={isSelectingTenant}
                >
                  Entrar
                </Button>
              </div>
            </div>
          ))}

          {/* Crear nueva tienda */}
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 rounded-2xl p-5 text-sm font-semibold transition-all"
            style={{
              border: '1.5px dashed var(--color-border)',
              color: 'var(--color-muted)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-primary)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-primary)'
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--color-primary-light)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)'
              ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Crear nueva tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
