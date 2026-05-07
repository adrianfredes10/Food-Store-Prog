import type { AnyFieldApi } from '@tanstack/react-form'

import type { AppFormApi } from '../../lib/formTypes'
import type { Categoria } from '../../types/categoria'
import type { Ingrediente } from '../../types/ingrediente'
import type {
  IngredienteInput,
  Producto,
  ProductoFormValues,
} from '../../types/producto'

export interface ProductoModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Producto | null
  categorias: Categoria[]
  catalogoIngredientes: Ingrediente[]
  form: AppFormApi<ProductoFormValues>
}

function fieldError(field: AnyFieldApi) {
  return field.state.meta.errors.join(', ')
}

export default function ProductoModal({
  isOpen,
  onClose,
  initialData,
  categorias,
  catalogoIngredientes,
  form,
}: ProductoModalProps) {
  if (!isOpen) return null

  const title = initialData ? 'Editar producto' : 'Nuevo producto'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="producto-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="producto-modal-title" className="mb-4 text-lg font-semibold text-slate-900">
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
                  rows={2}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            )}
          </form.Field>
          <div className="grid grid-cols-2 gap-3">
            <form.Field
              name="precio"
              validators={{
                onChange: ({ value }) => (value <= 0 ? 'Precio debe ser mayor a 0' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                    Precio
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min={0.01}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <p className="mt-1 text-xs text-red-600">{fieldError(field)}</p>
                  ) : null}
                </div>
              )}
            </form.Field>
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) => (value < 0 ? 'Stock no puede ser negativo' : undefined),
              }}
            >
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                    Stock
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    min={0}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number.parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <p className="mt-1 text-xs text-red-600">{fieldError(field)}</p>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>
          <form.Field name="imagen_url">
            {(field) => (
              <div>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                  URL de imagen (opcional)
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            )}
          </form.Field>
          <form.Field name="categoria_id">
            {(field) => (
              <div>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-slate-700">
                  Categoría
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="" disabled>
                    Seleccioná una categoría
                  </option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="ingredientes">
            {(field) => {
              const rows: IngredienteInput[] = field.state.value
              return (
                <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">Ingredientes y cantidades</span>
                    <button
                      type="button"
                      className="text-xs font-medium text-emerald-800 hover:underline"
                      onClick={() =>
                        field.handleChange([
                          ...rows,
                          { ingrediente_id: catalogoIngredientes[0]?.id ?? 0, cantidad: 1 },
                        ])
                      }
                    >
                      + Agregar fila
                    </button>
                  </div>
                  {rows.length === 0 ? (
                    <p className="text-xs text-slate-500">Podés dejar la lista vacía.</p>
                  ) : null}
                  {rows.map((row, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-2">
                      <div className="min-w-[140px] flex-1">
                        <label className="mb-1 block text-xs text-slate-600">Ingrediente</label>
                        <select
                          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                          value={row.ingrediente_id}
                          onChange={(e) => {
                            const next = [...rows]
                            next[index] = {
                              ...next[index],
                              ingrediente_id: Number(e.target.value),
                            }
                            field.handleChange(next)
                          }}
                        >
                          {catalogoIngredientes.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.nombre} ({ing.unidad})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-28">
                        <label className="mb-1 block text-xs text-slate-600">Cantidad</label>
                        <input
                          type="number"
                          step="0.01"
                          min={0.01}
                          className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                          value={row.cantidad}
                          onChange={(e) => {
                            const next = [...rows]
                            next[index] = {
                              ...next[index],
                              cantidad: Number(e.target.value),
                            }
                            field.handleChange(next)
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 hover:bg-red-200"
                        onClick={() => field.handleChange(rows.filter((_, j) => j !== index))}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )
            }}
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
              disabled={form.state.isSubmitting || categorias.length === 0}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
