import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import IngredienteList from '../components/ingredientes/IngredienteList'
import IngredienteModal, {
  type IngredienteFormValues,
} from '../components/ingredientes/IngredienteModal'
import type { AppFormApi } from '../lib/formTypes'
import { API_URL, fetchJson } from '../lib/api'
import type {
  Ingrediente,
  IngredienteCreate,
  IngredienteUpdate,
  UnidadMedida,
} from '../types/ingrediente'

const LIST_PARAMS = new URLSearchParams({ offset: '0', limit: '100' })

async function fetchIngredientes(): Promise<Ingrediente[]> {
  return fetchJson<Ingrediente[]>(`${API_URL}/ingredientes?${LIST_PARAMS}`)
}

const defaultForm = { nombre: '', unidad: 'g' as UnidadMedida }

export default function IngredientsPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Ingrediente | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: fetchIngredientes,
  })

  const createMutation = useMutation({
    mutationFn: (body: IngredienteCreate) =>
      fetchJson<Ingrediente>(`${API_URL}/ingredientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: IngredienteUpdate }) =>
      fetchJson<Ingrediente>(`${API_URL}/ingredientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchJson<void>(`${API_URL}/ingredientes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
    },
  })

  const form = useForm({
    defaultValues: defaultForm,
    onSubmit: async ({ value }) => {
      const nombre = value.nombre.trim()
      if (editing) {
        const body: IngredienteUpdate = {}
        if (nombre !== editing.nombre) body.nombre = nombre
        if (value.unidad !== editing.unidad) body.unidad = value.unidad
        await updateMutation.mutateAsync({ id: editing.id, body })
      } else {
        await createMutation.mutateAsync({ nombre, unidad: value.unidad })
      }
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (ing: Ingrediente) => {
    setEditing(ing)
    form.reset({ nombre: ing.nombre, unidad: ing.unidad })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    form.reset(defaultForm)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Ingredientes</h1>
        <button
          type="button"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          onClick={openCreate}
        >
          Nuevo ingrediente
        </button>
      </div>

      {isLoading ? <p className="text-slate-600">Cargando…</p> : null}
      {isError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error instanceof Error ? error.message : 'Error al cargar'}
        </p>
      ) : null}

      {data ? (
        <IngredienteList
          data={data}
          onEdit={openEdit}
          onDelete={(ing) => void deleteMutation.mutate(ing.id)}
        />
      ) : null}

      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-sm text-red-600">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : updateMutation.error instanceof Error
              ? updateMutation.error.message
              : 'Error al guardar'}
        </p>
      )}

      <IngredienteModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialData={editing}
        form={form as unknown as AppFormApi<IngredienteFormValues>}
      />
    </div>
  )
}
