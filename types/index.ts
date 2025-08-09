export interface Product {
  id: string;
  nombre: string;
  precio: number;
  bodega1: number;
  bodega2: number;
  exhibicion: number;
}

export interface User {
  id: string;
  usuario: string;
  role: 'admin' | 'employee';
}

export interface Sale {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
