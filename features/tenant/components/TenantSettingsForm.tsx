'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useToast } from '@/shared/components/ui/Toast'
import { useTenant } from '../hooks/useTenant'
import { useUpdateTenantMutation } from '../api/tenantApi'

const tenantSchema = z.object({
  nombre:        z.string().min(1, 'Nombre requerido'),
  bot_name:      z.string().min(1, 'Nombre del bot requerido'),
  system_prompt: z.string().min(10, 'El prompt debe tener al menos 10 caracteres'),
  // Instagram / Facebook (shared page token)
  ig_page_id:   z.string().optional(),
  access_token: z.string().optional(),
  fb_page_id:   z.string().optional(),
  // WhatsApp
  wa_phone_number_id:    z.string().optional(),
  wa_business_account_id: z.string().optional(),
  wa_access_token:       z.string().optional(),
})

type TenantFormData = z.infer<typeof tenantSchema>

function SectionTitle({ label, color, icon }: { label: string; color: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: color }}>
        {icon}
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{label}</p>
    </div>
  )
}

export function TenantSettingsForm() {
  const { data: tenant, isLoading } = useTenant()
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation()
  const toast = useToast()

  const { register, handleSubmit, reset, setError, formState: { errors } } =
    useForm<TenantFormData>({ resolver: zodResolver(tenantSchema) })

  useEffect(() => {
    if (tenant) {
      reset({
        nombre:        tenant.nombre,
        bot_name:      tenant.bot_name,
        system_prompt: tenant.system_prompt,
        ig_page_id:    tenant.ig_page_id ?? '',
        access_token:  tenant.access_token ?? '',
        fb_page_id:    tenant.fb_page_id ?? '',
        wa_phone_number_id:    tenant.wa_phone_number_id ?? '',
        wa_business_account_id: tenant.wa_business_account_id ?? '',
        wa_access_token: '',  // never pre-fill tokens
      })
    }
  }, [tenant, reset])

  if (isLoading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>
  }

  if (!tenant) {
    return (
      <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
        No se pudo cargar la configuración de la tienda.
      </p>
    )
  }

  async function onSubmit(data: TenantFormData) {
    try {
      await updateTenant({ id: tenant!.id, ...data }).unwrap()
      toast('Cambios guardados correctamente', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setError('root', { message })
      toast('No se pudieron guardar los cambios', 'error')
    }
  }

  const hasInstagram = !!tenant.ig_page_id
  const hasFacebook  = !!tenant.fb_page_id
  const hasWhatsApp  = !!tenant.wa_phone_number_id

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
          Configuración de la tienda
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {[
            hasInstagram && 'Instagram',
            hasFacebook  && 'Facebook',
            hasWhatsApp  && 'WhatsApp',
          ].filter(Boolean).join(' · ') || 'Sin canales conectados'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── General ── */}
          <Input label="Nombre de la tienda" {...register('nombre')} error={errors.nombre?.message} />
          <Input label="Nombre del bot"      {...register('bot_name')} error={errors.bot_name?.message} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
              Instrucciones del agente
            </label>
            <textarea
              {...register('system_prompt')}
              rows={6}
              className="rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none resize-none"
              style={{
                borderColor: errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
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

          {/* ── Divider ── */}
          <div className="border-t pt-2" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Canales conectados</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              Actualiza o añade canales. Deja en blanco los campos que no quieras modificar.
            </p>
          </div>

          {/* ── Instagram ── */}
          <div className="space-y-3 rounded-xl p-4" style={{ border: '1px solid #E1306C30', backgroundColor: '#E1306C08' }}>
            <SectionTitle label="Instagram" color="#E1306C" icon="@" />
            <Input
              label="Facebook Page ID"
              placeholder={hasInstagram ? tenant.ig_page_id! : 'Ej: 123456789012345'}
              {...register('ig_page_id')}
              error={errors.ig_page_id?.message}
            />
            <Input
              label="Access Token de Meta"
              placeholder="Dejar vacío para no cambiar el token"
              {...register('access_token')}
              error={errors.access_token?.message}
            />
          </div>

          {/* ── Facebook ── */}
          <div className="space-y-3 rounded-xl p-4" style={{ border: '1px solid #1877F230', backgroundColor: '#1877F208' }}>
            <SectionTitle label="Facebook Messenger" color="#1877F2" icon="f" />
            <Input
              label="Facebook Page ID"
              placeholder={hasFacebook ? tenant.fb_page_id! : 'Ej: 123456789012345 (opcional)'}
              {...register('fb_page_id')}
              error={errors.fb_page_id?.message}
            />
          </div>

          {/* ── WhatsApp ── */}
          <div className="space-y-3 rounded-xl p-4" style={{ border: '1px solid #25D36630', backgroundColor: '#25D36608' }}>
            <SectionTitle label="WhatsApp Business" color="#25D366" icon="💬" />
            <Input
              label="Phone Number ID"
              placeholder={hasWhatsApp ? tenant.wa_phone_number_id! : 'Ej: 123456789012345 (opcional)'}
              {...register('wa_phone_number_id')}
              error={errors.wa_phone_number_id?.message}
            />
            <Input
              label="Business Account ID"
              placeholder={hasWhatsApp && tenant.wa_business_account_id ? tenant.wa_business_account_id : 'Ej: 987654321098765'}
              {...register('wa_business_account_id')}
              error={errors.wa_business_account_id?.message}
            />
            <Input
              label="Access Token de WhatsApp"
              placeholder="Dejar vacío para no cambiar el token"
              {...register('wa_access_token')}
              error={errors.wa_access_token?.message}
            />
          </div>

          {errors.root && (
            <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              {errors.root.message}
            </p>
          )}

          <Button type="submit" variant="primary" loading={isUpdating} className="py-2.5 rounded-xl">
            Guardar cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
