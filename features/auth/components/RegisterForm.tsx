'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { useAuth } from '../hooks/useAuth'

const registerSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, isRegisterLoading } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre completo"
        type="text"
        autoComplete="name"
        {...register('nombre')}
        error={errors.nombre?.message}
      />
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
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {errors.root && (
        <p className="text-sm text-red-600 dark:text-red-400">{errors.root.message}</p>
      )}
      <Button type="submit" variant="primary" loading={isRegisterLoading} className="w-full">
        Crear cuenta
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
