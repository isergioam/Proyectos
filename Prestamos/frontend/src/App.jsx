import { useState } from 'react'
import ObjetosPage from './pages/ObjetosPage'
import PrestamosPage from './pages/PrestamosPage'

function App() {
  const [activePage, setActivePage] = useState('objetos')

  return (
    <div>
      <nav className="top-nav">
        <button
          type="button"
          className={activePage === 'objetos' ? 'nav-button nav-button-active' : 'nav-button'}
          onClick={() => setActivePage('objetos')}
        >
          Objetos
        </button>

        <button
          type="button"
          className={activePage === 'prestamos' ? 'nav-button nav-button-active' : 'nav-button'}
          onClick={() => setActivePage('prestamos')}
        >
          Préstamos
        </button>
      </nav>

      {activePage === 'objetos' ? <ObjetosPage /> : <PrestamosPage />}
    </div>
  )
}

export default App