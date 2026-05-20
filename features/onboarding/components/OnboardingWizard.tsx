'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ChevronRight, ChevronLeft, Store, AtSign, Bot, CheckCircle,
  Info, Sparkles, Plus, ArrowRight, ExternalLink,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useSetupTenantMutation } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/authStore'

const step1Schema = z.object({ nombreTienda: z.string().min(1, 'Nombre requerido') })
const step2Schema = z.object({
  ig_page_id:   z.string().min(1, 'Page ID requerido'),
  access_token: z.string().min(1, 'Access Token requerido'),
})
const step3Schema = z.object({
  bot_name:      z.string().min(1, 'Nombre del agente requerido'),
  system_prompt: z.string().min(10, 'Las instrucciones deben tener al menos 10 caracteres'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

const STEPS = [
  { label: 'Tu tienda',  icon: Store  },
  { label: 'Meta / IG',  icon: AtSign },
  { label: 'Tu agente',  icon: Bot    },
]

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 text-sm flex gap-3"
      style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-ink)' }}>
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
      <div>{children}</div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
        {subtitle}
      </p>
    </div>
  )
}

const PROMPT_TEMPLATE = (nombre: string, tienda: string) =>
  `Eres ${nombre}, asistente virtual de ${tienda}.
Tu rol es ayudar a los clientes a conocer productos, consultar disponibilidad y precios, y acompañarlos en su compra.
Sé amable, claro y usa un tono profesional pero cercano.
Cuando un cliente quiera comprar, crea la orden y entrégale el código de pedido para que pueda coordinar el pago.`

interface WizardState {
  nombreTienda: string
  ig_page_id: string
  access_token: string
}

export function OnboardingWizard() {
  const router = useRouter()
  const { setAuth, tenants } = useAuthStore()
  const [setupTenant, { isLoading }] = useSetupTenantMutation()
  const [step, setStep] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState<WizardState>({ nombreTienda: '', ig_page_id: '', access_token: '' })

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { bot_name: 'Asistente', system_prompt: '' },
  })

  function resetWizard() {
    form1.reset()
    form2.reset()
    form3.reset({ bot_name: 'Asistente', system_prompt: '' })
    setSaved({ nombreTienda: '', ig_page_id: '', access_token: '' })
    setFormError(null)
    setStep(0)
  }

  function applyPromptTemplate() {
    const nombre = form3.getValues('bot_name') || 'Asistente'
    const tienda = saved.nombreTienda || 'tu tienda'
    form3.setValue('system_prompt', PROMPT_TEMPLATE(nombre, tienda), { shouldValidate: true })
  }

  async function onStep3(data: Step3Data) {
    setFormError(null)
    try {
      const result = await setupTenant({
        nombreTienda:  saved.nombreTienda,
        ig_page_id:    saved.ig_page_id,
        access_token:  saved.access_token,
        system_prompt: data.system_prompt,
        bot_name:      data.bot_name,
      }).unwrap()
      setAuth(result)
      setStep(3)
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err as { data: { error: string } }).data?.error
          : 'Error al configurar la tienda'
      setFormError(message)
    }
  }

  const storeCount = tenants.length

  return (
    <div className="w-full max-w-lg">
      {/* Step indicator */}
      {step < 3 && (
        <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === i
            const isDone = step > i
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: isDone ? '#22c55e' : isActive ? 'var(--color-primary)' : 'var(--color-cream-dark)',
                      color: isDone || isActive ? '#fff' : 'var(--color-muted)',
                    }}
                  >
                    {isDone ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-border)' }} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Card */}
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm" style={{ border: '1px solid var(--color-border)' }}>

        {/* ── Step 0: nombre de tienda ── */}
        {step === 0 && (
          <form onSubmit={form1.handleSubmit((d) => { setSaved(s => ({ ...s, nombreTienda: d.nombreTienda })); setStep(1) })}
            className="space-y-6">
            <StepHeader
              title="¿Cómo se llama tu tienda?"
              subtitle="Puedes tener varias tiendas en Luania. Cada una tiene su propio catálogo, agente y canal de Instagram."
            />
            <InfoBox>
              <p className="font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>¿Qué es una tienda en Luania?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Una tienda agrupa tu catálogo de productos, tu agente de IA y tu canal de Instagram. Si vendes varias marcas o
                tienes varios canales de Instagram, puedes crear una tienda por cada uno.
              </p>
            </InfoBox>
            <Input
              label="Nombre de la tienda"
              placeholder="Ej: Atelier Lima, Bodega Rosita, Modas Valeria..."
              {...form1.register('nombreTienda')}
              error={form1.formState.errors.nombreTienda?.message}
            />
            <Button type="submit" variant="primary" className="w-full py-3 rounded-xl text-base">
              Continuar <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* ── Step 1: Meta / Instagram ── */}
        {step === 1 && (
          <form onSubmit={form2.handleSubmit((d) => { setSaved(s => ({ ...s, ...d })); setStep(2) })}
            className="space-y-6">
            <StepHeader
              title="Conecta tu Instagram"
              subtitle="Tu agente IA recibirá y responderá mensajes directamente desde tu cuenta de Instagram Business."
            />

            <InfoBox>
              <p className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>¿Por qué necesito esto?</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
                Luania usa la API oficial de Meta para leer y enviar mensajes en tu nombre. Para eso necesitas dos cosas:
                el <strong>Page ID</strong> de tu página de Facebook y un <strong>Access Token</strong> permanente.
              </p>
              <p className="font-semibold mb-1 text-xs" style={{ color: 'var(--color-ink)' }}>Requisitos previos:</p>
              <ul className="list-disc list-inside text-xs space-y-0.5" style={{ color: 'var(--color-muted)' }}>
                <li>Cuenta de <strong>Instagram Business</strong> (no personal)</li>
                <li>Vinculada a una <strong>Página de Facebook</strong></li>
                <li>App creada en <strong>Meta for Developers</strong></li>
              </ul>
            </InfoBox>

            <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>Paso a paso:</p>
              <ol className="list-decimal list-inside text-xs space-y-1.5" style={{ color: 'var(--color-muted)' }}>
                <li>Entra a <strong>Facebook Business Suite</strong> → Configuración de la cuenta</li>
                <li>Ve a <strong>Páginas</strong> → copia el <strong>Page ID</strong> de tu página</li>
                <li>En <strong>Meta for Developers</strong>, abre tu app → <strong>Graph API Explorer</strong></li>
                <li>Genera un token con permisos <code className="bg-gray-100 px-1 rounded">instagram_basic</code>, <code className="bg-gray-100 px-1 rounded">pages_messaging</code></li>
                <li>Conviértelo a <strong>token de larga duración</strong> (60 días) o usa un token de sistema</li>
              </ol>
              <a
                href="https://developers.facebook.com/docs/messenger-platform/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold mt-1"
                style={{ color: 'var(--color-primary)' }}
              >
                Guía oficial de Meta <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <Input label="Facebook Page ID" placeholder="Ej: 123456789012345"
              {...form2.register('ig_page_id')} error={form2.formState.errors.ig_page_id?.message} />
            <Input label="Access Token de Meta" placeholder="EAAxxxxxxxxxxxxxxx..."
              {...form2.register('access_token')} error={form2.formState.errors.access_token?.message} />

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="submit" variant="primary" className="flex-1 py-3 rounded-xl">
                Continuar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 2: Agente IA ── */}
        {step === 2 && (
          <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-6">
            <StepHeader
              title="Configura tu agente IA"
              subtitle="El agente es quien responde a tus clientes en Instagram, 24/7, de forma automática."
            />

            <InfoBox>
              <p className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>¿Cómo funciona el agente?</p>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-muted)' }}>
                Cuando un cliente te escribe por Instagram, el agente lee el mensaje, consulta tu catálogo de productos
                y responde automáticamente. Si el cliente quiere comprar, el agente crea la orden y le da un código de pedido.
              </p>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>Las instrucciones del agente definen:</p>
              <ul className="list-disc list-inside text-xs space-y-0.5" style={{ color: 'var(--color-muted)' }}>
                <li>Su nombre y personalidad</li>
                <li>El tono de comunicación (formal, cercano, divertido...)</li>
                <li>Reglas especiales para tu negocio</li>
                <li>Qué hacer si no sabe la respuesta</li>
              </ul>
            </InfoBox>

            <Input
              label="Nombre del agente"
              placeholder="Ej: María, Carlos, Luania Bot..."
              {...form3.register('bot_name')}
              error={form3.formState.errors.bot_name?.message}
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                  Instrucciones del agente
                </label>
                <button
                  type="button"
                  onClick={applyPromptTemplate}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                >
                  <Sparkles className="h-3 w-3" /> Usar plantilla
                </button>
              </div>
              <textarea
                {...form3.register('system_prompt')}
                rows={6}
                placeholder={`Eres [nombre], asistente virtual de [tienda].
Ayudas a los clientes a encontrar productos, consultar precios y hacer pedidos.
Sé amable y usa un tono profesional pero cercano.
Cuando quieran comprar, crea la orden y entrega el código de pedido.`}
                className="rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none resize-none"
                style={{
                  borderColor: form3.formState.errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = form3.formState.errors.system_prompt
                    ? 'var(--color-primary)' : 'var(--color-border)'
                  e.currentTarget.style.boxShadow = ''
                }}
              />
              {form3.formState.errors.system_prompt && (
                <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                  {form3.formState.errors.system_prompt.message}
                </p>
              )}
              <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Puedes cambiar estas instrucciones en cualquier momento desde la configuración de tu tienda.
              </p>
            </div>

            {formError && (
              <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {formError}
              </p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="submit" variant="primary" loading={isLoading} className="flex-1 py-3 rounded-xl">
                Crear tienda <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 3: Éxito ── */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: '#DCFCE7' }}>
              <CheckCircle className="h-8 w-8" style={{ color: '#15803D' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>
                ¡{saved.nombreTienda || 'Tu tienda'} está lista!
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
                Tu agente ya puede recibir mensajes en Instagram y crear pedidos automáticamente.
              </p>
            </div>

            {storeCount > 0 && (
              <div className="w-full rounded-xl px-4 py-3 text-left"
                style={{ backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-muted)' }}>
                  Tiendas configuradas
                </p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>
                  {storeCount} {storeCount === 1 ? 'tienda' : 'tiendas'} activas
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <Button
                type="button"
                variant="primary"
                className="w-full py-3 rounded-xl text-base"
                onClick={() => router.push('/catalog')}
              >
                Ir a mi panel <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full py-3 rounded-xl text-base"
                onClick={resetWizard}
              >
                <Plus className="h-4 w-4" /> Agregar otra tienda
              </Button>
            </div>

            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              También puedes agregar más tiendas desde la configuración de tu cuenta.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
