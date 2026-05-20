'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { GoogleLoginButton } from './GoogleLoginButton'

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoginLoading } = useAuth()
  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Email"      type="email"    autoComplete="email"            {...register('email')}    error={errors.email?.message} />
      <Input label="Contraseña" type="password" autoComplete="current-password" {...register('password')} error={errors.password?.message} />

      {errors.root && (
        <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          {errors.root.message}
        </p>
      )}

      <Button type="submit" variant="primary" loading={isLoginLoading} className="w-full py-3 rounded-xl text-base">
        Iniciar sesión
      </Button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>o continúa con</span>
        <div className="flex-1 border-t" style={{ borderColor: 'var(--color-border)' }} />
      </div>

      <GoogleLoginButton />

      <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-primary)' }}>
          Regístrate gratis
        </Link>
      </p>
    </form>
  )
}
