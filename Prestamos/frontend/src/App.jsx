function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Proyecto FullStack oficial guiado</p>
        <h1>App de control de préstamos entre personas</h1>
        <p className="lead">
          Frontend base preparado para consumir la API de Node + Express.
        </p>
      </header>

      <main className="card">
        <h2>Fase 4 completada</h2>
        <p>
          El frontend ya está creado, tiene estilos base y dispone de un cliente
          HTTP reutilizable para hablar con la API.
        </p>
        <ul>
          <li>React funciona correctamente.</li>
          <li>Vite arranca sin errores.</li>
          <li>La estructura del proyecto está limpia.</li>
          <li>La URL base de la API se lee desde <code>.env</code>.</li>
        </ul>
      </main>
    </div>
  )
}

export default App