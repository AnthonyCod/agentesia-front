'use client'
import { Info, ExternalLink } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'

export interface WhatsAppFormFields {
  wa_phone_number_id: string
  wa_business_account_id: string
  wa_access_token: string
}

interface WhatsAppConnectSectionProps {
  register: UseFormRegister<WhatsAppFormFields>
  errors: FieldErrors<WhatsAppFormFields>
}

function HelpRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>{label}</p>
      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{children}</p>
    </div>
  )
}

export function WhatsAppConnectSection({ register, errors }: WhatsAppConnectSectionProps) {
  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="rounded-xl p-4 flex gap-3 text-sm"
        style={{ backgroundColor: '#25D36615', border: '1px solid #25D36640' }}>
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
        <div className="space-y-2">
          <p className="font-semibold" style={{ color: 'var(--color-ink)' }}>
            Antes de empezar con WhatsApp
          </p>
          <ul className="text-xs space-y-0.5 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            <li>✓ Cuenta <strong>Meta Business Suite</strong> verificada</li>
            <li>✓ Número de WhatsApp Business registrado en Meta</li>
            <li>✓ App de Meta con permisos <code>whatsapp_business_messaging</code></li>
          </ul>
          <a
            href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: '#25D366' }}
          >
            Guía oficial de Meta <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <Input
        label="Phone Number ID"
        placeholder="Ej: 123456789012345"
        {...register('wa_phone_number_id')}
        error={errors.wa_phone_number_id?.message as string}
      />

      <Input
        label="Business Account ID"
        placeholder="Ej: 987654321098765"
        {...register('wa_business_account_id')}
        error={errors.wa_business_account_id?.message as string}
      />

      <Input
        label="Access Token de WhatsApp"
        placeholder="EAAxxxxxxxxxxxxxxx..."
        {...register('wa_access_token')}
        error={errors.wa_access_token?.message as string}
      />

      {/* Where to find these */}
      <div className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>
        <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
          ¿Dónde encontrar estos datos?
        </p>
        <div className="space-y-3">
          <HelpRow label="Phone Number ID">
            Meta Business Suite → Tu app → WhatsApp → Configuración → <strong>ID de número de teléfono</strong>
          </HelpRow>
          <HelpRow label="Business Account ID">
            Meta Business Suite → Tu app → WhatsApp → Configuración → <strong>ID de cuenta de WhatsApp Business</strong>
          </HelpRow>
          <HelpRow label="Access Token">
            Meta for Developers → Tu app → WhatsApp → Configuración de la API → <strong>Token de acceso temporal</strong> (o genera uno permanente desde System Users)
          </HelpRow>
        </div>
      </div>
    </div>
  )
}
