'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useCatalogStore } from '../store/catalogStore'
import { useCreateProductMutation, useUpdateProductMutation } from '../api/catalogApi'

const productSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional(),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
})

type ProductFormData = z.infer<typeof productSchema>

export function ProductForm() {
  const { isFormOpen, selectedProduct, closeForm } = useCatalogStore()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { stock: 0, precio: 0 },
  })

  useEffect(() => {
    if (selectedProduct) {
      reset({
        nombre: selectedProduct.nombre,
        descripcion: selectedProduct.descripcion ?? '',
        precio: selectedProduct.precio,
        stock: selectedProduct.stock,
      })
    } else {
      reset({ nombre: '', descripcion: '', precio: 0, stock: 0 })
    }
  }, [selectedProduct, reset])

  if (!isFormOpen) return null

  async function onSubmit(data: ProductFormData) {
    try {
      if (selectedProduct) {
        await updateProduct({ id: selectedProduct.id, ...data }).unwrap()
      } else {
        await createProduct(data).unwrap()
      }
      closeForm()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError('root', { message })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <Input label="Descripción" {...register('descripcion')} error={errors.descripcion?.message} />
          <Input
            label="Precio (S/)"
            type="number"
            step="0.01"
            {...register('precio', { valueAsNumber: true })}
            error={errors.precio?.message}
          />
          <Input
            label="Stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            error={errors.stock?.message}
          />
          {errors.root && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isCreating || isUpdating}
              className="flex-1"
            >
              {selectedProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
