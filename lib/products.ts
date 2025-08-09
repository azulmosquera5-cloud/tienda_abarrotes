'use server'

import { promises as fs } from 'fs'
import path from 'path'
import type { Product, Sale } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'productos.json')
const SALES_PATH = path.join(process.cwd(), 'data', 'ventas.json')

// Asegurar que el directorio data existe
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const products = JSON.parse(data)
    
    return products.map((p: any, index: number) => ({
      id: p.id || `product-${index}`,
      nombre: p.nombre,
      precio: p.precio,
      bodega1: p.bodega1 || 0,
      bodega2: p.bodega2 || 0,
      exhibicion: p.exhibicion || 0
    }))
  } catch {
    return []
  }
}

export async function saveProducts(products: Product[]) {
  await ensureDataDir()
  await fs.writeFile(DB_PATH, JSON.stringify(products, null, 2))
}

export async function addProduct(formData: FormData) {
  const nombre = formData.get('nombre') as string
  const precio = parseFloat(formData.get('precio') as string)
  const cantidad = parseInt(formData.get('cantidad') as string)
  const ubicacion = formData.get('ubicacion') as string
  
  const products = await getProducts()
  
  const existingProduct = products.find(p => 
    p.nombre.toLowerCase() === nombre.toLowerCase() && p.precio === precio
  )
  
  if (existingProduct) {
    existingProduct[ubicacion as keyof Pick<Product, 'bodega1' | 'bodega2' | 'exhibicion'>] += cantidad
  } else {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      nombre: nombre.toLowerCase(),
      precio,
      bodega1: ubicacion === 'bodega1' ? cantidad : 0,
      bodega2: ubicacion === 'bodega2' ? cantidad : 0,
      exhibicion: ubicacion === 'exhibicion' ? cantidad : 0
    }
    products.push(newProduct)
  }
  
  await saveProducts(products)
}

export async function sellProduct(productName: string, quantity: number) {
  const products = await getProducts()
  const product = products.find(p => p.nombre === productName)
  
  if (!product || product.exhibicion < quantity) {
    throw new Error('Producto no disponible o cantidad insuficiente')
  }
  
  product.exhibicion -= quantity
  await saveProducts(products)
  
  // Registrar venta
  const sales = await getSales()
  const sale: Sale = {
    id: `sale-${Date.now()}`,
    productName: product.nombre,
    quantity,
    price: product.precio,
    total: product.precio * quantity,
    date: new Date().toISOString()
  }
  
  sales.push(sale)
  await saveSales(sales)
}

export async function getSales(): Promise<Sale[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(SALES_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveSales(sales: Sale[]) {
  await ensureDataDir()
  await fs.writeFile(SALES_PATH, JSON.stringify(sales, null, 2))
}

export async function moveProduct(formData: FormData) {
  const nombre = formData.get('nombre') as string
  const cantidad = parseInt(formData.get('cantidad') as string)
  const origen = formData.get('origen') as keyof Pick<Product, 'bodega1' | 'bodega2' | 'exhibicion'>
  const destino = formData.get('destino') as keyof Pick<Product, 'bodega1' | 'bodega2' | 'exhibicion'>
  
  const products = await getProducts()
  const product = products.find(p => p.nombre.toLowerCase() === nombre.toLowerCase())
  
  if (!product) {
    throw new Error('Producto no encontrado')
  }
  
  if (product[origen] < cantidad) {
    throw new Error('Cantidad insuficiente en ubicación origen')
  }
  
  product[origen] -= cantidad
  product[destino] += cantidad
  
  await saveProducts(products)
}
