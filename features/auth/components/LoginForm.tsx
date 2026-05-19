'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useAuth } from '../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginLoading } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err as { data: { error: string } }).data?.error
          : 'Credenciales inválidas'
      setError('root', { message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {errors.root && (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
      )}
      <Button type="submit" variant="primary" loading={isLoginLoading} className="w-full">
        Iniciar sesión
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
