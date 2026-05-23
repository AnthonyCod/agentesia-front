'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ChevronRight, ChevronLeft, ChevronDown, Store, Bot, CheckCircle,
  Info, Sparkles, Plus, ArrowRight, Radio,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useSetupTenantMutation } from '@/features/auth/api/authApi'
import { setAuth } from '@/features/auth/store/authSlice'
import { useAppSelector, useAppDispatch } from '@/shared/store/hooks'
import { FacebookConnectButton, type FacebookPage } from '@/features/auth/components/FacebookConnectButton'
import { ChannelSelector, type ChannelId } from './ChannelSelector'

const step1Schema = z.object({ nombreTienda: z.string().min(1, 'Nombre requerido') })

const step3Schema = z.object({
  bot_name:      z.string().min(1, 'Nombre del agente requerido'),
  system_prompt: z.string().min(10, 'Las instrucciones deben tener al menos 10 caracteres'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step3Data = z.infer<typeof step3Schema>

const STEPS = [
  { label: 'Tu tienda',  icon: Store  },
  { label: 'Canales',    icon: Radio  },
  { label: 'Tu agente',  icon: Bot    },
]

interface ChannelConfig {
  instagram?: { ig_page_id: string; access_token: string }
  facebook?:  { fb_page_id: string; access_token: string }
  whatsapp?:  { wa_phone_number_id: string; wa_business_account_id: string; wa_access_token: string }
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 text-sm flex gap-3"
      style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-ink)' }}>
      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
      <div>{children}</div>
    </div>
  )
}

function HelpAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors"
        style={{ backgroundColor: open ? 'var(--color-primary-light)' : 'var(--color-cream)', color: 'var(--color-ink)' }}
      >
        <span className="text-xs font-semibold flex items-center gap-2">
          <Info className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
          {title}
        </span>
        <ChevronDown
          className="h-4 w-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: 'var(--color-muted)', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="px-3.5 py-3 text-xs space-y-2" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-muted)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function StepNum({ n }: { n: number }) {
  return (
    <span
      className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-white text-xs font-bold"
      style={{ backgroundColor: 'var(--color-primary)', fontSize: '10px' }}
    >{n}</span>
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

export function OnboardingWizard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const tenants = useAppSelector((s) => s.auth.tenants)
  const [setupTenant, { isLoading }] = useSetupTenantMutation()

  const [step, setStep] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [nombreTienda, setNombreTienda] = useState('')

  // Step 1: channel selection
  const [selectedChannels, setSelectedChannels] = useState<ChannelId[]>([])
  const [channelError, setChannelError] = useState<string | null>(null)

  // Step 2: channel configs (partial; validated per selected channel)
  const [channelConfig, setChannelConfig] = useState<ChannelConfig>({})

  // IG / FB manual fields
  const [igPageId, setIgPageId]       = useState('')
  const [igToken, setIgToken]         = useState('')
  const [fbPageId, setFbPageId]       = useState('')
  const [fbToken, setFbToken]         = useState('')
  const [igError, setIgError]         = useState('')
  const [fbError, setFbError]         = useState('')

  // WA fields
  const [waPhoneId, setWaPhoneId]     = useState('')
  const [waAccountId, setWaAccountId] = useState('')
  const [waToken, setWaToken]         = useState('')
  const [waError, setWaError]         = useState('')

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form3 = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { bot_name: 'Asistente', system_prompt: '' },
  })

  function resetWizard() {
    form1.reset()
    form3.reset({ bot_name: 'Asistente', system_prompt: '' })
    setNombreTienda('')
    setSelectedChannels([])
    setChannelConfig({})
    setIgPageId(''); setIgToken(''); setFbPageId(''); setFbToken('')
    setWaPhoneId(''); setWaAccountId(''); setWaToken('')
    setFormError(null); setChannelError(null)
    setStep(0)
  }

  function applyPromptTemplate() {
    const nombre = form3.getValues('bot_name') || 'Asistente'
    form3.setValue('system_prompt', PROMPT_TEMPLATE(nombre, nombreTienda || 'tu tienda'), { shouldValidate: true })
  }

  // ── Step 1 → 2: validate channel selection ────────────────────────────
  function goToChannelConfig() {
    if (selectedChannels.length === 0) {
      setChannelError('Selecciona al menos un canal')
      return
    }
    setChannelError(null)
    setStep(2)
  }

  // ── Step 2 → 3: validate each selected channel has required fields ────
  function goToAgent() {
    let valid = true
    setIgError(''); setFbError(''); setWaError('')

    if (selectedChannels.includes('instagram')) {
      if (!igPageId.trim() || !igToken.trim()) {
        setIgError('El Page ID y el Access Token de Instagram son requeridos')
        valid = false
      }
    }
    if (selectedChannels.includes('facebook')) {
      if (!fbPageId.trim() || !fbToken.trim()) {
        setFbError('El Page ID y el Access Token de Facebook son requeridos')
        valid = false
      }
    }
    if (selectedChannels.includes('whatsapp')) {
      if (!waPhoneId.trim() || !waAccountId.trim() || !waToken.trim()) {
        setWaError('Todos los campos de WhatsApp son requeridos')
        valid = false
      }
    }

    if (!valid) return

    const config: ChannelConfig = {}
    if (selectedChannels.includes('instagram')) config.instagram = { ig_page_id: igPageId, access_token: igToken }
    if (selectedChannels.includes('facebook'))  config.facebook  = { fb_page_id: fbPageId, access_token: fbToken }
    if (selectedChannels.includes('whatsapp'))  config.whatsapp  = { wa_phone_number_id: waPhoneId, wa_business_account_id: waAccountId, wa_access_token: waToken }
    setChannelConfig(config)
    setStep(3)
  }

  // ── Step 3 submit ─────────────────────────────────────────────────────
  async function onStep3(data: Step3Data) {
    setFormError(null)
    try {
      const result = await setupTenant({
        nombreTienda,
        system_prompt: data.system_prompt,
        bot_name: data.bot_name,
        ig_page_id:  channelConfig.instagram?.ig_page_id,
        access_token: channelConfig.instagram?.access_token ?? channelConfig.facebook?.access_token,
        fb_page_id:  channelConfig.facebook?.fb_page_id,
        wa_phone_number_id:    channelConfig.whatsapp?.wa_phone_number_id,
        wa_business_account_id: channelConfig.whatsapp?.wa_business_account_id,
        wa_access_token:       channelConfig.whatsapp?.wa_access_token,
      }).unwrap()
      dispatch(setAuth(result))
      setStep(4)
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
      {step < 4 && (
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
          <form onSubmit={form1.handleSubmit((d) => { setNombreTienda(d.nombreTienda); setStep(1) })}
            className="space-y-6">
            <StepHeader
              title="¿Cómo se llama tu tienda?"
              subtitle="Puedes tener varias tiendas en Luania. Cada una tiene su propio catálogo, agente y canal(es) de comunicación."
            />
            <InfoBox>
              <p className="font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>¿Qué es una tienda en Luania?</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                Una tienda agrupa tu catálogo de productos, tu agente de IA y tus canales de mensajería (Instagram, Facebook y/o WhatsApp).
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

        {/* ── Step 1: selección de canales ── */}
        {step === 1 && (
          <div className="space-y-6">
            <StepHeader
              title="Conecta tus canales"
              subtitle="Elige por dónde quieres recibir mensajes de tus clientes. Puedes seleccionar más de uno."
            />
            <ChannelSelector
              selected={selectedChannels}
              onChange={setSelectedChannels}
              error={channelError ?? undefined}
            />
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="button" variant="primary" onClick={goToChannelConfig} className="flex-1 py-3 rounded-xl">
                Continuar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: configuración de canales ── */}
        {step === 2 && (
          <div className="space-y-6">
            <StepHeader
              title="Configura tus canales"
              subtitle="Ingresa las credenciales de cada canal seleccionado."
            />

            {/* Instagram */}
            {selectedChannels.includes('instagram') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#E1306C' }}>@</div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>Instagram</p>
                </div>

                <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
                    Opción rápida — conecta en 1 clic
                  </p>
                  <FacebookConnectButton
                    onConnect={(page: FacebookPage) => {
                      setIgPageId(page.id)
                      setIgToken(page.access_token)
                    }}
                  />
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>o ingresa manualmente</span>
                  <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
                </div>

                <Input
                  label="Facebook Page ID"
                  placeholder="Ej: 123456789012345"
                  value={igPageId}
                  onChange={e => setIgPageId(e.target.value)}
                />
                <Input
                  label="Access Token de Meta"
                  placeholder="EAAxxxxxxxxxxxxxxx..."
                  value={igToken}
                  onChange={e => setIgToken(e.target.value)}
                />
                {igError && <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{igError}</p>}
              </div>
            )}

            {/* Facebook */}
            {selectedChannels.includes('facebook') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#1877F2' }}>f</div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>Facebook Messenger</p>
                </div>
                <Input
                  label="Facebook Page ID"
                  placeholder="Ej: 123456789012345"
                  value={fbPageId}
                  onChange={e => setFbPageId(e.target.value)}
                />
                <Input
                  label="Access Token de Meta"
                  placeholder="EAAxxxxxxxxxxxxxxx..."
                  value={fbToken}
                  onChange={e => setFbToken(e.target.value)}
                />
                <HelpAccordion title="¿Cómo obtengo el Page ID y el token?">
                  <div className="flex gap-2 items-start">
                    <StepNum n={1} />
                    <span>Ve a tu <strong>Página de Facebook</strong> → Acerca de → copia el <strong>ID de la página</strong></span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <StepNum n={2} />
                    <span>En <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>Graph API Explorer</a> genera un token con permiso <code>pages_messaging</code></span>
                  </div>
                </HelpAccordion>
                {fbError && <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{fbError}</p>}
              </div>
            )}

            {/* WhatsApp */}
            {selectedChannels.includes('whatsapp') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#25D366' }}>💬</div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>WhatsApp Business</p>
                </div>
                <div className="space-y-3">
                  <Input
                    label="Phone Number ID"
                    placeholder="Ej: 123456789012345"
                    value={waPhoneId}
                    onChange={e => setWaPhoneId(e.target.value)}
                  />
                  <Input
                    label="Business Account ID"
                    placeholder="Ej: 987654321098765"
                    value={waAccountId}
                    onChange={e => setWaAccountId(e.target.value)}
                  />
                  <Input
                    label="Access Token de WhatsApp"
                    placeholder="EAAxxxxxxxxxxxxxxx..."
                    value={waToken}
                    onChange={e => setWaToken(e.target.value)}
                  />
                </div>
                <HelpAccordion title="¿Dónde encuentro estos datos?">
                  <p>Meta Business Suite → Tu app → WhatsApp → Configuración de la API</p>
                  <p>El <strong>Phone Number ID</strong> y el <strong>Business Account ID</strong> están en esa sección. El token se genera desde <strong>System Users</strong> o usa el token temporal de prueba.</p>
                </HelpAccordion>
                {waError && <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{waError}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="button" variant="primary" onClick={goToAgent} className="flex-1 py-3 rounded-xl">
                Continuar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Agente IA ── */}
        {step === 3 && (
          <form onSubmit={form3.handleSubmit(onStep3)} className="space-y-6">
            <StepHeader
              title="Configura tu agente IA"
              subtitle="El agente responderá a tus clientes por los canales conectados, 24/7, de forma automática."
            />

            <InfoBox>
              <p className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>¿Cómo funciona el agente?</p>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--color-muted)' }}>
                Cuando un cliente te escribe, el agente lee el mensaje, consulta tu catálogo y responde automáticamente.
                Si quiere comprar, crea la orden y da un código de pedido.
              </p>
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
Sé amable y usa un tono profesional pero cercano.`}
                className="rounded-lg border px-3.5 py-2.5 text-sm transition-all outline-none resize-none"
                style={{
                  borderColor: form3.formState.errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,48,48,0.1)' }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = form3.formState.errors.system_prompt ? 'var(--color-primary)' : 'var(--color-border)'
                  e.currentTarget.style.boxShadow = ''
                }}
              />
              {form3.formState.errors.system_prompt && (
                <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                  {form3.formState.errors.system_prompt.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
                style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                {formError}
              </p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </Button>
              <Button type="submit" variant="primary" loading={isLoading} className="flex-1 py-3 rounded-xl">
                Crear tienda <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 4: Éxito ── */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: '#DCFCE7' }}>
              <CheckCircle className="h-8 w-8" style={{ color: '#15803D' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>
                ¡{nombreTienda || 'Tu tienda'} está lista!
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
                Tu agente ya puede recibir mensajes por tus canales conectados y crear pedidos automáticamente.
              </p>
            </div>

            {/* Channels connected summary */}
            <div className="w-full flex gap-2 justify-center flex-wrap">
              {selectedChannels.includes('instagram') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#E1306C' }}>
                  @ Instagram
                </span>
              )}
              {selectedChannels.includes('facebook') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#1877F2' }}>
                  f Facebook
                </span>
              )}
              {selectedChannels.includes('whatsapp') && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#25D366' }}>
                  💬 WhatsApp
                </span>
              )}
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
              <Button type="button" variant="primary" className="w-full py-3 rounded-xl text-base" onClick={() => router.push('/catalog')}>
                Ir a mi panel <ArrowRight className="h-4 w-4" />
              </Button>
              <Button type="button" variant="secondary" className="w-full py-3 rounded-xl text-base" onClick={resetWizard}>
                <Plus className="h-4 w-4" /> Agregar otra tienda
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

