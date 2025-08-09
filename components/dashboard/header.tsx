import { Button } from '@/components/ui/button'
import { logout, getUser } from '@/lib/auth'
import { LogOut, User, Store } from 'lucide-react'

export async function DashboardHeader() {
  const user = await getUser()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EL GALERAS</h1>
            <p className="text-sm text-gray-500">Sistema de Gestión</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Bienvenido, {user?.usuario}</span>
          </div>
          
          <form action={logout}>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
