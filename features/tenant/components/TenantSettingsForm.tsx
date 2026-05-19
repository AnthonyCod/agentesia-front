'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useTenant } from '../hooks/useTenant'
import { useUpdateTenantMutation } from '../api/tenantApi'

const tenantSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  bot_name: z.string().min(1, 'Nombre del bot requerido'),
  system_prompt: z.string().min(10, 'El prompt debe tener al menos 10 caracteres'),
  access_token: z.string().min(1, 'Access token requerido'),
  fb_page_id: z.string().optional(),
})

type TenantFormData = z.infer<typeof tenantSchema>

export function TenantSettingsForm() {
  const { data: tenant, isLoading } = useTenant()
  const [updateTenant, { isLoading: isUpdating, isSuccess }] = useUpdateTenantMutation()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TenantFormData>({ resolver: zodResolver(tenantSchema) })

  useEffect(() => {
    if (tenant) {
      reset({
        nombre: tenant.nombre,
        bot_name: tenant.bot_name,
        system_prompt: tenant.system_prompt,
        access_token: tenant.access_token,
        fb_page_id: tenant.fb_page_id ?? '',
      })
    }
  }, [tenant, reset])

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  if (!tenant) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No se pudo cargar la configuración de la tienda.
      </p>
    )
  }

  async function onSubmit(data: TenantFormData) {
    try {
      await updateTenant({ id: tenant!.id, ...data }).unwrap()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError('root', { message })
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Configuración de la tienda</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.ig_page_id}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre de la tienda"
            {...register('nombre')}
            error={errors.nombre?.message}
          />
          <Input
            label="Nombre del bot"
            {...register('bot_name')}
            error={errors.bot_name?.message}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prompt del sistema
            </label>
            <textarea
              {...register('system_prompt')}
              rows={6}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            {errors.system_prompt && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.system_prompt.message}</p>
            )}
          </div>
          <Input
            label="Access Token de Meta"
            {...register('access_token')}
            error={errors.access_token?.message}
          />
          <Input
            label="Facebook Page ID (opcional)"
            {...register('fb_page_id')}
            error={errors.fb_page_id?.message}
          />
          {errors.root && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">Cambios guardados correctamente</p>
          )}
          <Button type="submit" variant="primary" loading={isUpdating}>
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
