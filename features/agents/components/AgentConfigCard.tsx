'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bot } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useToast } from '@/shared/components/ui/Toast'
import { useTenant } from '@/features/tenant/hooks/useTenant'
import { useUpdateTenantMutation } from '@/features/tenant/api/tenantApi'

const agentSchema = z.object({
  bot_name:      z.string().min(1, 'El nombre del agente es requerido'),
  system_prompt: z.string().min(10, 'Las instrucciones deben tener al menos 10 caracteres'),
})

type AgentFormData = z.infer<typeof agentSchema>

const PROMPT_TIPS = [
  'Describe la personalidad: "Eres amigable y entusiasta"',
  'Especifica el tono: "Responde de forma casual y cercana"',
  'Agrega contexto de negocio: "Somos una tienda de ropa casual juvenil"',
  'Define restricciones: "No hables de precios de otros negocios"',
]

export function AgentConfigCard() {
  const { data: tenant, isLoading } = useTenant()
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation()
  const toast = useToast()

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<AgentFormData>({ resolver: zodResolver(agentSchema) })

  useEffect(() => {
    if (tenant) {
      reset({
        bot_name:      tenant.bot_name,
        system_prompt: tenant.system_prompt,
      })
    }
  }, [tenant, reset])

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  if (!tenant) {
    return (
      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
        No hay tienda configurada.
      </p>
    )
  }

  async function onSubmit(data: AgentFormData) {
    try {
      await updateTenant({ id: tenant!.id, ...data }).unwrap()
      toast('Configuración del agente guardada', 'success')
    } catch {
      toast('No se pudo guardar la configuración', 'error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-base font-bold" style={{ color: 'var(--color-ink)' }}>
            Personalidad del agente
          </h2>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Define cómo se comporta tu bot con los clientes en Instagram
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nombre del agente"
            {...register('bot_name')}
            error={errors.bot_name?.message}
            placeholder="Ej: Sofía, Asistente, Max..."
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
              Instrucciones del agente
            </label>
            <textarea
              {...register('system_prompt')}
              rows={7}
              placeholder="Describe la personalidad, tono y contexto de tu tienda..."
              className="rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none resize-none"
              style={{
                borderColor: errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)'
                e.currentTarget.style.boxShadow = ''
              }}
            />
            {errors.system_prompt && (
              <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                {errors.system_prompt.message}
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Consejos para un buen prompt</p>
            <ul className="space-y-1">
              {PROMPT_TIPS.map((tip) => (
                <li key={tip} className="text-xs" style={{ color: 'var(--color-muted)' }}>• {tip}</li>
              ))}
            </ul>
          </div>

          <Button type="submit" variant="primary" loading={isUpdating} className="py-2.5 rounded-xl">
            Guardar configuración
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
