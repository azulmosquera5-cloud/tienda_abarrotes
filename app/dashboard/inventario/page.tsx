import { getProducts } from '@/lib/products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Warehouse, Search } from 'lucide-react'

export default async function InventarioPage() {
  const products = await getProducts()
  
  const inventoryData = products.map(product => {
    const total = product.bodega1 + product.bodega2 + product.exhibicion
    const mainLocation = product.bodega1 >= product.bodega2 && product.bodega1 >= product.exhibicion 
      ? 'Bodega 1'
      : product.bodega2 >= product.exhibicion 
        ? 'Bodega 2' 
        : 'Exhibición'
    
    return {
      ...product,
      total,
      mainLocation,
      status: total < 10 ? 'low' : total < 50 ? 'medium' : 'high'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Warehouse className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-600 mt-1">Consulta el stock de todos los productos</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Stock de Productos</CardTitle>
          <CardDescription>
            Vista detallada del inventario por ubicaciones
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar producto..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold">Bodega 1</th>
                  <th className="text-center py-3 px-4 font-semibold">Bodega 2</th>
                  <th className="text-center py-3 px-4 font-semibold">Exhibición</th>
                  <th className="text-center py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Precio</th>
                  <th className="text-center py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium capitalize">{item.nombre}</div>
                      <div className="text-sm text-gray-500">Principal: {item.mainLocation}</div>
                    </td>
                    <td className="text-center py-3 px-4">{item.bodega1}</td>
                    <td className="text-center py-3 px-4">{item.bodega2}</td>
                    <td className="text-center py-3 px-4">{item.exhibicion}</td>
                    <td className="text-center py-3 px-4 font-semibold">{item.total}</td>
                    <td className="text-center py-3 px-4">${item.precio.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <Badge 
                        variant={
                          item.status === 'low' ? 'destructive' : 
                          item.status === 'medium' ? 'default' : 
                          'secondary'
                        }
                      >
                        {item.status === 'low' ? 'Bajo' : 
                         item.status === 'medium' ? 'Medio' : 
                         'Alto'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
