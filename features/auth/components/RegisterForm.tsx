'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useAuth } from '../hooks/useAuth'

const registerSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegisterLoading } = useAuth()
  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data)
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'data' in err
          ? (err as { data: { error: string } }).data?.error
          : 'Error al registrarse'
      setError('root', { message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Email"      type="email"    autoComplete="email"        {...register('email')}    error={errors.email?.message} />
      <Input label="Contraseña" type="password" autoComplete="new-password" {...register('password')} error={errors.password?.message} />

      {errors.root && (
        <p className="rounded-lg px-3.5 py-2.5 text-sm font-medium"
          style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          {errors.root.message}
        </p>
      )}

      <Button type="submit" variant="primary" loading={isRegisterLoading} className="w-full py-3 rounded-xl text-base">
        Crear cuenta gratis
      </Button>

      <p className="text-center text-sm" style={{ color: 'var(--color-muted)' }}>
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-primary)' }}>
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
