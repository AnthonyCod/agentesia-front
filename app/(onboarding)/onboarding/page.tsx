import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="mb-8 text-center">
        <span className="text-4xl mb-3 block">🌙</span>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-ink)', letterSpacing: '-0.03em' }}>
          Crea tu primera tienda
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Conecta tu Instagram y activa tu agente IA en 3 pasos
        </p>
      </div>
      <OnboardingWizard />
    </div>
  )
}
