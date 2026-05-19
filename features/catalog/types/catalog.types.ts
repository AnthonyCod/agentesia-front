export interface Product {
  id: string
  tenant_id: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  atributos: Record<string, unknown> | null
  updated_at: string
}

export interface CreateProductDto {
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  atributos?: Record<string, unknown>
}

export interface UpdateProductDto {
  nombre?: string
  descripcion?: string
  precio?: number
  stock?: number
  atributos?: Record<string, unknown>
}

export interface CatalogFilters {
  search: string
}
