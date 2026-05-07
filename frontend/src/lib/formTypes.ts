import type { ReactFormExtendedApi } from '@tanstack/react-form'

/** Acá no metemos validación async rara; es el default de useForm si no le cargás opciones. */
type FormOpts = undefined

/**
 * Lo que te devuelve useForm<T>() cuando no le pasás validadores genéricos complicados.
 */
export type AppFormApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  FormOpts,
  unknown
>
