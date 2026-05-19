'use client'
import { useTheme } from 'next-themes'
import { Sun, Moon, Store, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useAuth } from '@/features/auth'

export function Header() {
  const { theme, setTheme } = useTheme()
  const user = useAuthStore((s) => s.user)
  const tenant = useAuthStore((s) => s.tenant)
  const tenants = useAuthStore((s) => s.tenants)
  const { selectTenant, isSelectingTenant } = useAuth()

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
      {/* Tenant switcher (si tiene más de uno) */}
      <div>
        {tenants.length > 1 && tenant && (
          <div className="relative group">
            <button
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              disabled={isSelectingTenant}
            >
              <Store className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{tenant.nombre}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>
            <div className="absolute left-0 top-full z-10 mt-1 hidden w-52 rounded-lg border border-gray-200 bg-white shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-900">
              {tenants.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTenant(t.id)}
                  className={[
                    'flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800',
                    t.id === tenant.id
                      ? 'font-medium text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300',
                  ].join(' ')}
                >
                  {t.nombre}
                  {t.id === tenant.id && <span className="ml-auto text-xs text-blue-400">Activa</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.nombre}</span>
          </div>
        )}
      </div>
    </header>
  )
}
