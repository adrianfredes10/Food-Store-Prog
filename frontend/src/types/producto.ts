import type { Categoria } from './categoria'
import type { Ingrediente } from './ingrediente'

export interface IngredienteConCantidad extends Ingrediente {
  cantidad: number
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  imagen_url: string | null
  categoria: Categoria
  ingredientes: IngredienteConCantidad[]
}

export interface IngredienteInput {
  ingrediente_id: number
  cantidad: number
}

export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  imagen_url?: string
  categoria_id: number
  ingredientes: IngredienteInput[]
}

export interface ProductoUpdate {
  nombre?: string
  descripcion?: string
  precio?: number
  stock?: number
  imagen_url?: string
  categoria_id?: number
  ingredientes?: IngredienteInput[]
}

/** Lo que lleva el form de producto en la página (TanStack Form). */
export interface ProductoFormValues {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen_url: string
  categoria_id: number
  ingredientes: IngredienteInput[]
}
