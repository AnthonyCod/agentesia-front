'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, ChevronLeft, Store, AtSign, Bot, CheckCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useSetupTenantMutation } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/authStore'

const step1Schema = z.object({
  nombreTienda: z.string().min(1, 'Nombre requerido'),
})

const step2Schema = z.object({
  ig_page_id: z.string().min(1, 'Page ID requerido'),
  access_token: z.string().min(1, 'Access Token requerido'),
})

const step3Schema = z.object({
  bot_name: z.string().min(1, 'Nombre del bot requerido'),
  system_prompt: z.string().min(10, 'El prompt debe tener al menos 10 caracteres'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

const STEPS = [
  { label: 'Tu tienda', icon: Store },
  { label: 'Meta / IG', icon: AtSign },
  { label: 'Tu bot', icon: Bot },
]

const PROMPT_EXAMPLE = `Eres [nombre del bot], asistente virtual de [nombre de la tienda].
Ayudas a los clientes a encontrar productos, responder preguntas sobre disponibilidad y precios, y procesar pedidos.
Siempre sé amable, conciso y usa un tono profesional pero cercano.
Cuando un cliente quiera comprar, crea la orden y proporciona el código de pedido.`

export function OnboardingWizard() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [setupTenant, { isLoading }] = useSetupTenantMutation()
  const [step, setStep] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)

  const [step1Data, setStep1Data] = useState<Step1Data>({ nombreTienda: '' })
  const [step2Data, setStep2Data] = useState<Step2Data>({ ig_page_id: '', access_token: '' })

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { bot_name: 'Asistente', system_prompt: '' },
  })

  async function onStep1(data: Step1Data) {
    setStep1Data(data)
    setStep(1)
  }

  async function onStep2(data: Step2Data) {
    setStep2Data(data)
    setStep(2)
  }

  async function onStep3(data: Step3Data) {
    setFormError(null)
    try {
      const result = await setupTenant({
        nombreTienda: step1Data.nombreTienda,
        ig_page_id: step2Data.ig_page_id,
        access_token: step2Data.access_token,
        system_prompt: data.system_prompt,
        bot_name: data.bot_name,
      }).unwrap()
      setAuth(result)
      setStep(3)
      setTimeout(() => router.push('/catalog'), 1500)
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err as { data: { error: string } }).data?.error
          : 'Error al configurar la tienda'
      setFormError(message)
    }
  }

  return (
    <div className="w-full max-w-lg">
      {/* Steps indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = step === i
          const isDone = step > i
          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
                ].join(' ')}
              >
                {isDone ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={['text-sm font-medium', isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'].join(' ')}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />}
            </div>
          )
        })}
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-900">
        {/* Step 0: Nombre de tienda */}
        {step === 0 && (
          <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¿Cómo se llama tu tienda?</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Este nombre aparecerá en tu panel.</p>
            </div>
            <Input
              label="Nombre de la tienda"
              placeholder="Ej: Tienda Moda Lima"
              {...form1.register('nombreTienda')}
              error={form1.formState.errors.nombreTienda?.message}
            />
            <Button type="submit" variant="primary" className="w-full">
              Continuar <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Step 1: Instagram */}
        {step === 1 && (
          <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Conecta tu Instagram</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Necesitas una cuenta de Instagram Business conectada a una Página de Facebook.
              </p>
            </div>
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <p className="font-medium">¿Cómo obtener estos datos?</p>
              <ol className="mt-2 list-inside list-decimal space-y-1">
                <li>Ve a Facebook Business Suite → Configuración</li>
                <li>Copia el <strong>Page ID</strong> de tu página</li>
                <li>Genera un <strong>Access Token</strong> permanente en Meta Developers</li>
              </ol>
            </div>
            <Input
              label="Instagram / Facebook Page ID"
              placeholder="Ej: 123456789012345"
              {...form2.register('ig_page_id')}
              error={form2.formState.errors.ig_page_id?.message}
            />
            <Input
              label="Access Token de Meta"
              placeholder="EAAxxxxxxxxxxxxxxx..."
              {...form2.register('access_token')}
              error={form2.formState.errors.access_token?.message}
            />
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(0)} className="flex-1">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Continuar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Bot */}
        {step === 2 && (
          <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Configura tu bot</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Define la personalidad del asistente que responderá a tus clientes.
              </p>
            </div>
            <Input
              label="Nombre del bot"
              placeholder="Ej: María, Carlos, Asistente..."
              {...form3.register('bot_name')}
              error={form3.formState.errors.bot_name?.message}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Instrucciones del bot (system prompt)
              </label>
              <textarea
                {...form3.register('system_prompt')}
                rows={6}
                placeholder={PROMPT_EXAMPLE}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              {form3.formState.errors.system_prompt && (
                <p className="text-xs text-red-600 dark:text-red-400">{form3.formState.errors.system_prompt.message}</p>
              )}
            </div>
            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            )}
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="submit" variant="primary" loading={isLoading} className="flex-1">
                Crear tienda
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¡Tu tienda está lista!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirigiendo al panel...</p>
          </div>
        )}
      </div>
    </div>
  )
}
