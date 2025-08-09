'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Warehouse, BarChart3, ArrowRightLeft } from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Productos',
    href: '/dashboard/productos',
    icon: Package
  },
  {
    name: 'Inventario',
    href: '/dashboard/inventario',
    icon: Warehouse
  },
  {
    name: 'Ventas',
    href: '/dashboard/ventas',
    icon: ShoppingCart
  },
  {
    name: 'Mover Productos',
    href: '/dashboard/mover',
    icon: ArrowRightLeft
  },
  {
    name: 'Reportes',
    href: '/dashboard/reportes',
    icon: BarChart3
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
