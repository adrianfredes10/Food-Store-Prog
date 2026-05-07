import type { AnyFieldApi } from '@tanstack/react-form'

import type { AppFormApi } from '../../lib/formTypes'
import type { Categoria } from '../../types/categoria'

export interface CategoriaFormValues {
  nombre: string
  descripcion: string
}

export interface CategoriaModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Categoria | null
  form: AppFormApi<CategoriaFormValues>
}

function fieldError(field: AnyFieldApi) {
  return field.state.meta.errors.join(', ')
}

export default function CategoriaModal({
  isOpen,
  onClose,
  initialData,
  form,
}: CategoriaModalProps) {
  if (!isOpen) {
    return null
  }

  const title = initialData ? 'Editar categoría' : 'Nueva categoría'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="categoria-modal-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="categoria-modal-title" className="mb-4 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                value.trim().length < 2 ? 'Mínimo 2 caracteres' : undefined,
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                {field.state.meta.errors.length > 0 ? (
                  <p className="mt-1 text-xs text-red-600">{fieldError(field)}</p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            )}
          </form.Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
              disabled={form.state.isSubmitting}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
