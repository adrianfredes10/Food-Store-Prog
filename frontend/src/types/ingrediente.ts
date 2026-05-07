export type UnidadMedida = 'g' | 'kg' | 'ml' | 'l' | 'u'

export interface Ingrediente {
  id: number
  nombre: string
  unidad: UnidadMedida
}

export interface IngredienteCreate {
  nombre: string
  unidad: UnidadMedida
}

export interface IngredienteUpdate {
  nombre?: string
  unidad?: UnidadMedida
}
