import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import CategoriaList from '../components/categorias/CategoriaList'
import CategoriaModal from '../components/categorias/CategoriaModal'
import type { AppFormApi } from '../lib/formTypes'
import { API_URL, fetchJson } from '../lib/api'
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types/categoria'
import type { CategoriaFormValues } from '../components/categorias/CategoriaModal'

const LIST_PARAMS = new URLSearchParams({ offset: '0', limit: '100' })

async function fetchCategorias(): Promise<Categoria[]> {
  return fetchJson<Categoria[]>(`${API_URL}/categorias?${LIST_PARAMS}`)
}

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: fetchCategorias,
  })

  const createMutation = useMutation({
    mutationFn: (body: CategoriaCreate) =>
      fetchJson<Categoria>(`${API_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: CategoriaUpdate }) =>
      fetchJson<Categoria>(`${API_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchJson<void>(`${API_URL}/categorias/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })

  const defaultForm = { nombre: '', descripcion: '' }

  const form = useForm({
    defaultValues: defaultForm,
    onSubmit: async ({ value }) => {
      const nombre = value.nombre.trim()
      const descripcion = value.descripcion.trim()
      if (editing) {
        const body: CategoriaUpdate = {}
        if (nombre !== editing.nombre) body.nombre = nombre
        if ((descripcion || null) !== (editing.descripcion ?? '')) {
          body.descripcion = descripcion || undefined
        }
        await updateMutation.mutateAsync({ id: editing.id, body })
      } else {
        const body: CategoriaCreate = { nombre }
        if (descripcion) body.descripcion = descripcion
        await createMutation.mutateAsync(body)
      }
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset(defaultForm)
    setModalOpen(true)
  }

  const openEdit = (c: Categoria) => {
    setEditing(c)
    form.reset({
      nombre: c.nombre,
      descripcion: c.descripcion ?? '',
    })
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
        <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>
        <button
          type="button"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          onClick={openCreate}
        >
          Nueva categoría
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-600">Cargando…</p>
      ) : null}
      {isError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error instanceof Error ? error.message : 'Error al cargar'}
        </p>
      ) : null}

      {data ? <CategoriaList data={data} onEdit={openEdit} onDelete={(c) => void deleteMutation.mutate(c.id)} /> : null}

      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-sm text-red-600">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : updateMutation.error instanceof Error
              ? updateMutation.error.message
              : 'Error al guardar'}
        </p>
      )}

      <CategoriaModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialData={editing}
        form={form as unknown as AppFormApi<CategoriaFormValues>}
      />
    </div>
  )
}
