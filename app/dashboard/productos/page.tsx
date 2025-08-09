'use client'

import { useState } from 'react'
import { addProduct } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, Plus } from 'lucide-react'

export default function ProductosPage() {
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await addProduct(formData)
      setSuccess('Producto registrado correctamente')
      // Reset form
      const form = document.getElementById('product-form') as HTMLFormElement
      form?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Package className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">Registra nuevos productos en el inventario</p>
        </div>
      </div>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Registrar Nuevo Producto</span>
          </CardTitle>
          <CardDescription>
            Completa la información del producto para agregarlo al inventario
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="product-form" action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Arroz Diana"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (COP)</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  min="1"
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Select name="ubicacion" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exhibicion">Exhibición</SelectItem>
                    <SelectItem value="bodega1">Bodega 1</SelectItem>
                    <SelectItem value="bodega2">Bodega 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Producto'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
