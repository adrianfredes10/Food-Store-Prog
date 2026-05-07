import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

import ProductoList from '../components/productos/ProductoList'
import ProductoModal from '../components/productos/ProductoModal'
import type { AppFormApi } from '../lib/formTypes'
import { API_URL, fetchJson } from '../lib/api'
import type { Categoria } from '../types/categoria'
import type { Ingrediente } from '../types/ingrediente'
import type {
  Producto,
  ProductoCreate,
  ProductoFormValues,
  ProductoUpdate,
} from '../types/producto'

const LIST_PARAMS = new URLSearchParams({ offset: '0', limit: '100' })

async function fetchCategorias(): Promise<Categoria[]> {
  return fetchJson<Categoria[]>(`${API_URL}/categorias?${LIST_PARAMS}`)
}

async function fetchIngredientesCatalogo(): Promise<Ingrediente[]> {
  return fetchJson<Ingrediente[]>(`${API_URL}/ingredientes?${LIST_PARAMS}`)
}

async function fetchProductos(): Promise<Producto[]> {
  return fetchJson<Producto[]>(`${API_URL}/productos?${LIST_PARAMS}`)
}

function productoToFormValues(p: Producto): ProductoFormValues {
  return {
    nombre: p.nombre,
    descripcion: p.descripcion ?? '',
    precio: p.precio,
    stock: p.stock,
    imagen_url: p.imagen_url ?? '',
    categoria_id: p.categoria.id,
    ingredientes: p.ingredientes.map((i) => ({
      ingrediente_id: i.id,
      cantidad: i.cantidad,
    })),
  }
}

export default function ProductsPage() {
  const { id: routeId } = useParams()
  const detailId = routeId ? Number.parseInt(routeId, 10) : NaN
  const showDetail = !Number.isNaN(detailId)

  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)

  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: fetchCategorias,
  })

  const ingredientesQuery = useQuery({
    queryKey: ['ingredientes'],
    queryFn: fetchIngredientesCatalogo,
  })

  const productosQuery = useQuery({
    queryKey: ['productos'],
    queryFn: fetchProductos,
  })

  const detalleQuery = useQuery({
    queryKey: ['productos', detailId],
    queryFn: () => fetchJson<Producto>(`${API_URL}/productos/${detailId}`),
    enabled: showDetail,
  })

  const emptyForm = (): ProductoFormValues => ({
    nombre: '',
    descripcion: '',
    precio: 1,
    stock: 0,
    imagen_url: '',
    categoria_id: categoriasQuery.data?.[0]?.id ?? 0,
    ingredientes: [],
  })

  const createMutation = useMutation({
    mutationFn: (body: ProductoCreate) =>
      fetchJson<Producto>(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: ProductoUpdate }) =>
      fetchJson<Producto>(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: (_data, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
      void queryClient.invalidateQueries({ queryKey: ['productos', vars.id] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchJson<void>(`${API_URL}/productos/${id}`, { method: 'DELETE' }),
    onSuccess: (_void, deletedId) => {
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
      void queryClient.removeQueries({ queryKey: ['productos', deletedId] })
    },
  })

  const form = useForm({
    defaultValues: emptyForm(),
    onSubmit: async ({ value }) => {
      if (!value.categoria_id) {
        throw new Error('Seleccioná una categoría')
      }
      const imagenTrim = value.imagen_url.trim()
      if (editing) {
        const body: ProductoUpdate = {
          nombre: value.nombre.trim(),
          descripcion: value.descripcion.trim() || undefined,
          precio: value.precio,
          stock: value.stock,
          imagen_url: imagenTrim || undefined,
          categoria_id: value.categoria_id,
          ingredientes: value.ingredientes,
        }
        await updateMutation.mutateAsync({ id: editing.id, body })
      } else {
        const body: ProductoCreate = {
          nombre: value.nombre.trim(),
          descripcion: value.descripcion.trim() || undefined,
          precio: value.precio,
          stock: value.stock,
          imagen_url: imagenTrim || undefined,
          categoria_id: value.categoria_id,
          ingredientes: value.ingredientes,
        }
        await createMutation.mutateAsync(body)
      }
    },
  })

  const categorias = categoriasQuery.data ?? []
  const catalogoIngredientes = ingredientesQuery.data ?? []

  const openCreate = () => {
    setEditing(null)
    form.reset(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (p: Producto) => {
    setEditing(p)
    form.reset(productoToFormValues(p))
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    form.reset(emptyForm())
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
        <button
          type="button"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
          onClick={openCreate}
          disabled={categorias.length === 0}
        >
          Nuevo producto
        </button>
      </div>

      {categoriasQuery.isLoading || productosQuery.isLoading ? (
        <p className="text-slate-600">Cargando…</p>
      ) : null}
      {categoriasQuery.isError || productosQuery.isError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {categoriasQuery.error instanceof Error
            ? categoriasQuery.error.message
            : productosQuery.error instanceof Error
              ? productosQuery.error.message
              : 'Error al cargar'}
        </p>
      ) : null}

      {showDetail ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-800">Detalle</h2>
            <Link
              to="/products"
              className="text-sm font-medium text-emerald-800 hover:underline"
            >
              Volver al listado
            </Link>
          </div>
          {detalleQuery.isLoading ? <p className="text-sm text-slate-600">Cargando producto…</p> : null}
          {detalleQuery.isError ? (
            <p className="text-sm text-red-600">
              {detalleQuery.error instanceof Error
                ? detalleQuery.error.message
                : 'Error'}
            </p>
          ) : null}
          {detalleQuery.data ? (
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-medium text-slate-900">Nombre:</span>{' '}
                {detalleQuery.data.nombre}
              </p>
              <p>
                <span className="font-medium text-slate-900">Categoría:</span>{' '}
                {detalleQuery.data.categoria.nombre}
              </p>
              <p>
                <span className="font-medium text-slate-900">Precio / Stock:</span>{' '}
                {detalleQuery.data.precio.toFixed(2)} / {detalleQuery.data.stock}
              </p>
              {detalleQuery.data.descripcion ? (
                <p>
                  <span className="font-medium text-slate-900">Descripción:</span>{' '}
                  {detalleQuery.data.descripcion}
                </p>
              ) : null}
              <div>
                <p className="font-medium text-slate-900">Ingredientes</p>
                {detalleQuery.data.ingredientes.length === 0 ? (
                  <p className="text-slate-500">Sin ingredientes asociados.</p>
                ) : (
                  <ul className="mt-1 list-inside list-disc">
                    {detalleQuery.data.ingredientes.map((i) => (
                      <li key={i.id}>
                        {i.nombre} — {i.cantidad} {i.unidad}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {productosQuery.data ? (
        <ProductoList
          data={productosQuery.data}
          onEdit={openEdit}
          onDelete={(p) => void deleteMutation.mutate(p.id)}
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

      <ProductoModal
        isOpen={modalOpen}
        onClose={closeModal}
        initialData={editing}
        categorias={categorias}
        catalogoIngredientes={catalogoIngredientes}
        form={form as unknown as AppFormApi<ProductoFormValues>}
      />
    </div>
  )
}
