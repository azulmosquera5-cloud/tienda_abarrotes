'use client'

import { useState } from 'react'
import { moveProduct } from '@/lib/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRightLeft } from 'lucide-react'

export default function MoverPage() {
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await moveProduct(formData)
      setSuccess('Producto movido correctamente')
      // Reset form
      const form = document.getElementById('move-form') as HTMLFormElement
      form?.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al mover producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ArrowRightLeft className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mover Productos</h1>
          <p className="text-gray-600 mt-1">Transfiere productos entre ubicaciones</p>
        </div>
      </div>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Transferir Producto</CardTitle>
          <CardDescription>
            Mueve productos entre bodega 1, bodega 2 y exhibición
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form id="move-form" action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Nombre exacto del producto"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad a Mover</Label>
              <Input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                placeholder="0"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origen">Ubicación Origen</Label>
                <Select name="origen" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Desde..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodega1">Bodega 1</SelectItem>
                    <SelectItem value="bodega2">Bodega 2</SelectItem>
                    <SelectItem value="exhibicion">Exhibición</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destino">Ubicación Destino</Label>
                <Select name="destino" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Hacia..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodega1">Bodega 1</SelectItem>
                    <SelectItem value="bodega2">Bodega 2</SelectItem>
                    <SelectItem value="exhibicion">Exhibición</SelectItem>
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
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Moviendo...' : 'Mover Producto'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
