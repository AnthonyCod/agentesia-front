import { OnboardingWizard } from '@/features/onboarding/components/OnboardingWizard'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agentesia</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Configura tu tienda en 3 pasos</p>
      </div>
      <OnboardingWizard />
    </div>
  )
}
