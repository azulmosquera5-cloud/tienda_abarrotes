import { getProducts, getSales } from '@/lib/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Warehouse, TrendingUp, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const products = await getProducts()
  const sales = await getSales()
  
  const totalProducts = products.length
  const totalStock = products.reduce((acc, p) => acc + p.bodega1 + p.bodega2 + p.exhibicion, 0)
  const totalSales = sales.length
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0)
  
  const lowStockProducts = products.filter(p => 
    (p.bodega1 + p.bodega2 + p.exhibicion) < 10
  )

  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const topProducts = products
    .sort((a, b) => (b.bodega1 + b.bodega2 + b.exhibicion) - (a.bodega1 + a.bodega2 + a.exhibicion))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h1>
        <p className="text-blue-100">Gestiona tu inventario de forma inteligente</p>
      </div>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Productos</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              Productos registrados
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stock Total</CardTitle>
            <Warehouse className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalStock.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Unidades en inventario
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ventas</CardTitle>
            <ShoppingCart className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalSales}</div>
            <p className="text-xs text-gray-500 mt-1">
              Transacciones realizadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              COP en ventas
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Alertas de stock bajo */}
      {lowStockProducts.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              ⚠️ Productos con Stock Bajo
            </CardTitle>
            <CardDescription className="text-red-600">
              {lowStockProducts.length} productos con menos de 10 unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowStockProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-red-200">
                  <span className="font-medium capitalize text-gray-900">{product.nombre}</span>
                  <Badge variant="destructive" className="text-xs">
                    {product.bodega1 + product.bodega2 + product.exhibicion} unidades
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Sección de información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con más stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">📦 Productos con Más Stock</CardTitle>
            <CardDescription>Los 5 productos con mayor inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => {
                const totalStock = product.bodega1 + product.bodega2 + product.exhibicion
                return (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium capitalize text-gray-900">{product.nombre}</p>
                        <p className="text-sm text-gray-500">${product.precio.toLocaleString()} COP</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {totalStock} unidades
                    </Badge>
                  </div>
                )
              })}
              {topProducts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay productos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Ventas recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">💰 Ventas Recientes</CardTitle>
            <CardDescription>Últimas 5 transacciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize text-gray-900">{sale.productName}</p>
                    <p className="text-sm text-gray-500">
                      {sale.quantity} × ${sale.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${sale.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
              {recentSales.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay ventas registradas</p>
                  <p className="text-sm text-gray-400">Las ventas aparecerán aquí</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Acciones rápidas */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">🚀 Acciones Rápidas</CardTitle>
          <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/dashboard/productos" 
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              <Package className="h-8 w-8 text-blue-500 group-hover:text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Agregar Producto</span>
            </a>
            
            <a 
              href="/dashboard/ventas" 
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
            >
              <ShoppingCart className="h-8 w-8 text-green-500 group-hover:text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Realizar Venta</span>
            </a>
            
            <a 
              href="/dashboard/inventario" 
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
            >
              <Warehouse className="h-8 w-8 text-purple-500 group-hover:text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ver Inventario</span>
            </a>
            
            <a 
              href="/dashboard/reportes" 
              className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
            >
              <TrendingUp className="h-8 w-8 text-orange-500 group-hover:text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ver Reportes</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
