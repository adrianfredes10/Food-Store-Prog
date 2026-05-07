import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-700 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link to="/categories" className="text-lg font-semibold text-emerald-800">
          FoodStore
        </Link>
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/categories" className={linkClass}>
            Categorías
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Productos
          </NavLink>
          <NavLink to="/ingredients" className={linkClass}>
            Ingredientes
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
