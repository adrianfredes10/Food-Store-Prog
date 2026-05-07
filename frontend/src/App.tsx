import { BrowserRouter } from 'react-router-dom'

import Navbar from './components/ui/Navbar'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
