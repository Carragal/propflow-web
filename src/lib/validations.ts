import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresá un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(2, 'Mínimo 2 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Ingresá un email válido'),
    role: z.enum(['comprador', 'inmobiliaria'], {
      error: 'Seleccioná un rol',
    }),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
    terms: z.literal(true, {
      error: 'Debés aceptar los términos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
