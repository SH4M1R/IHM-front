"use client"

const PASOS = [
  "pagado",
  "alistando",
  "en_camino",
  "entregado",
]

export default function BarraProgreso({ estado }) {
  const idx = PASOS.indexOf(estado)

  return (
    <div className="w-full space-y-1">
      {/* Barra visual continua */}
      <div className="flex items-center w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-900 h-full rounded-full transition-all duration-500"
          style={{ width: `${idx === -1 ? 0 : ((idx + 1) / PASOS.length) * 100}%` }}
        />
      </div>
      
      {/* Etiquetas inferiores basadas en tus estados fijos */}
      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-0.5">
        <span className={idx >= 0 ? "text-blue-900" : ""}>Pagado</span>
        <span className={idx >= 1 ? "text-blue-900" : ""}>Alistando</span>
        <span className={idx >= 2 ? "text-blue-900" : ""}>En Camino</span>
        <span className={idx >= 3 ? "text-blue-900" : ""}>Entregado</span>
      </div>
    </div>
  )
}