import { Navigate, Route, Routes } from 'react-router-dom'

import CategoriesPage from './pages/CategoriesPage'
import IngredientsPage from './pages/IngredientsPage'
import ProductsPage from './pages/ProductsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/categories" replace />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductsPage />} />
      <Route path="/ingredients" element={<IngredientsPage />} />
    </Routes>
  )
}
