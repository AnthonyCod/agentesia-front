'use client'
import { useAuthStore, useAuth } from '@/features/auth'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardContent } from '@/shared/components/ui/Card'

export default function SelectTenantPage() {
  const tenants = useAuthStore((s) => s.tenants)
  const { selectTenant, isSelectingTenant } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          Selecciona tu tienda
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Tienes varias tiendas. ¿Con cuál quieres trabajar hoy?
        </p>
        <div className="space-y-2">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{tenant.nombre}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{tenant.ig_page_id}</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => selectTenant(tenant.id)}
                    loading={isSelectingTenant}
                  >
                    Entrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
