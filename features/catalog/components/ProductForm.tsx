'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useToast } from '@/shared/components/ui/Toast'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { closeForm } from '../store/catalogSlice'
import { useCreateProductMutation, useUpdateProductMutation } from '../api/catalogApi'

const productSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional(),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
})

type ProductFormData = z.infer<typeof productSchema>

export function ProductForm() {
  const dispatch = useAppDispatch()
  const isFormOpen = useAppSelector((s) => s.catalog.isFormOpen)
  const selectedProduct = useAppSelector((s) => s.catalog.selectedProduct)
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const toast = useToast()

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

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') dispatch(closeForm())
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [dispatch])

  if (!isFormOpen) return null

  async function onSubmit(data: ProductFormData) {
    try {
      if (selectedProduct) {
        await updateProduct({ id: selectedProduct.id, ...data }).unwrap()
        toast('Producto actualizado correctamente', 'success')
      } else {
        await createProduct(data).unwrap()
        toast('Producto creado correctamente', 'success')
      }
      dispatch(closeForm())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError('root', { message })
      toast('No se pudo guardar el producto', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-scale-in" style={{ border: '1px solid var(--color-border)' }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
            {selectedProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={() => dispatch(closeForm())} aria-label="Cerrar" className="icon-btn-hover rounded-lg p-1.5"
            style={{ color: 'var(--color-muted)' }}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <Input label="Descripción" {...register('descripcion')} error={errors.descripcion?.message} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Precio (S/)" type="number" step="0.01"
              {...register('precio', { valueAsNumber: true })} error={errors.precio?.message} />
            <Input label="Stock" type="number"
              {...register('stock', { valueAsNumber: true })} error={errors.stock?.message} />
          </div>
          {errors.root && (
            <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              {errors.root.message}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" onClick={() => dispatch(closeForm())} className="flex-1 py-2.5 rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isCreating || isUpdating} className="flex-1 py-2.5 rounded-xl">
              {selectedProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
