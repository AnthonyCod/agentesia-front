import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-sm dark:bg-gray-900">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agentesia</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
