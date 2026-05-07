import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'

import type { Categoria } from '../../types/categoria'

export interface CategoriaListProps {
  data: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (categoria: Categoria) => void
}

export default function CategoriaList({
  data,
  onEdit,
  onDelete,
}: CategoriaListProps) {
  const columns: ColumnDef<Categoria>[] = [
    { accessorKey: 'id', header: 'ID', cell: (info) => info.getValue() },
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: (info) => (info.getValue() as string | null) ?? '—',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-800 hover:bg-slate-300"
            onClick={() => onEdit(row.original)}
          >
            Editar
          </button>
          <button
            type="button"
            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
            onClick={() => onDelete(row.original)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border-b border-slate-200 px-3 py-2 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80'}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b border-slate-100 px-3 py-2 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
