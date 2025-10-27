'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gradient mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error del servidor</h2>
        <p className="text-gray-600 mb-8">Algo salió mal. Inténtalo de nuevo.</p>
        <button 
          onClick={reset}
          className="btn-primary mr-4"
        >
          Reintentar
        </button>
        <a 
          href="/" 
          className="btn-secondary"
        >
          Volver al Dashboard
        </a>
      </div>
    </div>
  )
}
