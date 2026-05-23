'use client'

export type ChannelId = 'instagram' | 'facebook' | 'whatsapp'

interface Channel {
  id: ChannelId
  label: string
  description: string
  color: string
  icon: string
}

const CHANNELS: Channel[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'DMs de Instagram Business — requiere página de Facebook vinculada.',
    color: '#E1306C',
    icon: '@',
  },
  {
    id: 'facebook',
    label: 'Facebook Messenger',
    description: 'Mensajes directos a tu página de Facebook.',
    color: '#1877F2',
    icon: 'f',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Business',
    description: 'API oficial de WhatsApp — requiere cuenta Meta Business Suite.',
    color: '#25D366',
    icon: '💬',
  },
]

interface ChannelSelectorProps {
  selected: ChannelId[]
  onChange: (ids: ChannelId[]) => void
  error?: string
}

export function ChannelSelector({ selected, onChange, error }: ChannelSelectorProps) {
  function toggle(id: ChannelId) {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-2">
      {CHANNELS.map(ch => {
        const isSelected = selected.includes(ch.id)
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => toggle(ch.id)}
            className="w-full text-left rounded-xl px-4 py-3.5 transition-all flex items-start gap-3"
            style={{
              border: `2px solid ${isSelected ? ch.color : 'var(--color-border)'}`,
              backgroundColor: isSelected ? `${ch.color}10` : '#fff',
            }}
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: ch.color }}
            >
              {ch.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
                {ch.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {ch.description}
              </p>
            </div>

            {/* Checkbox */}
            <div
              className="flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center mt-0.5"
              style={{
                borderColor: isSelected ? ch.color : 'var(--color-border)',
                backgroundColor: isSelected ? ch.color : 'transparent',
              }}
            >
              {isSelected && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        )
      })}

      {error && (
        <p className="text-xs font-medium pt-1" style={{ color: 'var(--color-primary)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
