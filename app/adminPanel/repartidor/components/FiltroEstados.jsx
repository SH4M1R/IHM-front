"use client"

const estados = [
  { key: "todos", label: "Todos" },
  { key: "pagado", label: "Pagados" },
  { key: "alistando", label: "Alistando" },
  { key: "en_camino", label: "En Camino" },
  { key: "entregado", label: "Entregados" },
]

export default function FiltroEstados({ filtro, setFiltro }) {
  return (
      <div className="flex gap-2 overflow-x-auto py-3 px-1 scrollbar-none snap-x touch-pan-x">
        {estados.map((e) => {
          const activo = filtro === e.key
          return (
            <button
              key={e.key}
              onClick={() => setFiltro(e.key)}
              className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap snap-mini snap-start transition-all duration-200
              ${
                activo
                  ? "bg-blue-950 text-white shadow-md shadow-blue-950/10 scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {e.label}
            </button>
          )
        })}
      </div>
  )
}