'use client'

import { useState, useEffect } from 'react'
import { getProducts, sellProduct } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShoppingCart, Search } from 'lucide-react'
import type { Product } from '@/types'

export default function VentasPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.exhibicion > 0
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  async function loadProducts() {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError('Error al cargar productos')
    }
  }

  async function handleSell(productName: string, quantity: number) {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await sellProduct(productName, quantity)
      setSuccess(`Venta realizada: ${quantity} unidades de ${productName}`)
      await loadProducts() // Recargar productos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al realizar venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShoppingCart className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
          <p className="text-gray-600 mt-1">Realiza ventas de productos en exhibición</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Productos Disponibles</CardTitle>
          <CardDescription>
            Solo se muestran productos con stock en exhibición
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar producto..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold">Precio</th>
                  <th className="text-center py-3 px-4 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium capitalize">{product.nombre}</div>
                    </td>
                    <td className="text-center py-3 px-4">{product.exhibicion}</td>
                    <td className="text-center py-3 px-4">${product.precio.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault()
                          const formData = new FormData(e.currentTarget)
                          const quantity = parseInt(formData.get('quantity') as string)
                          handleSell(product.nombre, quantity)
                        }}
                        className="flex items-center space-x-2 justify-center"
                      >
                        <Input
                          name="quantity"
                          type="number"
                          min="1"
                          max={product.exhibicion}
                          placeholder="Cant."
                          className="w-20"
                          required
                        />
                        <Button 
                          type="submit" 
                          size="sm"
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Vender
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay productos disponibles para venta
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
