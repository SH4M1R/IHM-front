"use client"

const ESTADOS = {
  pagado: { label: "Pagado", color: "text-blue-600" },
  alistando: { label: "Alistando", color: "text-amber-600" },
  en_camino: { label: "En camino", color: "text-blue-900 font-extrabold" },
  entregado: { label: "Entregado", color: "text-emerald-600" },
}

export default function BadgeEstado({ estado }) {
  // Si por alguna razón viene un estado diferente, muestra el string original del backend para no romper nada
  const e = ESTADOS[estado] || {
    label: estado,
    color: "text-gray-500",
  }

  return (
    <span className={`text-xs font-bold tracking-tight ${e.color} flex items-center gap-1.5`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {e.label}
    </span>
  )
}