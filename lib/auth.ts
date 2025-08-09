'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { User } from '@/types'

const ADMIN_CREDENTIALS = {
  usuario: 'admin',
  contraseña: '1234'
}

export async function login(formData: FormData) {
  const usuario = formData.get('usuario') as string
  const contraseña = formData.get('contraseña') as string
  
  if (usuario === ADMIN_CREDENTIALS.usuario && contraseña === ADMIN_CREDENTIALS.contraseña) {
    const cookieStore = await cookies()
    
    // Crear token simple (en producción usar JWT)
    const token = Buffer.from(`${usuario}:${Date.now()}`).toString('base64')
    
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    redirect('/dashboard')
  } else {
    throw new Error('Credenciales incorrectas')
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  redirect('/login')
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) return null
  
  try {
    const decoded = Buffer.from(token.value, 'base64').toString()
    const [usuario] = decoded.split(':')
    
    return {
      id: '1',
      usuario,
      role: 'admin'
    }
  } catch {
    return null
  }
}
