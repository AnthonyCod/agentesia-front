'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LayoutGrid,
  ShoppingCart,
  MessageCircle,
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useAuth } from '@/features/auth'
import { useAuthStore } from '@/features/auth'

const navItems = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/catalog', label: 'Catálogo', icon: LayoutGrid, exact: false },
  { href: '/orders', label: 'Pedidos', icon: ShoppingCart, exact: false },
  { href: '/conversations', label: 'Conversaciones', icon: MessageCircle, exact: false },
  { href: '/commissions', label: 'Comisiones', icon: DollarSign, exact: false },
  { href: '/settings', label: 'Configuración', icon: Settings, exact: false },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const tenant = useAuthStore((s) => s.tenant)

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex h-16 flex-col justify-center border-b border-gray-200 px-6 dark:border-gray-700">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">Agentesia</span>
        {tenant && (
          <span className="truncate text-xs text-gray-400 dark:text-gray-500">{tenant.nombre}</span>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
